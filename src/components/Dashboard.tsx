import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Bitcoin, 
  Activity,
  TrendingUp,
  Eye,
  Hash,
  Database,
  Wallet,
  Search,
  Bell,
  Settings,
  Download,
  Copy,
  Loader,
  RefreshCw,
  Brain
} from 'lucide-react';
import BlockCypherService from '../services/blockCypherService';
import type { 
  DashboardMetrics, 
  BlockCypherBlock
} from '../services/blockCypherService';
import LiveTransactionFeed from './LiveTransactionFeed';
import LedgerAnalysis from './LedgerAnalysis';
import BlockAnalysis from './BlockAnalysis';
import HashAnalysis from './HashAnalysis';
import WalletAnalysis from './WalletAnalysis';
import AnomalyDetection from './AnomalyDetection';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [latestBlock, setLatestBlock] = useState<BlockCypherBlock | null>(null);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);

  useEffect(() => {
    setIsLoaded(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoadingMetrics(true);
    try {
      const metrics = await BlockCypherService.getDashboardMetrics();
      setDashboardMetrics(metrics);
      setLatestBlock(metrics.latestBlock);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchLatestBlock = async () => {
    setLoadingBlock(true);
    try {
      const block = await BlockCypherService.getLatestBlock();
      setLatestBlock(block);
    } catch (error) {
      console.error('Error fetching latest block:', error);
    } finally {
      setLoadingBlock(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const results = await BlockCypherService.search(query.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ error: 'Search failed. Please check your query format.' });
    }
  };

  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'transactions', name: 'Transactions', icon: BarChart3 },
    { id: 'anomaly', name: 'Anomaly Detection', icon: Brain },
    { id: 'wallet', name: 'Wallet Analysis', icon: Wallet },
    { id: 'hash', name: 'Hash Analysis', icon: Hash },
    { id: 'blocks', name: 'Block Analysis', icon: Database },
    { id: 'ledger', name: 'Ledger Analysis', icon: Bitcoin },
    { id: 'live', name: 'Live Tracking', icon: Eye }
  ];

  const MetricCard = ({ title, value, change, icon: Icon }: any) => (
    <div 
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        transition: 'all var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ 
          fontSize: 'var(--text-sm)', 
          fontWeight: 'var(--font-medium)', 
          color: 'var(--text-tertiary)', 
          margin: 0 
        }}>
          {title}
        </h3>
        <Icon style={{ width: '20px', height: '20px', color: 'var(--text-tertiary)' }} />
      </div>
      
      <div style={{ 
        fontSize: 'var(--text-3xl)', 
        fontWeight: 'var(--font-bold)', 
        color: 'var(--text-primary)', 
        margin: '0 0 var(--space-2) 0',
        lineHeight: 'var(--leading-tight)'
      }}>
        {value}
      </div>
      
      {change && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          color: change.startsWith('+') ? 'var(--color-success-500)' : change.startsWith('-') ? 'var(--color-error-500)' : 'var(--text-tertiary)'
        }}>
          {change.startsWith('+') ? <TrendingUp style={{ width: '16px', height: '16px' }} /> : 
           change.startsWith('-') ? <TrendingUp style={{ width: '16px', height: '16px', transform: 'rotate(180deg)' }} /> : null}
          <span>{change}</span>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Welcome Header */}
      <div style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--text-4xl)', 
          fontWeight: 'var(--font-bold)', 
          color: 'var(--text-primary)', 
          margin: '0 0 var(--space-2) 0' 
        }}>
          Crypto Analysis Dashboard
        </h1>
        <p style={{ 
          color: 'var(--text-tertiary)', 
          margin: 0 
        }}>
          Monitor blockchain activity, detect anomalies, and analyze cryptocurrency trends in real-time.
        </p>
      </div>

      {/* Search Results */}
      {searchResults && (
        <section>
          <div style={{
            background: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)'
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-semibold)', 
              color: 'var(--text-primary)', 
              margin: '0 0 var(--space-4) 0' 
            }}>
              Search Results
            </h3>
            {searchResults.error ? (
              <p style={{ color: 'var(--color-error-500)' }}>{searchResults.error}</p>
            ) : (
              <div style={{
                background: 'var(--surface-secondary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-family-mono)',
                fontSize: 'var(--text-sm)',
                overflow: 'auto'
              }}>
                <pre>{JSON.stringify(searchResults, null, 2)}</pre>
              </div>
            )}
            <button
              onClick={() => setSearchResults(null)}
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--surface-interactive)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              Clear Results
            </button>
          </div>
        </section>
      )}

      {/* Key Metrics */}
      <section>
        <h2 style={{ 
          fontSize: 'var(--text-2xl)', 
          fontWeight: 'var(--font-semibold)', 
          color: 'var(--text-primary)', 
          marginBottom: 'var(--space-6)' 
        }}>
          Key Metrics
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          <MetricCard
            title="Total Volume (24h)"
            value={dashboardMetrics ? formatUSD(dashboardMetrics.totalVolume.usd) : loadingMetrics ? "Loading..." : "$2.4B"}
            change={dashboardMetrics ? `${dashboardMetrics.totalVolume.change24h > 0 ? '+' : ''}${dashboardMetrics.totalVolume.change24h.toFixed(1)}%` : "+12.5%"}
            icon={TrendingUp}
          />
          <MetricCard
            title="Active Wallets"
            value={dashboardMetrics ? dashboardMetrics.activeWallets.count.toLocaleString() : loadingMetrics ? "Loading..." : "847K"}
            change={dashboardMetrics ? `${dashboardMetrics.activeWallets.change24h > 0 ? '+' : ''}${dashboardMetrics.activeWallets.change24h.toFixed(1)}%` : "-3.2%"}
            icon={Wallet}
          />
          <MetricCard
            title="Anomalies Detected"
            value={dashboardMetrics ? dashboardMetrics.anomaliesDetected.count.toString() : loadingMetrics ? "Loading..." : "23"}
            change={dashboardMetrics ? `${dashboardMetrics.anomaliesDetected.change24h > 0 ? '+' : ''}${dashboardMetrics.anomaliesDetected.change24h.toFixed(1)}%` : "+8.7%"}
            icon={AlertTriangle}
          />
          <MetricCard
            title="Network Health"
            value={dashboardMetrics ? `${dashboardMetrics.networkHealth.percentage.toFixed(1)}%` : loadingMetrics ? "Loading..." : "98.2%"}
            change={dashboardMetrics ? dashboardMetrics.networkHealth.status : "Excellent"}
            icon={Shield}
          />
        </div>
      </section>

      {/* Latest Block Information */}
      <section>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 'var(--space-4)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-500)',
                color: 'var(--color-neutral-50)'
              }}>
                <Bitcoin style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: 'var(--font-semibold)', 
                  color: 'var(--text-primary)', 
                  margin: '0 0 var(--space-1) 0' 
                }}>
                  Latest Bitcoin Block
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-tertiary)', 
                  margin: 0 
                }}>
                  Real-time blockchain data
                </p>
              </div>
            </div>
            <button
              onClick={fetchLatestBlock}
              disabled={loadingBlock}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                cursor: loadingBlock ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                transition: 'all var(--transition-fast)',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => {
                if (!loadingBlock) {
                  e.currentTarget.style.background = 'var(--surface-interactive)';
                  e.currentTarget.style.borderColor = 'var(--text-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
            >
              {loadingBlock ? (
                <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <RefreshCw style={{ width: '16px', height: '16px' }} />
              )}
              {loadingBlock ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {latestBlock ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)'
            }}>
              <div style={{
                background: 'var(--surface-secondary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--text-tertiary)', 
                  margin: '0 0 var(--space-1) 0' 
                }}>
                  Block Height
                </p>
                <p style={{ 
                  fontSize: 'var(--text-xl)', 
                  fontWeight: 'var(--font-bold)', 
                  color: 'var(--text-primary)', 
                  margin: 0 
                }}>
                  {latestBlock.height.toLocaleString()}
                </p>
              </div>
              <div style={{
                background: 'var(--surface-secondary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--text-tertiary)', 
                  margin: '0 0 var(--space-1) 0' 
                }}>
                  Transactions
                </p>
                <p style={{ 
                  fontSize: 'var(--text-xl)', 
                  fontWeight: 'var(--font-bold)', 
                  color: 'var(--text-primary)', 
                  margin: 0 
                }}>
                  {latestBlock.n_tx || 0}
                </p>
              </div>
              <div style={{
                background: 'var(--surface-secondary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--text-tertiary)', 
                  margin: '0 0 var(--space-1) 0' 
                }}>
                  Timestamp
                </p>
                <p style={{ 
                  fontSize: 'var(--text-base)', 
                  fontWeight: 'var(--font-medium)', 
                  color: 'var(--text-primary)', 
                  margin: 0 
                }}>
                  {new Date(latestBlock.time).toLocaleTimeString()}
                </p>
              </div>
              <div style={{
                background: 'var(--surface-secondary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)'
              }}>
                <p style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--text-tertiary)', 
                  margin: '0 0 var(--space-1) 0' 
                }}>
                  Block Hash
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <code style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--color-primary-400)', 
                    fontFamily: 'var(--font-family-mono)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {latestBlock.hash.substring(0, 12)}...
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(latestBlock.hash)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: 'var(--space-1)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                    }}
                    title="Copy hash"
                  >
                    <Copy style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-8)', 
              color: 'var(--text-tertiary)' 
            }}>
              Click Refresh to load latest block data
            </div>
          )}
        </div>
      </section>

      {/* Chart Placeholder */}
      <section>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 'var(--space-6)' 
          }}>
            <div>
              <h3 style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-semibold)', 
                color: 'var(--text-primary)', 
                margin: '0 0 var(--space-1) 0' 
              }}>
                Transaction Volume Trends
              </h3>
              <p style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--text-tertiary)', 
                margin: 0 
              }}>
                24-hour analysis with anomaly detection
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                background: 'var(--color-primary-500)',
                color: 'var(--color-neutral-50)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}>24H</button>
              <button style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                background: 'transparent',
                color: 'var(--text-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}>7D</button>
              <button style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                background: 'transparent',
                color: 'var(--text-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}>30D</button>
            </div>
          </div>
          <div style={{ 
            height: '300px', 
            background: 'var(--surface-secondary)', 
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <BarChart3 style={{ 
                width: '48px', 
                height: '48px', 
                color: 'var(--text-tertiary)', 
                margin: '0 auto var(--space-4)' 
              }} />
              <p style={{ color: 'var(--text-tertiary)' }}>Chart visualization will be rendered here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Transactions Preview */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)'
        }}>
          <h2 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 'var(--font-semibold)', 
            color: 'var(--text-primary)', 
            margin: 0
          }}>
            Recent Transactions
          </h2>
          <button
            onClick={() => setActiveTab('live')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-interactive)';
              e.currentTarget.style.borderColor = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
          >
            <Eye style={{ width: '16px', height: '16px' }} />
            View Live Feed
          </button>
        </div>
        <LiveTransactionFeed maxTransactions={5} />
      </section>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'live':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <LiveTransactionFeed maxTransactions={15} />
          </div>
        );
      case 'ledger':
        return <LedgerAnalysis />;
      case 'blocks':
        return <BlockAnalysis />;
      case 'hash':
        return <HashAnalysis />;
      case 'wallet':
        return <WalletAnalysis />;
      case 'anomaly':
        return <AnomalyDetection />;
      default:
        return (
          <div style={{
            background: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-semibold)', 
              color: 'var(--text-primary)', 
              margin: '0 0 var(--space-2) 0' 
            }}>
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h3>
            <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
              Feature coming soon
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav style={{
        background: 'var(--surface-primary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--space-5) 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 var(--space-6)'
        }}>
          {/* Top Navigation Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 'var(--space-6)' 
          }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: '240px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Bitcoin style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <div style={{ 
                  fontSize: 'var(--text-xl)', 
                  fontWeight: 'var(--font-semibold)', 
                  color: 'var(--text-primary)',
                  lineHeight: 'var(--leading-tight)'
                }}>
                  CryptoAnalyzer
                </div>
                <div style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--text-tertiary)',
                  lineHeight: 'var(--leading-tight)'
                }}>
                  Blockchain Intelligence Platform
                </div>
              </div>
            </div>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: '500px', margin: '0 var(--space-6)' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute',
                  left: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }} />
                <input
                  type="text"
                  placeholder="Search transactions, addresses, blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  style={{
                    width: '100%',
                    paddingLeft: 'calc(var(--space-4) + 18px + var(--space-3))',
                    paddingRight: 'var(--space-4)',
                    paddingTop: 'var(--space-3)',
                    paddingBottom: 'var(--space-3)',
                    background: 'var(--surface-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    outline: 'none',
                    transition: 'all var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)',
                    minHeight: '48px',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary-500)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.15), var(--shadow-md)';
                    e.currentTarget.style.background = 'var(--surface-primary)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.background = 'var(--surface-secondary)';
                  }}
                  onMouseEnter={(e) => {
                    if (e.currentTarget !== document.activeElement) {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget !== document.activeElement) {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: '240px', justifyContent: 'flex-end' }}>
              <button style={{
                padding: 'var(--space-3)',
                background: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                minHeight: '48px',
                minWidth: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-interactive)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-tertiary)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title="Notifications"
              >
                <Bell style={{ width: '20px', height: '20px' }} />
              </button>
              <button style={{
                padding: 'var(--space-3)',
                background: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                minHeight: '48px',
                minWidth: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-interactive)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-tertiary)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              title="Settings"
              >
                <Settings style={{ width: '20px', height: '20px' }} />
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-primary-500)',
                color: 'var(--color-neutral-50)',
                border: '1px solid var(--color-primary-500)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                minHeight: '48px',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-600)';
                e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-500)';
                e.currentTarget.style.borderColor = 'var(--color-primary-500)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                Export Data
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-1)',
            padding: 'var(--space-2)',
            background: 'var(--surface-secondary)',
            borderRadius: 'var(--radius-xl)',
            overflowX: 'auto',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3) var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                    color: isActive ? 'var(--color-neutral-50)' : 'var(--text-tertiary)',
                    background: isActive ? 'var(--color-primary-500)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    whiteSpace: 'nowrap',
                    minHeight: '44px',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'var(--surface-interactive)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-tertiary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-4)'
      }}>
        <div style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(1rem)',
          transition: 'all var(--transition-slow)'
        }}>
          {renderTabContent()}
        </div>
      </main>

      {/* Add CSS animation for loading spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
