// Comprehensive Bitcoin Analysis API Service
// Integrates multiple blockchain APIs for robust data collection

export interface AggregatedWalletData {
  address: string;
  balance: number;
  transactionCount: number;
  firstSeen: string | null;
  lastSeen: string | null;
  totalReceived: number;
  totalSent: number;
  riskScore: number;
  riskFactors: string[];
  confidence: number;
  dataQuality: 'high' | 'medium' | 'low';
  apiSources: string[];
  transactions: Transaction[];
  networkAnalysis: NetworkAnalysis;
}

export interface Transaction {
  hash: string;
  time: number;
  value: number;
  fee: number;
  confirmations: number;
  inputs: Array<{
    address?: string;
    value: number;
  }>;
  outputs: Array<{
    address?: string;
    value: number;
  }>;
  riskFlags: string[];
}

export interface NetworkAnalysis {
  clusterSize: number;
  associatedAddresses: string[];
  riskConnections: Array<{
    address: string;
    riskType: string;
    confidence: number;
  }>;
  patterns: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface ApiResponse {
  source: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

// Rate limiting for different APIs
class RateLimiter {
  private limits: Map<string, { count: number; resetTime: number; maxRequests: number }> = new Map();

  constructor() {
    // API rate limits per hour
    this.limits.set('blockchain.info', { count: 0, resetTime: 0, maxRequests: 300 });
    this.limits.set('blockcypher', { count: 0, resetTime: 0, maxRequests: 200 });
    this.limits.set('blockstream', { count: 0, resetTime: 0, maxRequests: 100 });
    this.limits.set('blockchair', { count: 0, resetTime: 0, maxRequests: 100 });
    this.limits.set('bitcoin-price', { count: 0, resetTime: 0, maxRequests: 1000 });
  }

  canMakeRequest(apiName: string): boolean {
    const limit = this.limits.get(apiName);
    if (!limit) return true;

    const now = Date.now();
    if (now > limit.resetTime) {
      limit.count = 0;
      limit.resetTime = now + 3600000; // Reset after 1 hour
    }

    return limit.count < limit.maxRequests;
  }

  recordRequest(apiName: string): void {
    const limit = this.limits.get(apiName);
    if (limit) {
      limit.count++;
    }
  }

  getRemainingRequests(apiName: string): number {
    const limit = this.limits.get(apiName);
    if (!limit) return 1000;
    return Math.max(0, limit.maxRequests - limit.count);
  }
}

export class CryptoApiService {
  private rateLimiter = new RateLimiter();
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  // Cache TTL in milliseconds
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Clear expired cache entries every 10 minutes
    setInterval(() => this.clearExpiredCache(), 10 * 60 * 1000);
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private getCachedData(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  private setCachedData(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Fetch from Blockchain.info API
  private async fetchBlockchainInfo(address: string): Promise<ApiResponse> {
    const cacheKey = `blockchain_${address}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return {
        source: 'blockchain.info',
        success: true,
        data: cached,
        timestamp: Date.now()
      };
    }

    if (!this.rateLimiter.canMakeRequest('blockchain.info')) {
      return {
        source: 'blockchain.info',
        success: false,
        error: 'Rate limit exceeded',
        timestamp: Date.now()
      };
    }

    try {
      this.rateLimiter.recordRequest('blockchain.info');
      const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        source: 'blockchain.info',
        success: true,
        data,
        timestamp: Date.now(),
        rateLimit: {
          remaining: this.rateLimiter.getRemainingRequests('blockchain.info'),
          resetTime: Date.now() + 3600000
        }
      };
    } catch (error) {
      return {
        source: 'blockchain.info',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  // Fetch from BlockCypher API
  private async fetchBlockCypher(address: string): Promise<ApiResponse> {
    const cacheKey = `blockcypher_${address}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return {
        source: 'blockcypher',
        success: true,
        data: cached,
        timestamp: Date.now()
      };
    }

    if (!this.rateLimiter.canMakeRequest('blockcypher')) {
      return {
        source: 'blockcypher',
        success: false,
        error: 'Rate limit exceeded',
        timestamp: Date.now()
      };
    }

    try {
      this.rateLimiter.recordRequest('blockcypher');
      const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        source: 'blockcypher',
        success: true,
        data,
        timestamp: Date.now(),
        rateLimit: {
          remaining: this.rateLimiter.getRemainingRequests('blockcypher'),
          resetTime: Date.now() + 3600000
        }
      };
    } catch (error) {
      return {
        source: 'blockcypher',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  // Fetch from Blockstream API
  private async fetchBlockstream(address: string): Promise<ApiResponse> {
    const cacheKey = `blockstream_${address}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return {
        source: 'blockstream',
        success: true,
        data: cached,
        timestamp: Date.now()
      };
    }

    if (!this.rateLimiter.canMakeRequest('blockstream')) {
      return {
        source: 'blockstream',
        success: false,
        error: 'Rate limit exceeded',
        timestamp: Date.now()
      };
    }

    try {
      this.rateLimiter.recordRequest('blockstream');
      const [addressResponse, txResponse] = await Promise.all([
        fetch(`https://blockstream.info/api/address/${address}`),
        fetch(`https://blockstream.info/api/address/${address}/txs`)
      ]);

      if (!addressResponse.ok || !txResponse.ok) {
        throw new Error('Failed to fetch from Blockstream API');
      }

      const addressData = await addressResponse.json();
      const txData = await txResponse.json();

      const data = {
        address: addressData,
        transactions: txData.slice(0, 50)
      };

      this.setCachedData(cacheKey, data);

      return {
        source: 'blockstream',
        success: true,
        data,
        timestamp: Date.now(),
        rateLimit: {
          remaining: this.rateLimiter.getRemainingRequests('blockstream'),
          resetTime: Date.now() + 3600000
        }
      };
    } catch (error) {
      return {
        source: 'blockstream',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  // Fetch from Blockchair API
  private async fetchBlockchair(address: string): Promise<ApiResponse> {
    const cacheKey = `blockchair_${address}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return {
        source: 'blockchair',
        success: true,
        data: cached,
        timestamp: Date.now()
      };
    }

    if (!this.rateLimiter.canMakeRequest('blockchair')) {
      return {
        source: 'blockchair',
        success: false,
        error: 'Rate limit exceeded',
        timestamp: Date.now()
      };
    }

    try {
      this.rateLimiter.recordRequest('blockchair');
      const response = await fetch(`https://api.blockchair.com/bitcoin/dashboards/address/${address}?limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);

      return {
        source: 'blockchair',
        success: true,
        data,
        timestamp: Date.now(),
        rateLimit: {
          remaining: this.rateLimiter.getRemainingRequests('blockchair'),
          resetTime: Date.now() + 3600000
        }
      };
    } catch (error) {
      return {
        source: 'blockchair',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  // Aggregate data from all APIs
  public async analyzeWallet(address: string): Promise<AggregatedWalletData> {
    try {
      // Fetch from all APIs in parallel
      const apiResponses = await Promise.allSettled([
        this.fetchBlockchainInfo(address),
        this.fetchBlockCypher(address),
        this.fetchBlockstream(address),
        this.fetchBlockchair(address)
      ]);

      const successfulResponses = apiResponses
        .map((result) => {
          if (result.status === 'fulfilled' && result.value.success) {
            return result.value;
          }
          return null;
        })
        .filter(Boolean) as ApiResponse[];

      if (successfulResponses.length === 0) {
        throw new Error('All API requests failed');
      }

      // Aggregate data from successful responses
      const aggregatedData = this.aggregateApiData(address, successfulResponses);
      
      // Perform risk analysis
      const riskAnalysis = this.performRiskAnalysis(aggregatedData);
      
      // Perform network analysis
      const networkAnalysis = this.performNetworkAnalysis(successfulResponses);

      return {
        ...aggregatedData,
        ...riskAnalysis,
        networkAnalysis,
        apiSources: successfulResponses.map(r => r.source),
        confidence: this.calculateConfidence(successfulResponses.length),
        dataQuality: this.assessDataQuality(successfulResponses)
      } as AggregatedWalletData;

    } catch (error) {
      throw new Error(`Wallet analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private aggregateApiData(address: string, responses: ApiResponse[]): Partial<AggregatedWalletData> {
    let balance = 0;
    let transactionCount = 0;
    let totalReceived = 0;
    let totalSent = 0;
    let firstSeen: string | null = null;
    let lastSeen: string | null = null;
    const allTransactions: Transaction[] = [];

    for (const response of responses) {
      try {
        switch (response.source) {
          case 'blockchain.info':
            balance = Math.max(balance, response.data.final_balance || 0);
            transactionCount = Math.max(transactionCount, response.data.n_tx || 0);
            totalReceived = Math.max(totalReceived, response.data.total_received || 0);
            totalSent = Math.max(totalSent, response.data.total_sent || 0);
            
            if (response.data.txs) {
              const txs = this.parseBlockchainInfoTransactions(response.data.txs);
              allTransactions.push(...txs);
            }
            break;

          case 'blockcypher':
            balance = Math.max(balance, response.data.balance || 0);
            transactionCount = Math.max(transactionCount, response.data.n_tx || 0);
            totalReceived = Math.max(totalReceived, response.data.total_received || 0);
            totalSent = Math.max(totalSent, response.data.total_sent || 0);
            
            if (response.data.txs) {
              const txs = this.parseBlockCypherTransactions(response.data.txs);
              allTransactions.push(...txs);
            }
            break;

          case 'blockstream':
            if (response.data.address) {
              const addressInfo = response.data.address;
              balance = Math.max(balance, addressInfo.chain_stats?.funded_txo_sum - addressInfo.chain_stats?.spent_txo_sum || 0);
              transactionCount = Math.max(transactionCount, addressInfo.chain_stats?.tx_count || 0);
              totalReceived = Math.max(totalReceived, addressInfo.chain_stats?.funded_txo_sum || 0);
              totalSent = Math.max(totalSent, addressInfo.chain_stats?.spent_txo_sum || 0);
            }
            
            if (response.data.transactions) {
              const txs = this.parseBlockstreamTransactions(response.data.transactions);
              allTransactions.push(...txs);
            }
            break;

          case 'blockchair':
            if (response.data.data && response.data.data[address]) {
              const addressData = response.data.data[address].address;
              balance = Math.max(balance, addressData.balance || 0);
              transactionCount = Math.max(transactionCount, addressData.transaction_count || 0);
              totalReceived = Math.max(totalReceived, addressData.received || 0);
              totalSent = Math.max(totalSent, addressData.spent || 0);
              
              if (addressData.first_seen_receiving) {
                const firstSeenTime = new Date(addressData.first_seen_receiving).toISOString();
                if (!firstSeen || firstSeenTime < firstSeen) {
                  firstSeen = firstSeenTime;
                }
              }
              
              if (addressData.last_seen_spending || addressData.last_seen_receiving) {
                const lastSeenTime = new Date(addressData.last_seen_spending || addressData.last_seen_receiving).toISOString();
                if (!lastSeen || lastSeenTime > lastSeen) {
                  lastSeen = lastSeenTime;
                }
              }
            }
            break;
        }
      } catch (error) {
        console.warn(`Error processing data from ${response.source}:`, error);
      }
    }

    // Remove duplicates and sort transactions
    const uniqueTransactions = this.deduplicateTransactions(allTransactions);
    uniqueTransactions.sort((a, b) => b.time - a.time);

    return {
      address,
      balance: balance / 100000000, // Convert satoshis to BTC
      transactionCount,
      firstSeen,
      lastSeen,
      totalReceived: totalReceived / 100000000,
      totalSent: totalSent / 100000000,
      transactions: uniqueTransactions.slice(0, 50) // Limit to 50 most recent
    };
  }

  private parseBlockchainInfoTransactions(txs: any[]): Transaction[] {
    return txs.map(tx => ({
      hash: tx.hash,
      time: tx.time * 1000,
      value: tx.result || 0,
      fee: tx.fee || 0,
      confirmations: tx.confirmations || 0,
      inputs: tx.inputs?.map((input: any) => ({
        address: input.prev_out?.addr,
        value: input.prev_out?.value || 0
      })) || [],
      outputs: tx.out?.map((output: any) => ({
        address: output.addr,
        value: output.value || 0
      })) || [],
      riskFlags: []
    }));
  }

  private parseBlockCypherTransactions(txs: any[]): Transaction[] {
    return txs.map(tx => ({
      hash: tx.hash,
      time: new Date(tx.received).getTime(),
      value: tx.total || 0,
      fee: tx.fees || 0,
      confirmations: tx.confirmations || 0,
      inputs: tx.inputs?.map((input: any) => ({
        address: input.addresses?.[0],
        value: input.output_value || 0
      })) || [],
      outputs: tx.outputs?.map((output: any) => ({
        address: output.addresses?.[0],
        value: output.value || 0
      })) || [],
      riskFlags: []
    }));
  }

  private parseBlockstreamTransactions(txs: any[]): Transaction[] {
    return txs.map(tx => ({
      hash: tx.txid,
      time: tx.status?.block_time ? tx.status.block_time * 1000 : Date.now(),
      value: tx.vout?.reduce((sum: number, out: any) => sum + out.value, 0) || 0,
      fee: tx.fee || 0,
      confirmations: tx.status?.confirmed ? 1 : 0,
      inputs: tx.vin?.map((input: any) => ({
        address: input.prevout?.scriptpubkey_address,
        value: input.prevout?.value || 0
      })) || [],
      outputs: tx.vout?.map((output: any) => ({
        address: output.scriptpubkey_address,
        value: output.value || 0
      })) || [],
      riskFlags: []
    }));
  }

  private deduplicateTransactions(transactions: Transaction[]): Transaction[] {
    const seen = new Set<string>();
    return transactions.filter(tx => {
      if (seen.has(tx.hash)) {
        return false;
      }
      seen.add(tx.hash);
      return true;
    });
  }

  private performRiskAnalysis(data: Partial<AggregatedWalletData>): { riskScore: number; riskFactors: string[] } {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // High transaction frequency risk
    if (data.transactionCount && data.transactionCount > 1000) {
      riskFactors.push('High transaction frequency');
      riskScore += 20;
    }

    // Large balance risk
    if (data.balance && data.balance > 100) {
      riskFactors.push('Large balance holder');
      riskScore += 15;
    }

    // Recent activity risk
    if (data.lastSeen) {
      const lastSeenTime = new Date(data.lastSeen).getTime();
      const daysSinceLastActivity = (Date.now() - lastSeenTime) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastActivity < 1) {
        riskFactors.push('Very recent activity');
        riskScore += 10;
      }
    }

    // Transaction pattern analysis
    if (data.transactions) {
      const roundNumbers = data.transactions.filter(tx => 
        tx.value % 1 === 0 && tx.value >= 1
      ).length;
      
      if (roundNumbers > data.transactions.length * 0.5) {
        riskFactors.push('Suspicious round number transactions');
        riskScore += 25;
      }

      // Rapid succession transactions
      let rapidTransactions = 0;
      for (let i = 1; i < data.transactions.length; i++) {
        const timeDiff = data.transactions[i-1].time - data.transactions[i].time;
        if (timeDiff < 60000) { // Less than 1 minute apart
          rapidTransactions++;
        }
      }
      
      if (rapidTransactions > 5) {
        riskFactors.push('Rapid succession transactions detected');
        riskScore += 20;
      }
    }

    return {
      riskScore: Math.min(riskScore, 100),
      riskFactors
    };
  }

  private performNetworkAnalysis(responses: ApiResponse[]): NetworkAnalysis {
    const associatedAddresses: Set<string> = new Set();
    const riskConnections: Array<{ address: string; riskType: string; confidence: number }> = [];
    const patterns: Array<{ type: string; description: string; severity: 'low' | 'medium' | 'high' }> = [];

    // Extract associated addresses from transaction data
    for (const response of responses) {
      if (response.success && response.data) {
        this.extractAssociatedAddresses(response, associatedAddresses);
      }
    }

    // Analyze patterns
    if (associatedAddresses.size > 50) {
      patterns.push({
        type: 'High Connectivity',
        description: 'Address connected to many other addresses',
        severity: 'medium'
      });
    }

    return {
      clusterSize: associatedAddresses.size,
      associatedAddresses: Array.from(associatedAddresses).slice(0, 20), // Limit for UI
      riskConnections,
      patterns
    };
  }

  private extractAssociatedAddresses(response: ApiResponse, addressSet: Set<string>): void {
    try {
      switch (response.source) {
        case 'blockchain.info':
          response.data.txs?.forEach((tx: any) => {
            tx.inputs?.forEach((input: any) => {
              if (input.prev_out?.addr) {
                addressSet.add(input.prev_out.addr);
              }
            });
            tx.out?.forEach((output: any) => {
              if (output.addr) {
                addressSet.add(output.addr);
              }
            });
          });
          break;

        case 'blockcypher':
          response.data.txs?.forEach((tx: any) => {
            tx.inputs?.forEach((input: any) => {
              input.addresses?.forEach((addr: string) => addressSet.add(addr));
            });
            tx.outputs?.forEach((output: any) => {
              output.addresses?.forEach((addr: string) => addressSet.add(addr));
            });
          });
          break;

        case 'blockstream':
          response.data.transactions?.forEach((tx: any) => {
            tx.vin?.forEach((input: any) => {
              if (input.prevout?.scriptpubkey_address) {
                addressSet.add(input.prevout.scriptpubkey_address);
              }
            });
            tx.vout?.forEach((output: any) => {
              if (output.scriptpubkey_address) {
                addressSet.add(output.scriptpubkey_address);
              }
            });
          });
          break;
      }
    } catch (error) {
      console.warn(`Error extracting addresses from ${response.source}:`, error);
    }
  }

  private calculateConfidence(successfulApiCount: number): number {
    // Confidence based on number of successful API responses
    const maxApis = 4;
    return Math.round((successfulApiCount / maxApis) * 100);
  }

  private assessDataQuality(responses: ApiResponse[]): 'high' | 'medium' | 'low' {
    if (responses.length >= 3) return 'high';
    if (responses.length >= 2) return 'medium';
    return 'low';
  }

  // Get API status for monitoring
  public getApiStatus(): Array<{ name: string; remaining: number; status: 'healthy' | 'limited' | 'error' }> {
    const apis = ['blockchain.info', 'blockcypher', 'blockstream', 'blockchair'];
    
    return apis.map(api => ({
      name: api,
      remaining: this.rateLimiter.getRemainingRequests(api),
      status: this.rateLimiter.canMakeRequest(api) ? 'healthy' : 'limited'
    }));
  }

  // Clear cache manually
  public clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const cryptoApiService = new CryptoApiService();
