import React, { useState, useEffect } from 'react';
import {
  Blocks,
  Search,
  Hash,
  Clock,
  Activity,
  RefreshCw,
} from 'lucide-react';

interface BlockDetails {
  hash: string;
  height: number;
  timestamp: string;
  size: number;
  transactionCount: number;
  totalOutput: number;
  fees: number;
  difficulty: number;
  nonce: number;
  merkleRoot: string;
  previousBlock: string;
  nextBlock?: string;
  confirmations: number;
  version: number;
  bits: string;
  weight: number;
  chainwork: string;
  miner?: string;
  reward: number;
}

interface BlockTransaction {
  hash: string;
  inputCount: number;
  outputCount: number;
  totalInput: number;
  totalOutput: number;
  fees: number;
  size: number;
  timestamp: string;
  confirmed: boolean;
}

interface MiningStats {
  averageBlockTime: number;
  hashRate: number;
  difficulty: number;
  nextDifficultyAdjustment: number;
  blocksUntilAdjustment: number;
  mempoolSize: number;
  averageFees: number;
}

interface BlockAnalysisState {
  recentBlocks: BlockDetails[];
  selectedBlock: BlockDetails | null;
  blockTransactions: BlockTransaction[];
  miningStats: MiningStats | null;
  isLoading: boolean;
  searchBlockHash: string;
  searchResult: BlockDetails | null;
  searchLoading: boolean;
  expandedTransaction: string | null;
  filterType: 'all' | 'large' | 'high-fee' | 'coinbase';
  sortBy: 'time' | 'size' | 'fees' | 'value';
  sortOrder: 'asc' | 'desc';
}

const BlockAnalysis: React.FC = () => {
  const [state, setState] = useState<BlockAnalysisState>({
    recentBlocks: [],
    selectedBlock: null,
    blockTransactions: [],
    miningStats: null,
    isLoading: true,
    searchBlockHash: '',
    searchResult: null,
    searchLoading: false,
    expandedTransaction: null,
    filterType: 'all',
    sortBy: 'time',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchBlockData();
  }, []);

  const fetchBlockData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real implementation, these would be actual BlockCypher API calls
      const mockRecentBlocks = generateMockBlocks();
      const mockMiningStats = generateMockMiningStats();

      setState(prev => ({
        ...prev,
        recentBlocks: mockRecentBlocks,
        miningStats: mockMiningStats,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching block data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const generateMockBlocks = (): BlockDetails[] => {
    const blocks = [];
    const currentHeight = 850000;
    
    for (let i = 0; i < 20; i++) {
      const height = currentHeight - i;
      const timestamp = new Date(Date.now() - (i * 600000)); // 10 minutes apart
      
      blocks.push({
        hash: `00000000000000000${Math.random().toString(16).substr(2, 47)}`,
        height,
        timestamp: timestamp.toISOString(),
        size: Math.floor(Math.random() * 2000000) + 500000, // 0.5-2.5MB
        transactionCount: Math.floor(Math.random() * 4000) + 1000,
        totalOutput: Math.floor(Math.random() * 50000000000000) + 10000000000000, // 100-600 BTC
        fees: Math.floor(Math.random() * 500000000) + 50000000, // 0.5-5 BTC in fees
        difficulty: 57119871304635.31,
        nonce: Math.floor(Math.random() * 4294967295),
        merkleRoot: `${Math.random().toString(16).substr(2, 64)}`,
        previousBlock: i < 19 ? `00000000000000000${Math.random().toString(16).substr(2, 47)}` : '',
        confirmations: i + 1,
        version: 0x20000000,
        bits: '17038a6d',
        weight: Math.floor(Math.random() * 4000000) + 2000000,
        chainwork: `000000000000000000000000000000000000000${Math.random().toString(16).substr(2, 25)}`,
        miner: ['Foundry USA', 'AntPool', 'F2Pool', 'Poolin', 'ViaBTC'][Math.floor(Math.random() * 5)],
        reward: 625000000 // 6.25 BTC
      });
    }
    
    return blocks;
  };

  const generateMockMiningStats = (): MiningStats => ({
    averageBlockTime: 9.8, // minutes
    hashRate: 450.5e18, // H/s
    difficulty: 57119871304635.31,
    nextDifficultyAdjustment: 1.02, // +2%
    blocksUntilAdjustment: 1847,
    mempoolSize: 156789, // transactions
    averageFees: 0.00045 // BTC
  });

  const generateMockTransactions = (): BlockTransaction[] => {
    const transactions = [];
    const txCount = Math.floor(Math.random() * 3000) + 500;
    
    for (let i = 0; i < Math.min(txCount, 50); i++) { // Limit to 50 for UI
      transactions.push({
        hash: `${Math.random().toString(16).substr(2, 64)}`,
        inputCount: Math.floor(Math.random() * 10) + 1,
        outputCount: Math.floor(Math.random() * 10) + 1,
        totalInput: Math.floor(Math.random() * 10000000000) + 100000000,
        totalOutput: Math.floor(Math.random() * 10000000000) + 100000000,
        fees: Math.floor(Math.random() * 1000000) + 10000,
        size: Math.floor(Math.random() * 1000) + 200,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        confirmed: true
      });
    }
    
    return transactions.sort((a, b) => b.totalOutput - a.totalOutput);
  };

  const searchBlock = async () => {
    if (!state.searchBlockHash.trim()) return;
    
    setState(prev => ({ ...prev, searchLoading: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isHeight = /^\d+$/.test(state.searchBlockHash);
      const mockResult: BlockDetails = {
        hash: isHeight ? `00000000000000000${Math.random().toString(16).substr(2, 47)}` : state.searchBlockHash,
        height: isHeight ? parseInt(state.searchBlockHash) : Math.floor(Math.random() * 850000),
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
        size: Math.floor(Math.random() * 2000000) + 500000,
        transactionCount: Math.floor(Math.random() * 4000) + 1000,
        totalOutput: Math.floor(Math.random() * 50000000000000) + 10000000000000,
        fees: Math.floor(Math.random() * 500000000) + 50000000,
        difficulty: 57119871304635.31,
        nonce: Math.floor(Math.random() * 4294967295),
        merkleRoot: `${Math.random().toString(16).substr(2, 64)}`,
        previousBlock: `00000000000000000${Math.random().toString(16).substr(2, 47)}`,
        confirmations: Math.floor(Math.random() * 1000) + 1,
        version: 0x20000000,
        bits: '17038a6d',
        weight: Math.floor(Math.random() * 4000000) + 2000000,
        chainwork: `000000000000000000000000000000000000000${Math.random().toString(16).substr(2, 25)}`,
        miner: ['Foundry USA', 'AntPool', 'F2Pool', 'Poolin', 'ViaBTC'][Math.floor(Math.random() * 5)],
        reward: 625000000
      };
      
      setState(prev => ({ ...prev, searchResult: mockResult }));
    } catch (error) {
      console.error('Block search error:', error);
    } finally {
      setState(prev => ({ ...prev, searchLoading: false }));
    }
  };

  const selectBlock = async (block: BlockDetails) => {
    setState(prev => ({ ...prev, selectedBlock: block, blockTransactions: [] }));
    
    // Fetch transactions for this block
    const transactions = generateMockTransactions();
    setState(prev => ({ ...prev, blockTransactions: transactions }));
  };

  const formatBTC = (satoshis: number): string => {
    const btc = satoshis / 100000000;
    if (btc >= 1000) return `₿${(btc / 1000).toFixed(1)}K`;
    if (btc >= 1) return `₿${btc.toFixed(4)}`;
    return `${satoshis.toLocaleString()} sats`;
  };

  const formatHash = (hash: string): string => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const formatHashRate = (hashRate: number): string => {
    if (hashRate >= 1e18) return `${(hashRate / 1e18).toFixed(1)} EH/s`;
    if (hashRate >= 1e15) return `${(hashRate / 1e15).toFixed(1)} PH/s`;
    return `${(hashRate / 1e12).toFixed(1)} TH/s`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary-500)'
            }}>
              <Blocks style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                margin: '0 0 var(--space-1) 0'
              }}>
                Block Analysis
              </h1>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
                Comprehensive Bitcoin block analysis with transactions, mining stats, and technical details
              </p>
            </div>
          </div>

          <button
            onClick={fetchBlockData}
            disabled={state.isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: state.isLoading ? 'not-allowed' : 'pointer',
              fontSize: 'var(--text-sm)'
            }}
          >
            {state.isLoading ? (
              <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <RefreshCw style={{ width: '16px', height: '16px' }} />
            )}
            Refresh
          </button>
        </div>

        {/* Block Search */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center',
          padding: 'var(--space-4)',
          background: 'var(--surface-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <Search style={{ width: '20px', height: '20px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search by block hash or height (e.g., 850000 or 00000000...)"
            value={state.searchBlockHash}
            onChange={(e) => setState(prev => ({ ...prev, searchBlockHash: e.target.value }))}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontFamily: 'var(--font-family-mono)'
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchBlock()}
          />
          <button
            onClick={searchBlock}
            disabled={state.searchLoading}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--color-primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: state.searchLoading ? 'not-allowed' : 'pointer',
              fontSize: 'var(--text-sm)'
            }}
          >
            {state.searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Result */}
        {state.searchResult && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              Block Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Block Hash</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                  {formatHash(state.searchResult.hash)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Height</div>
                <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>
                  {state.searchResult.height.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Transactions</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {state.searchResult.transactionCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Size</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {formatBytes(state.searchResult.size)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total Fees</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success-600)' }}>
                  {formatBTC(state.searchResult.fees)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Mined</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {formatTimeAgo(state.searchResult.timestamp)}
                </div>
              </div>
            </div>
            <button
              onClick={() => selectBlock(state.searchResult!)}
              style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--color-primary-500)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}
            >
              Analyze Block
            </button>
          </div>
        )}
      </div>

      {/* Mining Statistics */}
      {state.miningStats && (
        <section>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)'
          }}>
            Network Mining Stats
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            <div style={{
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Activity style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Hash Rate & Difficulty</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Network Hash Rate</span>
                  <span style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-semibold)' }}>
                    {formatHashRate(state.miningStats.hashRate)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Difficulty</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                    {(state.miningStats.difficulty / 1e12).toFixed(2)}T
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Next Adjustment</span>
                  <span style={{ 
                    color: state.miningStats.nextDifficultyAdjustment > 0 ? 'var(--color-success-600)' : 'var(--color-error-600)', 
                    fontWeight: 'var(--font-semibold)' 
                  }}>
                    {state.miningStats.nextDifficultyAdjustment > 0 ? '+' : ''}{(state.miningStats.nextDifficultyAdjustment * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Clock style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Block Timing</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Average Block Time</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {state.miningStats.averageBlockTime.toFixed(1)} min
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Blocks Until Adjustment</span>
                  <span style={{ color: 'var(--color-warning-600)', fontWeight: 'var(--font-semibold)' }}>
                    {state.miningStats.blocksUntilAdjustment.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Est. Time to Adjustment</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {Math.round(state.miningStats.blocksUntilAdjustment * state.miningStats.averageBlockTime / 60 / 24)} days
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Activity style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Mempool & Fees</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Mempool Size</span>
                  <span style={{ color: 'var(--color-warning-600)', fontWeight: 'var(--font-semibold)' }}>
                    {state.miningStats.mempoolSize.toLocaleString()} txs
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Average Fee Rate</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {(state.miningStats.averageFees * 100000000).toFixed(0)} sat/vB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Blocks */}
      <section>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)'
        }}>
          Recent Blocks
        </h2>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 120px 80px 100px 120px 120px 100px',
            gap: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--surface-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--text-tertiary)'
          }}>
            <div>Height</div>
            <div>Hash</div>
            <div>TXs</div>
            <div>Size</div>
            <div>Total Fees</div>
            <div>Miner</div>
            <div>Time</div>
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {state.recentBlocks.map((block, index) => (
              <div
                key={block.hash}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 120px 80px 100px 120px 120px 100px',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  borderBottom: index < state.recentBlocks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onClick={() => selectBlock(block)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                  {block.height.toLocaleString()}
                </div>
                <div style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 'var(--text-sm)'
                }}>
                  {formatHash(block.hash)}
                </div>
                <div style={{ color: 'var(--text-primary)' }}>
                  {block.transactionCount.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-primary)' }}>
                  {formatBytes(block.size)}
                </div>
                <div style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-semibold)' }}>
                  {formatBTC(block.fees)}
                </div>
                <div style={{ color: 'var(--text-primary)' }}>
                  {block.miner || 'Unknown'}
                </div>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  {formatTimeAgo(block.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Block Details */}
      {state.selectedBlock && (
        <section>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)'
          }}>
            Block {state.selectedBlock.height.toLocaleString()} Details
          </h2>
          
          {/* Block Technical Details */}
          <div style={{
            background: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'var(--text-lg)' }}>Block Info</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Height</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {state.selectedBlock.height.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Confirmations</span>
                  <span style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-semibold)' }}>
                    {state.selectedBlock.confirmations.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Size</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {formatBytes(state.selectedBlock.size)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Weight</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {state.selectedBlock.weight.toLocaleString()} WU
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'var(--text-lg)' }}>Mining Details</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Miner</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {state.selectedBlock.miner}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Nonce</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                    {state.selectedBlock.nonce.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Difficulty</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {(state.selectedBlock.difficulty / 1e12).toFixed(2)}T
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Bits</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                    {state.selectedBlock.bits}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'var(--text-lg)' }}>Financial Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Block Reward</span>
                  <span style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-semibold)' }}>
                    {formatBTC(state.selectedBlock.reward)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Total Fees</span>
                  <span style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-semibold)' }}>
                    {formatBTC(state.selectedBlock.fees)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Total Output</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {formatBTC(state.selectedBlock.totalOutput)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Miner Revenue</span>
                  <span style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-bold)' }}>
                    {formatBTC(state.selectedBlock.reward + state.selectedBlock.fees)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Block Transactions */}
          <div style={{
            background: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--surface-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>
                Transactions ({state.selectedBlock.transactionCount.toLocaleString()})
              </h4>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                Showing top 50 by value
              </div>
            </div>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {state.blockTransactions.map((tx, index) => (
                <div
                  key={tx.hash}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    borderBottom: index < state.blockTransactions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-100)',
                    border: '1px solid var(--color-primary-300)'
                  }}>
                    <Hash style={{ width: '16px', height: '16px', color: 'var(--color-primary-600)' }} />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      <code style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family-mono)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {tx.hash.substring(0, 16)}...
                      </code>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        padding: 'var(--space-1) var(--space-2)',
                        background: 'var(--surface-tertiary)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {formatBytes(tx.size)}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      gap: 'var(--space-4)'
                    }}>
                      <span>{tx.inputCount} inputs</span>
                      <span>{tx.outputCount} outputs</span>
                      <span>Fee: {formatBTC(tx.fees)}</span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--text-primary)'
                    }}>
                      {formatBTC(tx.totalOutput)}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: tx.confirmed ? 'var(--color-success-600)' : 'var(--color-warning-600)'
                    }}>
                      {tx.confirmed ? 'Confirmed' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading Spinner Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlockAnalysis;
