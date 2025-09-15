import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Copy, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Loader,
  Wallet,
  Activity,
} from 'lucide-react';

interface WalletData {
  address: string;
  balance: string;
  totalTransactions: number;
  firstSeen: string;
  lastActivity: string;
  riskScore: number;
  category: string;
  tags: string[];
  recentActivity: Array<{
    type: string;
    amount: string;
    from?: string;
    to?: string;
    time: string;
    hash?: string;
  }>;
}

const WalletAnalysis: React.FC = () => {
  const [searchWallet, setSearchWallet] = useState('');
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeWallet = async () => {
    if (!searchWallet.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock wallet data for demonstration
      const mockWallet: WalletData = {
        address: searchWallet.trim(),
        balance: `${(Math.random() * 10).toFixed(8)} BTC`,
        totalTransactions: Math.floor(Math.random() * 1000) + 50,
        firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        riskScore: Math.floor(Math.random() * 100),
        category: ['Low Risk', 'Medium Risk', 'High Risk', 'Suspicious'][Math.floor(Math.random() * 4)],
        tags: ['Exchange', 'Mining Pool', 'DeFi', 'Personal Wallet'].slice(0, Math.floor(Math.random() * 3) + 1),
        recentActivity: Array.from({ length: 5 }, (_, i) => ({
          type: Math.random() > 0.5 ? 'Received' : 'Sent',
          amount: `${(Math.random() * 5).toFixed(8)} BTC`,
          from: '1' + Math.random().toString(36).substring(2, 15),
          to: '1' + Math.random().toString(36).substring(2, 15),
          time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString(),
          hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }))
      };
      
      setWalletData(prev => {
        const exists = prev.find(w => w.address === mockWallet.address);
        if (exists) {
          return prev.map(w => w.address === mockWallet.address ? mockWallet : w);
        }
        return [mockWallet, ...prev];
      });
      
      setSearchWallet('');
    } catch (err) {
      setError('Failed to analyze wallet');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return {
      bg: 'var(--color-error-100)',
      text: 'var(--color-error-700)',
      border: 'var(--color-error-300)'
    };
    if (score >= 60) return {
      bg: 'var(--color-warning-100)',
      text: 'var(--color-warning-700)',
      border: 'var(--color-warning-300)'
    };
    if (score >= 40) return {
      bg: 'var(--color-primary-100)',
      text: 'var(--color-primary-700)',
      border: 'var(--color-primary-300)'
    };
    return {
      bg: 'var(--color-success-100)',
      text: 'var(--color-success-700)',
      border: 'var(--color-success-300)'
    };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'High Risk': return { bg: 'var(--color-error-100)', text: 'var(--color-error-700)' };
      case 'Suspicious': return { bg: 'var(--color-warning-100)', text: 'var(--color-warning-700)' };
      case 'Medium Risk': return { bg: 'var(--color-primary-100)', text: 'var(--color-primary-700)' };
      default: return { bg: 'var(--color-success-100)', text: 'var(--color-success-700)' };
    }
  };

  const formatAddress = (address: string): string => {
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalBTC = walletData.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance.replace(' BTC', ''));
  }, 0);

  const highRiskCount = walletData.filter(w => 
    w.category === 'High Risk' || w.category === 'Suspicious'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Enhanced Header */}
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
              <Wallet style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                margin: '0 0 var(--space-1) 0'
              }}>
                Wallet Analysis
              </h1>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
                Analyze Bitcoin wallet addresses for risk assessment, transaction patterns, and portfolio tracking
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}>
              <Activity style={{ width: '14px', height: '14px' }} />
              {walletData.length} Monitored
            </span>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'stretch' }}>
          <div style={{ position: 'relative', flex: '1' }}>
            <Search style={{
              position: 'absolute',
              left: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: 'var(--text-tertiary)'
            }} />
            <input
              type="text"
              placeholder="Enter Bitcoin address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
              value={searchWallet}
              onChange={(e) => setSearchWallet(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeWallet()}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-4) var(--space-4) var(--space-12)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                background: 'var(--surface-secondary)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all var(--transition-fast)',
                fontFamily: 'var(--font-family-mono)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary-500)';
                e.target.style.background = 'var(--surface-primary)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.background = 'var(--surface-secondary)';
              }}
              disabled={loading}
            />
          </div>
          <button
            onClick={analyzeWallet}
            disabled={loading || !searchWallet.trim()}
            style={{
              padding: 'var(--space-4) var(--space-6)',
              background: loading || !searchWallet.trim() ? 'var(--surface-interactive)' : 'var(--color-primary-500)',
              color: loading || !searchWallet.trim() ? 'var(--text-tertiary)' : 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: loading || !searchWallet.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!loading && searchWallet.trim()) {
                e.currentTarget.style.background = 'var(--color-primary-600)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && searchWallet.trim()) {
                e.currentTarget.style.background = 'var(--color-primary-500)';
              }
            }}
          >
            {loading && <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
            <span>{loading ? 'Analyzing...' : 'Analyze Wallet'}</span>
          </button>
        </div>

        {error && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--color-error-100)',
            border: '1px solid var(--color-error-300)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            <AlertTriangle style={{ width: '18px', height: '18px', color: 'var(--color-error-600)' }} />
            <span style={{ color: 'var(--color-error-700)', fontSize: 'var(--text-sm)' }}>{error}</span>
          </div>
        )}
      </div>

      {/* Enhanced Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-6)'
      }}>
        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-primary-500)20, var(--color-primary-400)40)',
            borderRadius: '0 var(--radius-lg) 0 100%',
            opacity: 0.1
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-primary-400)',
                lineHeight: 1,
                marginBottom: 'var(--space-2)'
              }}>
                {walletData.length}
              </div>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-1)'
              }}>
                Wallets Analyzed
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)'
              }}>
                Active monitoring
              </div>
            </div>
            <div style={{
              padding: 'var(--space-3)',
              background: 'var(--color-primary-100)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-primary-300)'
            }}>
              <Wallet style={{ width: '24px', height: '24px', color: 'var(--color-primary-600)' }} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-error-500)20, var(--color-error-400)40)',
            borderRadius: '0 var(--radius-lg) 0 100%',
            opacity: 0.1
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-error-400)',
                lineHeight: 1,
                marginBottom: 'var(--space-2)'
              }}>
                {highRiskCount}
              </div>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-1)'
              }}>
                High Risk Wallets
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)'
              }}>
                {walletData.length > 0 ? `${((highRiskCount / walletData.length) * 100).toFixed(1)}% of total` : 'Risk assessment'}
              </div>
            </div>
            <div style={{
              padding: 'var(--space-3)',
              background: 'var(--color-error-100)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-error-300)'
            }}>
              <AlertTriangle style={{ width: '24px', height: '24px', color: 'var(--color-error-600)' }} />
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-success-500)20, var(--color-success-400)40)',
            borderRadius: '0 var(--radius-lg) 0 100%',
            opacity: 0.1
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-success-400)',
                lineHeight: 1,
                marginBottom: 'var(--space-2)'
              }}>
                ₿{totalBTC.toFixed(2)}
              </div>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-1)'
              }}>
                Total BTC Tracked
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)'
              }}>
                Portfolio value
              </div>
            </div>
            <div style={{
              padding: 'var(--space-3)',
              background: 'var(--color-success-100)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-success-300)'
            }}>
              <TrendingUp style={{ width: '24px', height: '24px', color: 'var(--color-success-600)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Wallets Section */}
      <div style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                padding: 'var(--space-2)',
                background: 'var(--color-primary-500)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Shield style={{ width: '16px', height: '16px', color: 'white' }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  Monitored Wallets
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-tertiary)',
                  margin: '0'
                }}>
                  {walletData.length > 0 ? `${walletData.length} wallets under active monitoring` : 'No wallets currently monitored'}
                </p>
              </div>
            </div>
            
            {walletData.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--surface-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)'
                }}>
                  {`${walletData.filter(w => w.category === 'High Risk' || w.category === 'Suspicious').length} high risk`}
                </div>
                <div style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--color-success-100)',
                  border: '1px solid var(--color-success-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-success-700)'
                }}>
                  {`${walletData.filter(w => w.category === 'Low Risk' || w.category === 'Normal').length} low risk`}
                </div>
              </div>
            )}
          </div>
        </div>

        {walletData.length === 0 ? (
          <div style={{
            padding: 'var(--space-12)',
            textAlign: 'center'
          }}>
            <Wallet style={{
              width: '48px',
              height: '48px',
              color: 'var(--text-tertiary)',
              margin: '0 auto var(--space-4) auto'
            }} />
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-2) 0'
            }}>
              No Wallets Analyzed Yet
            </h3>
            <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
              Enter a Bitcoin address above to start monitoring and analyzing wallet activity
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px 80px 100px 120px 100px',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              background: 'var(--surface-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--text-tertiary)'
            }}>
              <div>Wallet Address</div>
              <div>Balance</div>
              <div>Transactions</div>
              <div>Risk Score</div>
              <div>Category</div>
              <div>Last Activity</div>
              <div>Actions</div>
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {walletData.map((wallet, index) => (
                <div
                  key={wallet.address}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 100px 80px 100px 120px 100px',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    borderBottom: index < walletData.length - 1 ? '1px solid var(--border-subtle)' : 'none',
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
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      <span style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-family-mono)',
                        fontWeight: 'var(--font-medium)'
                      }}>
                        {formatAddress(wallet.address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-tertiary)',
                          padding: 0
                        }}
                      >
                        <Copy style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                      {wallet.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 'var(--text-xs)',
                            padding: 'var(--space-1) var(--space-2)',
                            background: 'var(--surface-interactive)',
                            color: 'var(--text-secondary)',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 'var(--font-medium)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                    {wallet.balance}
                  </div>

                  <div style={{ color: 'var(--text-primary)' }}>
                    {wallet.totalTransactions.toLocaleString()}
                  </div>

                  <div>
                    <span style={{
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-semibold)',
                      background: getRiskColor(wallet.riskScore).bg,
                      color: getRiskColor(wallet.riskScore).text,
                      border: `1px solid ${getRiskColor(wallet.riskScore).border}`
                    }}>
                      {wallet.riskScore}%
                    </span>
                  </div>

                  <div>
                    <span style={{
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)',
                      background: getCategoryColor(wallet.category).bg,
                      color: getCategoryColor(wallet.category).text
                    }}>
                      {wallet.category}
                    </span>
                  </div>

                  <div style={{ color: 'var(--text-primary)' }}>
                    {wallet.lastActivity}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => {/* View details functionality can be added here */}}
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        background: 'var(--color-primary-500)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-xs)',
                        cursor: 'pointer',
                        fontWeight: 'var(--font-medium)'
                      }}
                    >
                      Analyze
                    </button>
                    <button
                      onClick={() => window.open(`https://blockchain.info/address/${wallet.address}`, '_blank')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-tertiary)',
                        padding: 0
                      }}
                    >
                      <ExternalLink style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

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

export default WalletAnalysis;
