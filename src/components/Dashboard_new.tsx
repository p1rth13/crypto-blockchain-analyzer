import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Bitcoin, 
  Activity,
  Zap,
  TrendingUp,
  Eye,
  Settings,
  Bell,
  ExternalLink,
  Copy,
  Loader
} from 'lucide-react';
import TransactionChart from './TransactionChart';
import AnomalyDetection from './AnomalyDetection';
import EnhancedWalletAnalysis from './EnhancedWalletAnalysis';
import StatCard from './StatCard';

interface LatestBlock {
  hash: string;
  height: number;
  time: number;
  block_index: number;
  txIndexes: number[];
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);
  const [latestBlock, setLatestBlock] = useState<LatestBlock | null>(null);
  const [loadingBlock, setLoadingBlock] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fetch latest Bitcoin block information for Overview tab
  const fetchLatestBlock = async () => {
    console.log('🔄 Starting to fetch latest block...');
    setLoadingBlock(true);
    try {
      // Try CORS proxy for blockchain.info
      console.log('📡 Fetching latest block from blockchain.info via CORS proxy...');
      const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://blockchain.info/latestblock'));
      const data = await response.json();
      const latestBlockData = JSON.parse(data.contents);
      console.log('📦 Latest block data via proxy:', latestBlockData);
      
      const blockInfo: LatestBlock = {
        hash: latestBlockData.hash,
        height: latestBlockData.height,
        time: latestBlockData.time,
        block_index: latestBlockData.block_index,
        txIndexes: latestBlockData.txIndexes || []
      };
      
      console.log('📊 Processed block info:', blockInfo);
      setLatestBlock(blockInfo);
      console.log('✅ Latest block data updated successfully in Overview!');
    } catch (err) {
      console.error('❌ Failed to fetch latest block:', err);
      // Fallback with mock data
      const mockBlock: LatestBlock = {
        hash: "00000000000000000001af9c9039ecb95a656cc56c0c35028d810fb8b6d729f9",
        height: 914256,
        time: Date.now() / 1000,
        block_index: 914256,
        txIndexes: Array.from({length: 2420}, (_, i) => i + 1000000)
      };
      setLatestBlock(mockBlock);
      console.log('📊 Using mock block data:', mockBlock);
    } finally {
      setLoadingBlock(false);
      console.log('🏁 Finished fetching latest block');
    }
  };

  // Auto-fetch latest block on component mount
  useEffect(() => {
    console.log('🚀 Dashboard component mounted! Auto-fetching latest block for Overview...');
    fetchLatestBlock();
  }, []);

  // Debug render state
  console.log('🔍 Dashboard render - Current state:', {
    activeTab,
    latestBlock: latestBlock ? 'loaded' : 'not loaded',
    loadingBlock,
    isLoaded
  });

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('📋 Copied to clipboard:', text);
  };

  // Mock data for demonstration
  const stats = {
    totalTransactions: 2156420,
    suspiciousTransactions: 3247,
    activeWallets: 18930,
    anomaliesDetected: 47
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'electric' },
    { id: 'anomalies', label: 'Anomaly Detection', icon: Shield, color: 'bitcoin' },
    { id: 'wallets', label: 'Wallet Analysis', icon: Activity, color: 'success' },
  ];

  const quickActions = [
    { id: 'scan', label: 'Quick Scan', icon: Zap, color: 'electric' },
    { id: 'alerts', label: 'Alerts', icon: Bell, color: 'warning' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="glass-card p-8 flex flex-col items-center">
          <Loader className="w-12 h-12 animate-spin text-electric-400 mb-4" />
          <div className="text-xl font-medium text-dark-100">Loading Dashboard...</div>
          <div className="text-sm text-dark-400 mt-2">Initializing crypto analysis tools</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bitcoin-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center space-x-4 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-500 to-bitcoin-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-electric-500 to-bitcoin-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-400 to-bitcoin-400 bg-clip-text text-transparent">
                    CryptoGuard Analytics
                  </h1>
                  <p className="text-sm text-dark-400">Advanced Blockchain Analysis & Security</p>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric-500/20 to-bitcoin-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className="glass-button w-12 h-12 flex items-center justify-center group relative overflow-hidden"
                    title={action.label}
                  >
                    <action.icon className="w-5 h-5 text-dark-400 group-hover:text-electric-400 transition-colors relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-500/20 to-bitcoin-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="glass-card border-0 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 py-6 px-1 border-b-2 font-medium text-sm transition-all duration-300 group ${
                  activeTab === tab.id
                    ? 'border-electric-500 text-electric-400'
                    : 'border-transparent text-dark-500 hover:text-dark-300 hover:border-electric-300'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <tab.icon className={`w-5 h-5 transition-all duration-300 ${
                  activeTab === tab.id ? 'text-electric-400 animate-pulse' : 'group-hover:scale-110'
                }`} />
                <span className="relative">
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-electric-500 to-bitcoin-500 animate-fade-in"></div>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 relative z-10">
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <StatCard
                    title="Total Transactions"
                    value={stats.totalTransactions.toLocaleString()}
                    icon={Activity}
                    color="electric"
                    change={"+15.7%"}
                    trend="up"
                  />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <StatCard
                    title="Suspicious Transactions"
                    value={stats.suspiciousTransactions.toLocaleString()}
                    icon={AlertTriangle}
                    color="danger"
                    change={"+3.2%"}
                    trend="up"
                  />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <StatCard
                    title="Active Wallets"
                    value={stats.activeWallets.toLocaleString()}
                    icon={Bitcoin}
                    color="bitcoin"
                    change={"+8.4%"}
                    trend="up"
                  />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <StatCard
                    title="Anomalies Detected"
                    value={stats.anomaliesDetected.toLocaleString()}
                    icon={Shield}
                    color="success"
                    change={"-12.1%"}
                    trend="down"
                  />
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-dark-100 mb-2">Transaction Volume Analysis</h3>
                      <p className="text-sm text-dark-400">Last 6 months blockchain activity</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-success-400 font-medium">LIVE</span>
                    </div>
                  </div>
                  <TransactionChart />
                </div>
                
                <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-dark-100 mb-2">Anomaly Detection</h3>
                      <p className="text-sm text-dark-400">Real-time threat monitoring</p>
                    </div>
                    <button className="glow-button px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View All</span>
                    </button>
                  </div>
                  <AnomalyDetection />
                </div>
              </div>

              {/* Latest Bitcoin Block */}
              <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-dark-100 mb-2">Latest Bitcoin Block</h3>
                    <p className="text-sm text-dark-400">Most recent block on the Bitcoin blockchain</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-success-400 font-medium">LIVE</span>
                    </div>
                    <button
                      onClick={fetchLatestBlock}
                      disabled={loadingBlock}
                      className="glow-button px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingBlock && <Loader className="w-4 h-4 animate-spin" />}
                      <span>{loadingBlock ? 'Loading...' : 'Refresh'}</span>
                    </button>
                  </div>
                </div>
                
                {loadingBlock ? (
                  <div className="py-12 text-center">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-electric-400" />
                    <div className="text-dark-400">Loading latest block...</div>
                  </div>
                ) : latestBlock ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="glass-card p-4 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-bitcoin-500/20 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-bitcoin-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-dark-100">#{latestBlock.height.toLocaleString()}</div>
                            <div className="text-xs text-dark-400">Block Height</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-card p-4 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-electric-500/20 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-electric-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-dark-100">{latestBlock.txIndexes.length.toLocaleString()}</div>
                            <div className="text-xs text-dark-400">Transactions</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-card p-4 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-success-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-dark-100">{new Date(latestBlock.time * 1000).toLocaleTimeString()}</div>
                            <div className="text-xs text-dark-400">Block Time</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-card p-4 border border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-warning-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-dark-100">#{latestBlock.block_index.toLocaleString()}</div>
                            <div className="text-xs text-dark-400">Block Index</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4 border border-white/10">
                      <h4 className="text-sm font-medium text-dark-200 mb-3">Block Hash</h4>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-mono text-dark-100 break-all">
                          {latestBlock.hash}
                        </div>
                        <button
                          onClick={() => copyToClipboard(latestBlock.hash)}
                          className="text-dark-400 hover:text-electric-400 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://blockstream.info/block/${latestBlock.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-electric-400 hover:text-electric-300 transition-colors flex items-center space-x-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-dark-400">
                      No block data available. Click Refresh to load latest block.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'anomalies' && (
            <div className="glass-card p-8 animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-bitcoin-400 to-electric-400 bg-clip-text text-transparent">
                    Anomaly Detection Engine
                  </h2>
                  <p className="text-dark-400 mt-2">Advanced AI-powered threat detection and analysis</p>
                </div>
                <div className="status-online w-4 h-4 bg-success-500 rounded-full"></div>
              </div>
              <AnomalyDetection detailed />
            </div>
          )}

          {activeTab === 'wallets' && (
            <div className="glass-card p-8 animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-bitcoin-400 to-electric-400 bg-clip-text text-transparent">
                    Enhanced Wallet Analysis
                  </h2>
                  <p className="text-dark-400 mt-2">Comprehensive blockchain wallet investigation tools</p>
                </div>
                <div className="status-online w-4 h-4 bg-success-500 rounded-full"></div>
              </div>
              <EnhancedWalletAnalysis />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
