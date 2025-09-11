// Multi-API Crypto Analysis Service
export interface ApiResponse {
  source: string;
  data: any;
  success: boolean;
  error?: string;
  responseTime: number;
}

export interface AggregatedWalletData {
  address: string;
  balance: {
    btc: number;
    usd: number;
    confirmed: number;
    unconfirmed: number;
  };
  transactions: {
    total: number;
    received: number;
    sent: number;
    firstSeen: string;
    lastActivity: string;
  };
  riskAnalysis: {
    score: number;
    category: string;
    flags: string[];
    confidence: number;
  };
  networkAnalysis: {
    clustering: any[];
    associations: string[];
    mixingDetected: boolean;
  };
  sources: string[];
  lastUpdated: string;
}

export class CryptoApiService {
  private static readonly APIs = {
    BLOCKCHAIN_INFO: 'https://blockchain.info',
    BLOCKCYPHER: 'https://api.blockcypher.com/v1/btc/main',
    BLOCKSTREAM: 'https://blockstream.info/api',
    BLOCKCHAIR: 'https://api.blockchair.com/bitcoin',
    INSIGHT: 'https://insight.bitpay.com/api'
  };

  private static readonly RATE_LIMITS: { [key: string]: number } = {
    BLOCKCHAIN_INFO: 10000, // 10 seconds
    BLOCKCYPHER: 3000,      // 3 seconds  
    BLOCKSTREAM: 2000,      // 2 seconds
    BLOCKCHAIR: 1000,       // 1 second
    INSIGHT: 2000           // 2 seconds
  };

  private static lastCallTimes: { [key: string]: number } = {};

  // Rate limiting helper
  private static async waitForRateLimit(apiName: string): Promise<void> {
    const lastCall = this.lastCallTimes[apiName] || 0;
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    const requiredWait = this.RATE_LIMITS[apiName] || 1000;

    if (timeSinceLastCall < requiredWait) {
      const waitTime = requiredWait - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastCallTimes[apiName] = Date.now();
  }

  // Generic API call with error handling and timing
  private static async makeApiCall(
    apiName: string, 
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse> {
    const startTime = Date.now();
    
    try {
      await this.waitForRateLimit(apiName);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CryptoAnalysis/1.0',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        source: apiName,
        data,
        success: true,
        responseTime
      };
    } catch (error) {
      return {
        source: apiName,
        data: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      };
    }
  }

  // Blockchain.info API
  static async getBlockchainInfo(address: string): Promise<ApiResponse> {
    const url = `${this.APIs.BLOCKCHAIN_INFO}/rawaddr/${address}?format=json&limit=50`;
    return this.makeApiCall('BLOCKCHAIN_INFO', url);
  }

  // BlockCypher API
  static async getBlockCypher(address: string): Promise<ApiResponse> {
    const url = `${this.APIs.BLOCKCYPHER}/addrs/${address}?includeScript=true&unspentOnly=false&limit=50`;
    return this.makeApiCall('BLOCKCYPHER', url);
  }

  // Blockstream API
  static async getBlockstream(address: string): Promise<ApiResponse> {
    const url = `${this.APIs.BLOCKSTREAM}/address/${address}`;
    return this.makeApiCall('BLOCKSTREAM', url);
  }

  // Blockstream Transactions
  static async getBlockstreamTxs(address: string): Promise<ApiResponse> {
    const url = `${this.APIs.BLOCKSTREAM}/address/${address}/txs`;
    return this.makeApiCall('BLOCKSTREAM', url);
  }

  // Blockchair API
  static async getBlockchair(address: string): Promise<ApiResponse> {
    const url = `${this.APIs.BLOCKCHAIR}/dashboards/address/${address}?limit=50`;
    return this.makeApiCall('BLOCKCHAIR', url);
  }

  // Get current Bitcoin price
  static async getBitcoinPrice(): Promise<ApiResponse> {
    const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    return this.makeApiCall('COINDESK', url);
  }

  // Aggregate data from all APIs
  static async getAggregatedWalletData(address: string): Promise<AggregatedWalletData> {
    console.log(`🔍 Analyzing address: ${address}`);
    
    // Make parallel API calls
    const [
      blockchainInfo,
      blockCypher,
      blockstream,
      blockstreamTxs,
      blockchair,
      btcPrice
    ] = await Promise.allSettled([
      this.getBlockchainInfo(address),
      this.getBlockCypher(address),
      this.getBlockstream(address),
      this.getBlockstreamTxs(address),
      this.getBlockchair(address),
      this.getBitcoinPrice()
    ]);

    // Process successful responses
    const successfulResponses: ApiResponse[] = [];
    const failedResponses: string[] = [];

    [blockchainInfo, blockCypher, blockstream, blockstreamTxs, blockchair, btcPrice].forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        successfulResponses.push(result.value);
      } else {
        const apiNames = ['BLOCKCHAIN_INFO', 'BLOCKCYPHER', 'BLOCKSTREAM', 'BLOCKSTREAM_TXS', 'BLOCKCHAIR', 'BITCOIN_PRICE'];
        failedResponses.push(apiNames[index]);
      }
    });

    if (successfulResponses.length === 0) {
      throw new Error('All APIs failed to respond');
    }

    // Get Bitcoin price for USD conversions
    let btcPriceUsd = 50000; // Default fallback
    const priceResponse = successfulResponses.find(r => r.source === 'COINDESK');
    if (priceResponse) {
      btcPriceUsd = priceResponse.data.bpi.USD.rate_float;
    }

    // Aggregate balance data
    const balanceData = this.aggregateBalanceData(successfulResponses, btcPriceUsd);
    
    // Aggregate transaction data
    const transactionData = this.aggregateTransactionData(successfulResponses);
    
    // Perform risk analysis
    const riskAnalysis = this.performRiskAnalysis(successfulResponses, transactionData);
    
    // Perform network analysis
    const networkAnalysis = this.performNetworkAnalysis(successfulResponses);

    return {
      address,
      balance: balanceData,
      transactions: transactionData,
      riskAnalysis,
      networkAnalysis,
      sources: successfulResponses.map(r => r.source),
      lastUpdated: new Date().toISOString()
    };
  }

  private static aggregateBalanceData(responses: ApiResponse[], btcPriceUsd: number) {
    let balance = 0;
    let confirmed = 0;
    let unconfirmed = 0;

    // Try to get balance from multiple sources for accuracy
    const blockchainInfo = responses.find(r => r.source === 'BLOCKCHAIN_INFO');
    const blockCypher = responses.find(r => r.source === 'BLOCKCYPHER');
    const blockstream = responses.find(r => r.source === 'BLOCKSTREAM');

    if (blockchainInfo?.data) {
      balance = blockchainInfo.data.final_balance / 100000000;
      confirmed = balance;
    }

    if (blockCypher?.data) {
      const bcBalance = blockCypher.data.balance / 100000000;
      const bcUnconfirmed = blockCypher.data.unconfirmed_balance / 100000000;
      
      // Use BlockCypher if it has more recent data
      if (bcBalance !== balance) {
        balance = bcBalance;
        confirmed = bcBalance;
        unconfirmed = bcUnconfirmed;
      }
    }

    if (blockstream?.data && blockstream.data.chain_stats) {
      const bsBalance = (blockstream.data.chain_stats.funded_txo_sum - blockstream.data.chain_stats.spent_txo_sum) / 100000000;
      
      // Cross-validate with Blockstream
      if (Math.abs(bsBalance - balance) < 0.001) {
        balance = bsBalance;
        confirmed = bsBalance;
      }
    }

    return {
      btc: balance,
      usd: balance * btcPriceUsd,
      confirmed,
      unconfirmed
    };
  }

  private static aggregateTransactionData(responses: ApiResponse[]) {
    let totalTxs = 0;
    let received = 0;
    let sent = 0;
    let firstSeen = '';
    let lastActivity = '';

    const blockchainInfo = responses.find(r => r.source === 'BLOCKCHAIN_INFO');
    const blockCypher = responses.find(r => r.source === 'BLOCKCYPHER');

    if (blockchainInfo?.data) {
      totalTxs = blockchainInfo.data.n_tx;
      received = blockchainInfo.data.total_received / 100000000;
      sent = blockchainInfo.data.total_sent / 100000000;
      
      if (blockchainInfo.data.txs && blockchainInfo.data.txs.length > 0) {
        const sortedTxs = blockchainInfo.data.txs.sort((a: any, b: any) => a.time - b.time);
        firstSeen = new Date(sortedTxs[0].time * 1000).toISOString();
        lastActivity = new Date(sortedTxs[sortedTxs.length - 1].time * 1000).toISOString();
      }
    }

    if (blockCypher?.data) {
      // Cross-validate with BlockCypher
      if (blockCypher.data.n_tx && Math.abs(blockCypher.data.n_tx - totalTxs) < 5) {
        totalTxs = Math.max(totalTxs, blockCypher.data.n_tx);
      }
    }

    return {
      total: totalTxs,
      received,
      sent,
      firstSeen: firstSeen || new Date().toISOString(),
      lastActivity: lastActivity || new Date().toISOString()
    };
  }

  private static performRiskAnalysis(responses: ApiResponse[], transactionData: any) {
    let score = 0;
    const flags: string[] = [];
    let confidence = 0.5;

    // High transaction volume
    if (transactionData.total > 10000) {
      score += 40;
      flags.push('Very High Volume');
      confidence += 0.2;
    } else if (transactionData.total > 1000) {
      score += 25;
      flags.push('High Volume');
      confidence += 0.1;
    }

    // Large amounts
    if (transactionData.received > 1000) {
      score += 30;
      flags.push('Large Amounts');
      confidence += 0.15;
    }

    // Rapid transaction patterns
    const blockchainInfo = responses.find(r => r.source === 'BLOCKCHAIN_INFO');
    if (blockchainInfo?.data?.txs) {
      const recentTxs = blockchainInfo.data.txs.slice(0, 20);
      let rapidCount = 0;
      
      for (let i = 1; i < recentTxs.length; i++) {
        if (recentTxs[i - 1].time - recentTxs[i].time < 3600) {
          rapidCount++;
        }
      }
      
      if (rapidCount > 10) {
        score += 25;
        flags.push('Rapid Transactions');
        confidence += 0.1;
      }
    }

    // Age analysis
    const accountAge = Date.now() - new Date(transactionData.firstSeen).getTime();
    const daysSinceFirst = accountAge / (1000 * 60 * 60 * 24);
    
    if (daysSinceFirst < 30 && transactionData.total > 100) {
      score += 20;
      flags.push('New Account High Activity');
      confidence += 0.1;
    }

    // Determine category
    let category = 'Normal';
    if (score >= 80) category = 'High Risk';
    else if (score >= 60) category = 'Suspicious';
    else if (score >= 40) category = 'Medium Risk';

    // Adjust confidence based on number of successful API calls
    confidence = Math.min(confidence + (responses.length * 0.1), 1.0);

    return {
      score: Math.min(score, 100),
      category,
      flags,
      confidence
    };
  }

  private static performNetworkAnalysis(responses: ApiResponse[]) {
    const clustering: any[] = [];
    const associations: string[] = [];
    let mixingDetected = false;

    // Analyze transaction patterns for clustering
    const blockchainInfo = responses.find(r => r.source === 'BLOCKCHAIN_INFO');
    if (blockchainInfo?.data?.txs) {
      const addresses = new Set<string>();
      
      blockchainInfo.data.txs.forEach((tx: any) => {
        // Collect input addresses
        tx.inputs?.forEach((input: any) => {
          if (input.prev_out?.addr) {
            addresses.add(input.prev_out.addr);
          }
        });
        
        // Collect output addresses
        tx.out?.forEach((output: any) => {
          if (output.addr) {
            addresses.add(output.addr);
          }
        });
      });
      
      // Look for mixing patterns
      const uniqueAddresses = Array.from(addresses);
      if (uniqueAddresses.length > 50) {
        mixingDetected = true;
      }
      
      associations.push(...uniqueAddresses.slice(0, 10));
    }

    return {
      clustering,
      associations,
      mixingDetected
    };
  }
}
