import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Shield, 
  Clock, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Zap,
  Target,
  Brain,
  Radar,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  DollarSign
} from 'lucide-react';

interface AnomalyData {
  id: string;
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  wallet?: string;
  transactionHash?: string;
  amount?: string;
  timestamp: string;
  riskScore: number;
  confidence: number;
  indicators: string[];
  category: 'transaction' | 'wallet' | 'network' | 'pattern';
  location?: string;
  relatedAnomalies?: string[];
}

interface AnomalyMetrics {
  totalAnomalies: number;
  criticalCount: number;
  highRiskCount: number;
  resolvedToday: number;
  detectionRate: number;
  falsePositiveRate: number;
}

const AnomalyDetection: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API call
      const mockAnomalies: AnomalyData[] = [
        {
          id: 'an_001',
          type: 'Sudden Volume Spike',
          description: 'Unusual transaction volume detected - 500% above normal baseline',
          severity: 'critical',
          wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          transactionHash: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
          amount: '1,247.83 BTC',
          timestamp: new Date().toISOString(),
          riskScore: 95,
          confidence: 89,
          indicators: ['Volume anomaly', 'Time pattern deviation', 'Geographic clustering'],
          category: 'transaction',
          location: 'Eastern Europe',
          relatedAnomalies: ['an_003', 'an_007']
        },
        {
          id: 'an_002',
          type: 'Mixing Pattern Detection',
          description: 'Advanced coin mixing techniques identified across multiple addresses',
          severity: 'high',
          wallet: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          transactionHash: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d',
          amount: '234.56 BTC',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          riskScore: 87,
          confidence: 92,
          indicators: ['CoinJoin patterns', 'Multiple small inputs', 'Privacy coins interaction'],
          category: 'pattern',
          location: 'Multiple regions',
          relatedAnomalies: ['an_005']
        },
        {
          id: 'an_003',
          type: 'Rapid Consecutive Transactions',
          description: 'High-frequency trading pattern detected with sub-second intervals',
          severity: 'high',
          wallet: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          transactionHash: 'b3c1c6e0b1d3a9e7f8c9e5b2a7d4f6e8c9b5a2d7f4e6c8b9a5d2f7e4c6b8a9d5',
          amount: '89.12 BTC',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          riskScore: 78,
          confidence: 85,
          indicators: ['Automated trading', 'MEV opportunities', 'Arbitrage patterns'],
          category: 'transaction',
          location: 'North America',
          relatedAnomalies: ['an_001']
        },
        {
          id: 'an_004',
          type: 'Dust Attack Campaign',
          description: 'Coordinated dust attacks targeting privacy-conscious users',
          severity: 'medium',
          wallet: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          transactionHash: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
          amount: '0.00000546 BTC',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          riskScore: 45,
          confidence: 78,
          indicators: ['Dust amounts', 'Mass distribution', 'Privacy degradation'],
          category: 'wallet',
          location: 'Global',
          relatedAnomalies: []
        },
        {
          id: 'an_005',
          type: 'Whale Movement Alert',
          description: 'Large dormant wallet activated after 3+ years of inactivity',
          severity: 'high',
          wallet: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
          transactionHash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
          amount: '2,847.91 BTC',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          riskScore: 82,
          confidence: 95,
          indicators: ['Dormant wallet activation', 'Large amount', 'Market timing'],
          category: 'wallet',
          location: 'Asia Pacific',
          relatedAnomalies: ['an_002']
        },
        {
          id: 'an_006',
          type: 'Network Congestion Exploitation',
          description: 'Fee manipulation detected during network congestion periods',
          severity: 'medium',
          transactionHash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
          amount: '15.67 BTC',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          riskScore: 65,
          confidence: 73,
          indicators: ['Fee manipulation', 'Mempool exploitation', 'Priority bypass'],
          category: 'network',
          location: 'Global network',
          relatedAnomalies: []
        }
      ];

      setAnomalies(mockAnomalies);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = (): AnomalyMetrics => {
    const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
    const highRiskCount = anomalies.filter(a => a.severity === 'high').length;
    
    return {
      totalAnomalies: anomalies.length,
      criticalCount,
      highRiskCount,
      resolvedToday: 12,
      detectionRate: 94.7,
      falsePositiveRate: 2.3
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return {
        bg: 'var(--color-error-100)',
        text: 'var(--color-error-700)',
        border: 'var(--color-error-300)',
        icon: 'var(--color-error-600)'
      };
      case 'high': return {
        bg: 'var(--color-warning-100)',
        text: 'var(--color-warning-700)',
        border: 'var(--color-warning-300)',
        icon: 'var(--color-warning-600)'
      };
      case 'medium': return {
        bg: 'var(--color-primary-100)',
        text: 'var(--color-primary-700)',
        border: 'var(--color-primary-300)',
        icon: 'var(--color-primary-600)'
      };
      case 'low': return {
        bg: 'var(--color-success-100)',
        text: 'var(--color-success-700)',
        border: 'var(--color-success-300)',
        icon: 'var(--color-success-600)'
      };
      default: return {
        bg: 'var(--surface-tertiary)',
        text: 'var(--text-secondary)',
        border: 'var(--border-subtle)',
        icon: 'var(--text-tertiary)'
      };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction': return Activity;
      case 'wallet': return Shield;
      case 'network': return Radar;
      case 'pattern': return Brain;
      default: return Target;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesSeverity = selectedSeverity === 'all' || anomaly.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || anomaly.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      anomaly.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anomaly.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (anomaly.wallet && anomaly.wallet.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSeverity && matchesCategory && matchesSearch;
  });

  const metrics = getMetrics();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: 'var(--space-6)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)'
            }}>
              <Brain style={{ width: '28px', height: '28px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-bold)',
                color: 'white',
                margin: '0 0 var(--space-2) 0',
                background: 'linear-gradient(135deg, white 0%, rgba(59, 130, 246, 0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Anomaly Detection
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: 0,
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-medium)'
              }}>
                AI-powered detection of suspicious activities, unusual patterns, and potential security threats
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-sm)',
              color: 'rgba(34, 197, 94, 0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontWeight: 'var(--font-medium)',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
              backdropFilter: 'blur(8px)'
            }}>
              <Eye style={{ width: '16px', height: '16px' }} />
              Real-time monitoring
            </div>
            
            <button
              onClick={fetchAnomalies}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-5)',
                background: loading ? 'var(--color-primary-400)' : 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.3)',
                transition: 'all var(--transition-fast)',
                transform: loading ? 'none' : 'translateY(0px)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? (
                <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <RefreshCw style={{ width: '18px', height: '18px' }} />
              )}
              {loading ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-4)', 
          alignItems: 'stretch', 
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search style={{
              position: 'absolute',
              left: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.5)'
            }} />
            <input
              type="text"
              placeholder="Search anomalies, wallets, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-4) var(--space-4) var(--space-12)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-base)',
                background: 'rgba(15, 23, 42, 0.5)',
                color: 'white',
                outline: 'none',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(8px)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{
              padding: 'var(--space-4) var(--space-6)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '160px',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <option value="all">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: 'var(--space-4) var(--space-6)',
              border: '2px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '160px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary-500)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            <option value="all">All Categories</option>
            <option value="transaction">💸 Transactions</option>
            <option value="wallet">👛 Wallets</option>
            <option value="network">🌐 Network</option>
            <option value="pattern">🧩 Patterns</option>
          </select>
        </div>
      </div>

      {/* Dark Theme Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          borderLeft: '4px solid rgba(245, 158, 11, 0.8)',
          backdropFilter: 'blur(16px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.transform = 'translateY(0px)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500'
            }}>Total Anomalies</span>
            <div style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <AlertTriangle style={{ width: '18px', height: '18px', color: 'rgba(245, 158, 11, 0.9)' }} />
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            {metrics.totalAnomalies}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#f59e0b'
            }} />
            Last 24 hours
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          borderLeft: '4px solid rgba(239, 68, 68, 0.8)',
          backdropFilter: 'blur(16px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.transform = 'translateY(0px)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500'
            }}>Critical Alerts</span>
            <div style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <Zap style={{ width: '18px', height: '18px', color: 'rgba(239, 68, 68, 0.9)' }} />
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            {metrics.criticalCount}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.8)'
            }} />
            Require immediate attention
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          borderLeft: '4px solid rgba(16, 185, 129, 0.8)',
          backdropFilter: 'blur(16px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.transform = 'translateY(0px)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500'
            }}>Detection Rate</span>
            <div style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <BarChart3 style={{ width: '18px', height: '18px', color: 'rgba(16, 185, 129, 0.9)' }} />
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            {metrics.detectionRate}%
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.8)'
            }} />
            Accuracy rate
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          borderLeft: '4px solid rgba(59, 130, 246, 0.8)',
          backdropFilter: 'blur(16px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.transform = 'translateY(0px)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '500'
            }}>Resolved Today</span>
            <div style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Shield style={{ width: '18px', height: '18px', color: 'rgba(59, 130, 246, 0.9)' }} />
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            {metrics.resolvedToday}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.8)'
            }} />
            Successfully mitigated
          </div>
        </div>
      </div>

      {/* Dark Theme Anomaly List */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.8)',
              color: 'white'
            }}>
              <Filter style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                lineHeight: 1.2
              }}>
                Detected Anomalies ({filteredAnomalies.length})
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                marginTop: '4px'
              }}>
                Real-time blockchain threat monitoring
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <RefreshCw style={{ 
                width: '20px', 
                height: '20px', 
                color: 'rgba(59, 130, 246, 0.9)',
                animation: 'spin 1s linear infinite' 
              }} />
              <span style={{ fontSize: '16px', fontWeight: '500', color: 'white' }}>
                Loading anomalies...
              </span>
            </div>
          </div>
        ) : filteredAnomalies.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <div style={{
              padding: '32px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Target style={{ 
                width: '48px', 
                height: '48px', 
                marginBottom: '16px', 
                color: '#9ca3af'
              }} />
              <h3 style={{ 
                margin: 0, 
                marginBottom: '8px',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                No anomalies detected
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.5
              }}>
                Your blockchain is secure! Try adjusting filters<br />
                or search terms to explore different criteria.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredAnomalies.map((anomaly) => {
                const severityStyle = getSeverityColor(anomaly.severity);
                const CategoryIcon = getCategoryIcon(anomaly.category);
                const isExpanded = expandedAnomaly === anomaly.id;

                return (
                  <div
                    key={anomaly.id}
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'rgba(15, 23, 42, 0.6)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{
                      padding: '20px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: severityStyle.icon,
                            color: 'white',
                            flexShrink: 0
                          }}>
                            <CategoryIcon style={{ width: '20px', height: '20px' }} />
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                              <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: 'white',
                                margin: 0
                              }}>
                                {anomaly.type}
                              </h3>
                              <span style={{
                                padding: '4px 8px',
                                background: severityStyle.text,
                                color: 'white',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}>
                                {anomaly.severity}
                              </span>
                              <span style={{
                                padding: '4px 8px',
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {anomaly.category}
                              </span>
                            </div>
                            <p style={{
                              color: '#4b5563',
                              margin: 0,
                              fontSize: '14px',
                              lineHeight: 1.5,
                              marginBottom: '12px'
                            }}>
                              {anomaly.description}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <DollarSign style={{ width: '14px', height: '14px', color: '#10b981' }} />
                                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>{anomaly.amount}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Risk: {anomaly.riskScore}%</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <BarChart3 style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Confidence: {anomaly.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedAnomaly(isExpanded ? null : anomaly.id)}
                          style={{
                            padding: '8px',
                            background: isExpanded ? '#3b82f6' : 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: isExpanded ? 'white' : '#6b7280',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                            marginLeft: '16px'
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded) {
                              e.currentTarget.style.background = '#f3f4f6';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isExpanded) {
                              e.currentTarget.style.background = 'white';
                            }
                          }}
                        >
                          {isExpanded ? 
                            <ChevronUp style={{ width: '16px', height: '16px' }} /> : 
                            <ChevronDown style={{ width: '16px', height: '16px' }} />
                          }
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ 
                        padding: '20px', 
                        background: 'rgba(15, 23, 42, 0.6)'
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                          <div style={{
                            padding: '16px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                              margin: '0 0 12px 0'
                            }}>
                              Detection Details
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock style={{ width: '14px', height: '14px', color: 'rgba(255, 255, 255, 0.6)' }} />
                                <span style={{ fontSize: '12px', color: '#4b5563' }}>
                                  {formatTimestamp(anomaly.timestamp)}
                                </span>
                              </div>
                              {anomaly.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Target style={{ width: '14px', height: '14px', color: 'rgba(255, 255, 255, 0.6)' }} />
                                  <span style={{ fontSize: '12px', color: '#4b5563' }}>
                                    {anomaly.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {anomaly.wallet && (
                            <div style={{
                              padding: '16px',
                              background: 'rgba(15, 23, 42, 0.4)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                                margin: '0 0 12px 0'
                              }}>
                                Wallet Address
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <code style={{
                                  padding: '8px 12px',
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  color: 'white',
                                  fontFamily: 'monospace',
                                  border: '1px solid #d1d5db',
                                  flex: 1,
                                  wordBreak: 'break-all'
                                }}>
                                  {anomaly.wallet.substring(0, 20)}...
                                </code>
                                <button
                                  onClick={() => copyToClipboard(anomaly.wallet!)}
                                  style={{
                                    padding: '6px',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                  }}
                                >
                                  <Copy style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            </div>
                          )}

                          {anomaly.amount && (
                            <div style={{
                              padding: '16px',
                              background: 'rgba(15, 23, 42, 0.4)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                                margin: '0 0 12px 0'
                              }}>
                                Amount
                              </h4>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#10b981'
                              }}>
                                {anomaly.amount}
                              </div>
                            </div>
                          )}

                          {anomaly.transactionHash && (
                            <div style={{
                              padding: '16px',
                              background: 'rgba(15, 23, 42, 0.4)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              gridColumn: 'span 2'
                            }}>
                              <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                                margin: '0 0 12px 0'
                              }}>
                                Transaction Hash
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <code style={{
                                  padding: '8px 12px',
                                  background: 'rgba(15, 23, 42, 0.6)',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  color: 'white',
                                  fontFamily: 'monospace',
                                  border: '1px solid #d1d5db',
                                  flex: 1,
                                  wordBreak: 'break-all'
                                }}>
                                  {anomaly.transactionHash.substring(0, 40)}...
                                </code>
                                <button
                                  onClick={() => copyToClipboard(anomaly.transactionHash!)}
                                  style={{
                                    padding: '6px',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                  }}
                                >
                                  <Copy style={{ width: '12px', height: '12px' }} />
                                </button>
                                <button
                                  style={{
                                    padding: '6px',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                  }}
                                >
                                  <ExternalLink style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div style={{ marginTop: '20px' }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white',
                            margin: '0 0 12px 0'
                          }}>
                            Risk Indicators
                          </h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {anomaly.indicators.map((indicator, index) => (
                              <span
                                key={index}
                                style={{
                                  padding: '6px 12px',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  border: '1px solid #fbbf24',
                                  fontWeight: '500'
                                }}
                              >
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>

                        {anomaly.relatedAnomalies && anomaly.relatedAnomalies.length > 0 && (
                          <div style={{ marginTop: '20px' }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                              margin: '0 0 12px 0'
                            }}>
                              Related Anomalies
                            </h4>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {anomaly.relatedAnomalies.map((relatedId) => (
                                <span
                                  key={relatedId}
                                  style={{
                                    padding: '6px 12px',
                                    background: '#dbeafe',
                                    color: '#1d4ed8',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    border: '1px solid #3b82f6',
                                    fontWeight: '500'
                                  }}
                                >
                                  {relatedId}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyDetection;
