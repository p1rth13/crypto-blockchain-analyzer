// BlockCypher API Service for Crypto Analysis Dashboard
export interface BlockCypherBlock {
  hash: string;
  height: number;
  time: string;
  received_time: string;
  relayed_by: string;
  bits: number;
  nonce: number;
  n_tx: number;
  prev_block: string;
  mrkl_root: string;
  txids: string[];
  depth: number;
  pool: {
    name: string;
    url: string;
  };
  total: number;
  fees: number;
  size: number;
  block_index: number;
  received: number;
  relayed: number;
}

export interface BlockCypherChainInfo {
  name: string;
  height: number;
  hash: string;
  time: string;
  latest_url: string;
  previous_hash: string;
  previous_url: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb: number;
  medium_fee_per_kb: number;
  low_fee_per_kb: number;
  last_fork_height: number;
  last_fork_hash: string;
}

export interface LiveTransaction {
  hash: string;
  time: string;
  value: number;
  fees: number;
  size: number;
  confirmations: number;
  addresses: string[];
  type: 'incoming' | 'outgoing' | 'internal';
  status: 'confirmed' | 'unconfirmed' | 'pending';
}

export interface LiveTransactionUpdate {
  transactions: LiveTransaction[];
  totalVolume24h: number;
  transactionCount24h: number;
  averageFee: number;
  networkHealth: number;
}

export interface BlockCypherTransaction {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  relayed_by: string;
  confirmed: string;
  received: string;
  ver: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  confidence: number;
  inputs: any[];
  outputs: any[];
  opt_in_rbf?: boolean;
}

export interface BlockCypherAddress {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
  txrefs?: any[];
  unconfirmed_txrefs?: any[];
  tx_url: string;
}

export interface ChainInfo {
  name: string;
  height: number;
  hash: string;
  time: string;
  latest_url: string;
  previous_hash: string;
  previous_url: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb: number;
  medium_fee_per_kb: number;
  low_fee_per_kb: number;
  last_fork_height: number;
  last_fork_hash: string;
}

export interface DashboardMetrics {
  totalVolume: {
    btc: number;
    usd: number;
    change24h: number;
  };
  activeWallets: {
    count: number;
    change24h: number;
  };
  networkHealth: {
    percentage: number;
    status: string;
  };
  anomaliesDetected: {
    count: number;
    change24h: number;
  };
  latestBlock: BlockCypherBlock;
  recentTransactions: BlockCypherTransaction[];
  chainInfo: ChainInfo;
}

export class BlockCypherService {
  private static readonly BASE_URL = 'https://api.blockcypher.com/v1';
  private static readonly BITCOIN_NETWORK = 'btc/main';
  private static readonly USE_MOCK_DATA = true; // Set to false when you have a backend proxy
  
  // Rate limiting - BlockCypher allows 3 requests per second for free tier
  private static lastCallTime = 0;
  private static readonly RATE_LIMIT_MS = 350; // Slightly above 3 req/sec to be safe

  // Mock data for development (to handle CORS issues)
  private static mockChainInfo: BlockCypherChainInfo = {
    name: 'BTC.main',
    height: 867234,
    hash: '00000000000000000003f2b2d8b9b9a4c2f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8',
    time: new Date().toISOString(),
    latest_url: '',
    previous_hash: '',
    previous_url: '',
    peer_count: 8,
    high_fee_per_kb: 50000,
    medium_fee_per_kb: 25000,
    low_fee_per_kb: 10000,
    unconfirmed_count: Math.floor(Math.random() * 20000) + 10000,
    last_fork_height: 0,
    last_fork_hash: ''
  };

  private static mockTransactions: BlockCypherTransaction[] = [
    {
      block_hash: '',
      block_height: -1,
      block_index: -1,
      hash: 'abc123def456789fedcba',
      addresses: ['1A2B3C4D5E6F7G8H9I0J', '1K2L3M4N5O6P7Q8R9S0T'],
      total: Math.floor(Math.random() * 100000000) + 10000000,
      fees: Math.floor(Math.random() * 50000) + 5000,
      size: 250,
      vsize: 141,
      preference: 'high',
      relayed_by: '',
      received: new Date().toISOString(),
      ver: 1,
      double_spend: false,
      vin_sz: 1,
      vout_sz: 2,
      opt_in_rbf: false,
      confirmations: 0,
      inputs: [],
      outputs: []
    }
  ];

  private static async rateLimitedCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // If using mock data, return mock responses
    if (this.USE_MOCK_DATA) {
      console.log('Using mock data for:', endpoint);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('Mock mode - API calls disabled to avoid CORS issues');
    }

    // Enforce rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.RATE_LIMIT_MS) {
      await new Promise(resolve => 
        setTimeout(resolve, this.RATE_LIMIT_MS - timeSinceLastCall)
      );
    }

    const url = `${this.BASE_URL}/${this.BITCOIN_NETWORK}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CryptoAnalyzer/1.0',
          ...options.headers
        }
      });

      this.lastCallTime = Date.now();

      if (!response.ok) {
        throw new Error(`BlockCypher API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('BlockCypher API Error:', error);
      throw error;
    }
  }

  // Get chain information (network stats)
  static async getChainInfo(): Promise<ChainInfo> {
    if (this.USE_MOCK_DATA) {
      // Return mock data to avoid CORS issues
      return {
        name: 'BTC.main',
        height: 867234,
        hash: '00000000000000000003f2b2d8b9b9a4c2f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8',
        time: new Date().toISOString(),
        latest_url: '',
        previous_hash: '',
        previous_url: '',
        peer_count: 8,
        high_fee_per_kb: 50000,
        medium_fee_per_kb: 25000,
        low_fee_per_kb: 10000,
        unconfirmed_count: Math.floor(Math.random() * 20000) + 10000,
        last_fork_height: 0,
        last_fork_hash: ''
      };
    }
    return this.rateLimitedCall<ChainInfo>('');
  }

  // Get latest block
  static async getLatestBlock(): Promise<BlockCypherBlock> {
    if (this.USE_MOCK_DATA) {
      // Return mock block data
      return {
        hash: '00000000000000000003f2b2d8b9b9a4c2f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8',
        height: 867234,
        time: new Date().toISOString(),
        received_time: new Date().toISOString(),
        relayed_by: '',
        bits: 0,
        nonce: 0,
        n_tx: Math.floor(Math.random() * 3000) + 1000,
        prev_block: '',
        mrkl_root: '',
        txids: [],
        depth: 0,
        pool: { name: '', url: '' },
        total: Math.floor(Math.random() * 1000000000000) + 100000000000,
        fees: Math.floor(Math.random() * 100000000) + 10000000,
        size: Math.floor(Math.random() * 1000000) + 500000,
        block_index: 867234,
        received: Date.now(),
        relayed: Date.now()
      };
    }
    const chainInfo = await this.getChainInfo();
    return this.rateLimitedCall<BlockCypherBlock>(`/blocks/${chainInfo.hash}`);
  }

  // Get specific block by hash or height
  static async getBlock(hashOrHeight: string | number): Promise<BlockCypherBlock> {
    return this.rateLimitedCall<BlockCypherBlock>(`/blocks/${hashOrHeight}`);
  }

  // Get recent blocks
  static async getRecentBlocks(limit: number = 10): Promise<BlockCypherBlock[]> {
    const chainInfo = await this.getChainInfo();
    const promises: Promise<BlockCypherBlock>[] = [];
    
    for (let i = 0; i < limit; i++) {
      const height = chainInfo.height - i;
      promises.push(this.getBlock(height));
    }
    
    return Promise.all(promises);
  }

  // Get transaction details
  static async getTransaction(hash: string): Promise<BlockCypherTransaction> {
    return this.rateLimitedCall<BlockCypherTransaction>(`/txs/${hash}`);
  }

  // Get recent transactions
  static async getRecentTransactions(limit: number = 50): Promise<BlockCypherTransaction[]> {
    const chainInfo = await this.getChainInfo();
    const latestBlock = await this.getBlock(chainInfo.hash);
    
    // Get transactions from the latest block
    const txHashes = latestBlock.txids.slice(0, limit);
    const promises = txHashes.map(hash => this.getTransaction(hash));
    
    return Promise.all(promises);
  }

  // Get address information
  static async getAddress(address: string): Promise<BlockCypherAddress> {
    return this.rateLimitedCall<BlockCypherAddress>(`/addrs/${address}`);
  }

  // Get address transactions
  static async getAddressTransactions(
    address: string, 
    limit: number = 50
  ): Promise<BlockCypherTransaction[]> {
    const addressData = await this.rateLimitedCall<BlockCypherAddress>(
      `/addrs/${address}?limit=${limit}`
    );
    
    if (!addressData.txrefs) return [];
    
    // Get full transaction details
    const txHashes = addressData.txrefs.slice(0, limit).map(ref => ref.tx_hash);
    const promises = txHashes.map(hash => this.getTransaction(hash));
    
    return Promise.all(promises);
  }

  // Calculate comprehensive dashboard metrics
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (this.USE_MOCK_DATA) {
      // Return mock dashboard metrics
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const mockLatestBlock: BlockCypherBlock = {
        hash: '00000000000000000003f2b2d8b9b9a4c2f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8',
        height: 867234,
        time: new Date().toISOString(),
        received_time: new Date().toISOString(),
        relayed_by: '',
        bits: 0,
        nonce: 0,
        n_tx: Math.floor(Math.random() * 3000) + 1000,
        prev_block: '',
        mrkl_root: '',
        txids: [],
        depth: 0,
        pool: { name: '', url: '' },
        total: Math.floor(Math.random() * 1000000000000) + 100000000000,
        fees: Math.floor(Math.random() * 100000000) + 10000000,
        size: Math.floor(Math.random() * 1000000) + 500000,
        block_index: 867234,
        received: Date.now(),
        relayed: Date.now()
      };

      const mockChainInfo: ChainInfo = {
        name: 'BTC.main',
        height: 867234,
        hash: '00000000000000000003f2b2d8b9b9a4c2f4e5d6a7b8c9d0e1f2a3b4c5d6e7f8',
        time: new Date().toISOString(),
        latest_url: '',
        previous_hash: '',
        previous_url: '',
        peer_count: 8,
        high_fee_per_kb: 50000,
        medium_fee_per_kb: 25000,
        low_fee_per_kb: 10000,
        unconfirmed_count: Math.floor(Math.random() * 20000) + 10000,
        last_fork_height: 0,
        last_fork_hash: ''
      };

      return {
        totalVolume: {
          btc: 25.4,
          usd: 2400000000,
          change24h: 12.5
        },
        activeWallets: {
          count: 847000,
          change24h: -3.2
        },
        anomaliesDetected: {
          count: 23,
          change24h: 8.7
        },
        networkHealth: {
          percentage: 98.2,
          status: 'excellent'
        },
        latestBlock: mockLatestBlock,
        recentTransactions: [],
        chainInfo: mockChainInfo
      };
    }

    try {
      const [chainInfo, latestBlock, recentBlocks] = await Promise.all([
        this.getChainInfo(),
        this.getLatestBlock(),
        this.getRecentBlocks(5)
      ]);

      // Calculate 24h volume from recent blocks
      const total24hVolume = recentBlocks.reduce((sum, block) => sum + block.total, 0);
      const avgBlockVolume = total24hVolume / recentBlocks.length;
      
      // Estimate daily volume (144 blocks per day average)
      const estimatedDailyVolume = avgBlockVolume * 144;
      
      // Mock USD conversion (you can integrate with a price API)
      const btcPriceUSD = 45000; // This should be fetched from a price API
      const volumeUSD = (estimatedDailyVolume / 100000000) * btcPriceUSD; // Convert satoshis to BTC then USD

      // Calculate network health based on recent block times
      const avgBlockTime = this.calculateAverageBlockTime(recentBlocks);
      const healthPercentage = Math.max(0, Math.min(100, 100 - ((avgBlockTime - 600) / 600) * 100));

      // Get recent transactions for anomaly detection
      const recentTransactions = await this.getRecentTransactions(20);
      const anomalies = this.detectAnomalies(recentTransactions);

      return {
        totalVolume: {
          btc: estimatedDailyVolume / 100000000, // Convert to BTC
          usd: volumeUSD,
          change24h: Math.random() * 20 - 10 // Mock 24h change, implement real calculation
        },
        activeWallets: {
          count: this.estimateActiveWallets(recentTransactions),
          change24h: Math.random() * 10 - 5 // Mock change
        },
        networkHealth: {
          percentage: healthPercentage,
          status: healthPercentage > 95 ? 'Excellent' : healthPercentage > 80 ? 'Good' : 'Poor'
        },
        anomaliesDetected: {
          count: anomalies.length,
          change24h: Math.random() * 5 // Mock change
        },
        latestBlock,
        recentTransactions,
        chainInfo
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  // Helper method to calculate average block time
  private static calculateAverageBlockTime(blocks: BlockCypherBlock[]): number {
    if (blocks.length < 2) return 600; // Default 10 minutes

    const times = blocks.map(block => new Date(block.time).getTime());
    times.sort((a, b) => b - a); // Sort descending (newest first)
    
    let totalDiff = 0;
    for (let i = 0; i < times.length - 1; i++) {
      totalDiff += times[i] - times[i + 1];
    }
    
    return totalDiff / (times.length - 1) / 1000; // Return in seconds
  }

  // Helper method to detect transaction anomalies
  private static detectAnomalies(transactions: BlockCypherTransaction[]): any[] {
    const anomalies: any[] = [];
    
    // Calculate average transaction value
    const avgValue = transactions.reduce((sum, tx) => sum + tx.total, 0) / transactions.length;
    const threshold = avgValue * 10; // Transactions 10x larger than average
    
    transactions.forEach(tx => {
      if (tx.total > threshold) {
        anomalies.push({
          type: 'large_transaction',
          transaction: tx.hash,
          value: tx.total,
          threshold
        });
      }
      
      if (tx.fees > tx.total * 0.1) { // High fee transactions
        anomalies.push({
          type: 'high_fee',
          transaction: tx.hash,
          fee: tx.fees,
          percentage: (tx.fees / tx.total) * 100
        });
      }
    });
    
    return anomalies;
  }

  // Helper method to estimate active wallets
  private static estimateActiveWallets(transactions: BlockCypherTransaction[]): number {
    const uniqueAddresses = new Set<string>();
    
    transactions.forEach(tx => {
      tx.addresses.forEach(addr => uniqueAddresses.add(addr));
    });
    
    // Scale up based on sample size (rough estimation)
    return uniqueAddresses.size * 1000; // This is a very rough estimate
  }

  // Search functionality
  static async search(query: string): Promise<any> {
    try {
      // Determine if query is a block hash, transaction hash, or address
      if (query.length === 64) {
        // Likely a transaction or block hash
        try {
          return await this.getTransaction(query);
        } catch {
          return await this.getBlock(query);
        }
      } else if (query.length >= 26 && query.length <= 35) {
        // Likely a Bitcoin address
        return await this.getAddress(query);
      } else if (/^\d+$/.test(query)) {
        // Numeric - likely a block height
        return await this.getBlock(parseInt(query));
      } else {
        throw new Error('Invalid search query format');
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // Get network fee estimates
  static async getFeeEstimates(): Promise<{
    high_fee_per_kb: number;
    medium_fee_per_kb: number;
    low_fee_per_kb: number;
  }> {
    const chainInfo = await this.getChainInfo();
    return {
      high_fee_per_kb: chainInfo.high_fee_per_kb,
      medium_fee_per_kb: chainInfo.medium_fee_per_kb,
      low_fee_per_kb: chainInfo.low_fee_per_kb
    };
  }

  // Live Transaction Tracking
  static async getUnconfirmedTransactions(): Promise<LiveTransaction[]> {
    try {
      const response = await this.rateLimitedCall('https://api.blockcypher.com/v1/btc/main/txs?instart=0&limit=50') as Response;
      const transactions = await response.json();
      
      return transactions.map((tx: any) => ({
        hash: tx.hash,
        time: tx.received || new Date().toISOString(),
        value: tx.total || 0,
        fees: tx.fees || 0,
        size: tx.size || 0,
        confirmations: tx.confirmations || 0,
        addresses: tx.addresses || [],
        type: this.determineTransactionType(tx),
        status: tx.confirmations > 0 ? 'confirmed' : 'unconfirmed'
      }));
    } catch (error) {
      console.warn('Using mock live transaction data due to API error:', error);
      return this.generateMockLiveTransactions();
    }
  }

  private static determineTransactionType(tx: any): 'incoming' | 'outgoing' | 'internal' {
    // Simple heuristic - in a real app you'd compare against known addresses
    const inputValue = tx.inputs?.reduce((sum: number, input: any) => sum + (input.output_value || 0), 0) || 0;
    const outputValue = tx.outputs?.reduce((sum: number, output: any) => sum + (output.value || 0), 0) || 0;
    
    if (inputValue > outputValue) return 'outgoing';
    if (outputValue > inputValue) return 'incoming';
    return 'internal';
  }

  private static generateMockLiveTransactions(): LiveTransaction[] {
    const mockTransactions: LiveTransaction[] = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const time = new Date(now.getTime() - (i * 30000)); // Every 30 seconds
      mockTransactions.push({
        hash: `${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`,
        time: time.toISOString(),
        value: Math.floor(Math.random() * 1000000000), // Random satoshis
        fees: Math.floor(Math.random() * 50000), // Random fee
        size: Math.floor(Math.random() * 1000) + 200, // Random size
        confirmations: Math.floor(Math.random() * 6),
        addresses: [
          `1${Math.random().toString(36).substr(2, 25)}`,
          `bc1${Math.random().toString(36).substr(2, 25)}`
        ],
        type: ['incoming', 'outgoing', 'internal'][Math.floor(Math.random() * 3)] as any,
        status: Math.random() > 0.3 ? 'confirmed' : 'unconfirmed'
      });
    }
    
    return mockTransactions;
  }

  static async getLiveTransactionUpdate(): Promise<LiveTransactionUpdate> {
    try {
      const transactions = await this.getUnconfirmedTransactions();
      const chainInfo = await this.getChainInfo();
      
      // Calculate 24h metrics (mock calculation for demo)
      const totalVolume24h = transactions.reduce((sum, tx) => sum + tx.value, 0);
      const averageFee = transactions.reduce((sum, tx) => sum + tx.fees, 0) / transactions.length;
      
      return {
        transactions: transactions.slice(0, 10), // Latest 10 transactions
        totalVolume24h,
        transactionCount24h: chainInfo.unconfirmed_count || 0,
        averageFee: averageFee || 0,
        networkHealth: Math.min(100, (chainInfo.peer_count || 8) * 12.5) // Simple health metric
      };
    } catch (error) {
      console.warn('Using mock live transaction update:', error);
      return this.generateMockLiveUpdate();
    }
  }

  private static generateMockLiveUpdate(): LiveTransactionUpdate {
    const transactions = this.generateMockLiveTransactions().slice(0, 10);
    
    return {
      transactions,
      totalVolume24h: 2400000000000, // 24 BTC in satoshis
      transactionCount24h: 247891,
      averageFee: 25000, // 25k satoshis average fee
      networkHealth: 98.5
    };
  }

  // WebSocket-like polling for live updates
  static startLiveTracking(
    callback: (update: LiveTransactionUpdate) => void,
    intervalMs: number = 10000 // 10 seconds default
  ): () => void {
    let isActive = true;
    
    const pollForUpdates = async () => {
      if (!isActive) return;
      
      try {
        const update = await this.getLiveTransactionUpdate();
        callback(update);
      } catch (error) {
        console.error('Live tracking error:', error);
      }
      
      if (isActive) {
        setTimeout(pollForUpdates, intervalMs);
      }
    };
    
    // Start polling immediately
    pollForUpdates();
    
    // Return cleanup function
    return () => {
      isActive = false;
    };
  }
}

export default BlockCypherService;
