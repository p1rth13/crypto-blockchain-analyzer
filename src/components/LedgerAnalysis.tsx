import React, { useState, useEffect } from 'react';
import {
  Database,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Hash,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Download,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  Users,
  Zap
} from 'lucide-react';
import BlockCypherService from '../services/blockCypherService';

interface LedgerEntry {
  blockHeight: number;
  timestamp: string;
  transactionHash: string;
  address: string;
  balanceChange: number;
  newBalance: number;
  type: 'credit' | 'debit';
  confirmations: number;
}

interface AddressBalance {
  address: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  firstSeen: string;
  lastActivity: string;
}

interface LedgerMetrics {
  totalAddresses: number;
  activeAddresses24h: number;
  totalSupply: number;
  circulatingSupply: number;
  largestBalance: number;
  averageBalance: number;
  giniCoefficient: number; // Wealth distribution measure
  dormantAddresses: number;
}

interface LedgerAnalysisState {
  metrics: LedgerMetrics | null;
  topBalances: AddressBalance[];
  recentEntries: LedgerEntry[];
  wealthDistribution: { range: string; count: number; percentage: number }[];
  isLoading: boolean;
  selectedTimeframe: '24h' | '7d' | '30d' | '1y';
  filterType: 'all' | 'large' | 'active' | 'dormant';
}

const LedgerAnalysis: React.FC = () => {
  const [state, setState] = useState<LedgerAnalysisState>({
    metrics: null,
    topBalances: [],
    recentEntries: [],
    wealthDistribution: [],
    isLoading: true,
    selectedTimeframe: '24h',
    filterType: 'all'
  });

  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState<AddressBalance | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchLedgerData();
  }, [state.selectedTimeframe, state.filterType]);

  const fetchLedgerData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real implementation, these would be actual API calls
      const mockMetrics: LedgerMetrics = {
        totalAddresses: 42847291,
        activeAddresses24h: 847291,
        totalSupply: 1968734300000000, // 19.68734 million BTC in satoshis
        circulatingSupply: 1968734300000000,
        largestBalance: 19420600000000, // ~194,206 BTC
        averageBalance: 45923847, // ~0.459 BTC
        giniCoefficient: 0.874, // High inequality
        dormantAddresses: 12847291
      };

      const mockTopBalances: AddressBalance[] = generateMockTopBalances();
      const mockRecentEntries: LedgerEntry[] = generateMockLedgerEntries();
      const mockWealthDistribution = generateWealthDistribution();

      setState(prev => ({
        ...prev,
        metrics: mockMetrics,
        topBalances: mockTopBalances,
        recentEntries: mockRecentEntries,
        wealthDistribution: mockWealthDistribution,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching ledger data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const generateMockTopBalances = (): AddressBalance[] => {
    const addresses = [];
    for (let i = 0; i < 50; i++) {
      const balance = Math.floor(Math.random() * 10000000000000) + 1000000000; // 10-100K BTC range
      addresses.push({
        address: `bc1${Math.random().toString(36).substr(2, 39)}`,
        balance,
        totalReceived: balance + Math.floor(Math.random() * balance * 0.5),
        totalSent: Math.floor(Math.random() * balance * 0.3),
        transactionCount: Math.floor(Math.random() * 10000) + 100,
        firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    return addresses.sort((a, b) => b.balance - a.balance);
  };

  const generateMockLedgerEntries = (): LedgerEntry[] => {
    const entries = [];
    for (let i = 0; i < 100; i++) {
      const balanceChange = (Math.random() - 0.5) * 1000000000; // +/- 10 BTC
      entries.push({
        blockHeight: 850000 + Math.floor(Math.random() * 1000),
        timestamp: new Date(Date.now() - i * 600000).toISOString(), // Every 10 minutes
        transactionHash: `${Math.random().toString(16).substr(2, 64)}`,
        address: `bc1${Math.random().toString(36).substr(2, 39)}`,
        balanceChange,
        newBalance: Math.abs(balanceChange) + Math.floor(Math.random() * 10000000000),
        type: balanceChange > 0 ? 'credit' : 'debit',
        confirmations: Math.floor(Math.random() * 100) + 1
      });
    }
    return entries;
  };

  const generateWealthDistribution = () => [
    { range: '0 - 0.001 BTC', count: 15234567, percentage: 35.6 },
    { range: '0.001 - 0.01 BTC', count: 8765432, percentage: 20.5 },
    { range: '0.01 - 0.1 BTC', count: 7234567, percentage: 16.9 },
    { range: '0.1 - 1 BTC', count: 5432109, percentage: 12.7 },
    { range: '1 - 10 BTC', count: 3456789, percentage: 8.1 },
    { range: '10 - 100 BTC', count: 1234567, percentage: 2.9 },
    { range: '100 - 1000 BTC', count: 876543, percentage: 2.0 },
    { range: '1000+ BTC', count: 123456, percentage: 1.3 }
  ];

  const searchAddressBalance = async () => {
    if (!searchAddress.trim()) return;
    
    setSearchLoading(true);
    try {
      // In real implementation, this would call BlockCypher API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult: AddressBalance = {
        address: searchAddress,
        balance: Math.floor(Math.random() * 1000000000000),
        totalReceived: Math.floor(Math.random() * 2000000000000),
        totalSent: Math.floor(Math.random() * 1500000000000),
        transactionCount: Math.floor(Math.random() * 5000) + 10,
        firstSeen: new Date(Date.now() - Math.random() * 1000 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setSearchResult(mockResult);
    } catch (error) {
      console.error('Address search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatBTC = (satoshis: number): string => {
    const btc = satoshis / 100000000;
    if (btc >= 1000) return `₿${(btc / 1000).toFixed(1)}K`;
    if (btc >= 1) return `₿${btc.toFixed(4)}`;
    return `${satoshis.toLocaleString()} sats`;
  };

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
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
              <Database style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                margin: '0 0 var(--space-1) 0'
              }}>
                Ledger Analysis
              </h1>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
                Comprehensive blockchain ledger state analysis and balance distribution insights
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select
              value={state.selectedTimeframe}
              onChange={(e) => setState(prev => ({ ...prev, selectedTimeframe: e.target.value as any }))}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--surface-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)'
              }}
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="1y">1 Year</option>
            </select>

            <button
              onClick={fetchLedgerData}
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
        </div>

        {/* Address Search */}
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
            placeholder="Search address balance (e.g., bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh)"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontFamily: 'var(--font-family-mono)'
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchAddressBalance()}
          />
          <button
            onClick={searchAddressBalance}
            disabled={searchLoading}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--color-primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: searchLoading ? 'not-allowed' : 'pointer',
              fontSize: 'var(--text-sm)'
            }}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-3) 0' }}>
              Address Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Address</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-family-mono)' }}>
                  {formatAddress(searchResult.address)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Current Balance</div>
                <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>
                  {formatBTC(searchResult.balance)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total Received</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success-600)' }}>
                  {formatBTC(searchResult.totalReceived)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total Sent</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error-600)' }}>
                  {formatBTC(searchResult.totalSent)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Transactions</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {searchResult.transactionCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Last Activity</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {formatTimeAgo(searchResult.lastActivity)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ledger Metrics */}
      {state.metrics && (
        <section>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)'
          }}>
            Network Overview
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
                <Users style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Address Statistics</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Total Addresses</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {state.metrics.totalAddresses.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Active (24h)</span>
                  <span style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-semibold)' }}>
                    {state.metrics.activeAddresses24h.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Dormant</span>
                  <span style={{ color: 'var(--color-warning-600)', fontWeight: 'var(--font-semibold)' }}>
                    {state.metrics.dormantAddresses.toLocaleString()}
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
                <DollarSign style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Supply Metrics</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Total Supply</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {formatBTC(state.metrics.totalSupply)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Largest Balance</span>
                  <span style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-semibold)' }}>
                    {formatBTC(state.metrics.largestBalance)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Average Balance</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {formatBTC(state.metrics.averageBalance)}
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
                <BarChart3 style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Distribution</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Gini Coefficient</span>
                  <span style={{ 
                    color: state.metrics.giniCoefficient > 0.8 ? 'var(--color-error-600)' : 'var(--color-warning-600)', 
                    fontWeight: 'var(--font-semibold)' 
                  }}>
                    {state.metrics.giniCoefficient.toFixed(3)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Inequality</span>
                  <span style={{ color: 'var(--color-error-600)', fontWeight: 'var(--font-semibold)' }}>
                    {state.metrics.giniCoefficient > 0.8 ? 'Very High' : state.metrics.giniCoefficient > 0.6 ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Wealth Distribution */}
      <section>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)'
        }}>
          Wealth Distribution
        </h2>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {state.wealthDistribution.map((item, index) => (
              <div key={item.range} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-3)',
                background: 'var(--surface-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ minWidth: '150px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                  {item.range}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: 'var(--surface-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: `hsl(${120 - (index * 15)}, 70%, 50%)`,
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                  <div style={{ minWidth: '60px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {item.percentage}%
                  </div>
                  <div style={{ minWidth: '100px', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                    {item.count.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Balances */}
      <section>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)'
        }}>
          Top Address Balances
        </h2>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 120px 120px 80px 100px',
            gap: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--surface-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--text-tertiary)'
          }}>
            <div>#</div>
            <div>Address</div>
            <div>Balance</div>
            <div>Total Received</div>
            <div>TX Count</div>
            <div>Last Activity</div>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {state.topBalances.slice(0, 20).map((address, index) => (
              <div
                key={address.address}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 120px 120px 80px 100px',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  borderBottom: index < 19 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: 'var(--text-sm)',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ color: 'var(--text-tertiary)', fontWeight: 'var(--font-medium)' }}>
                  {index + 1}
                </div>
                <div style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 'var(--text-sm)'
                }}>
                  {formatAddress(address.address)}
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                  {formatBTC(address.balance)}
                </div>
                <div style={{ color: 'var(--color-success-600)' }}>
                  {formatBTC(address.totalReceived)}
                </div>
                <div style={{ color: 'var(--text-primary)' }}>
                  {address.transactionCount.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  {formatTimeAgo(address.lastActivity)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Ledger Entries */}
      <section>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-6)'
        }}>
          Recent Ledger Entries
        </h2>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {state.recentEntries.slice(0, 50).map((entry, index) => (
              <div
                key={`${entry.transactionHash}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  borderBottom: index < 49 ? '1px solid var(--border-subtle)' : 'none',
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
                  background: entry.type === 'credit' ? 'var(--color-success-100)' : 'var(--color-error-100)',
                  border: `1px solid ${entry.type === 'credit' ? 'var(--color-success-300)' : 'var(--color-error-300)'}`
                }}>
                  {entry.type === 'credit' ? (
                    <ArrowDownLeft style={{ width: '16px', height: '16px', color: 'var(--color-success-600)' }} />
                  ) : (
                    <ArrowUpRight style={{ width: '16px', height: '16px', color: 'var(--color-error-600)' }} />
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <Hash style={{ width: '12px', height: '12px', color: 'var(--text-tertiary)' }} />
                    <code style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-mono)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {entry.transactionHash.substring(0, 16)}...
                    </code>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      padding: 'var(--space-1) var(--space-2)',
                      background: 'var(--surface-tertiary)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      Block {entry.blockHeight.toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-family-mono)'
                  }}>
                    {formatAddress(entry.address)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    color: entry.type === 'credit' ? 'var(--color-success-600)' : 'var(--color-error-600)'
                  }}>
                    {entry.type === 'credit' ? '+' : '-'}{formatBTC(Math.abs(entry.balanceChange))}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)'
                  }}>
                    {formatTimeAgo(entry.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

export default LedgerAnalysis;
