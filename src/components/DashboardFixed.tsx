import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Bitcoin, 
  Activity,
  TrendingUp,
  Eye,
  Settings,
  Bell,
  ExternalLink,
  Copy,
  Loader,
  Hash,
  Database,
  Wallet,
  Search,
  Download
} from 'lucide-react';
import TransactionChart from './TransactionChart';
import AnomalyDetection from './AnomalyDetection';
import EnhancedWalletAnalysis from './EnhancedWalletAnalysis';
import HashAnalysis from './HashAnalysis';
import BlockAnalysis from './BlockAnalysis';
import LedgerAnalysis from './LedgerAnalysis';
import LiveTransactionTracker from './LiveTransactionTracker';
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
    setLoadingBlock(true);
    try {
      const response = await fetch('https://blockchain.info/latestblock');
      const block = await response.json();
      setLatestBlock(block);
    } catch (error) {
      console.error('Error fetching latest block:', error);
    } finally {
      setLoadingBlock(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchLatestBlock();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'transactions', name: 'Transactions', icon: BarChart3 },
    { id: 'anomaly', name: 'Anomaly Detection', icon: AlertTriangle },
    { id: 'wallet', name: 'Wallet Analysis', icon: Wallet },
    { id: 'hash', name: 'Hash Analysis', icon: Hash },
    { id: 'blocks', name: 'Block Analysis', icon: Database },
    { id: 'ledger', name: 'Ledger Analysis', icon: Bitcoin },
    { id: 'live', name: 'Live Tracking', icon: Eye }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h1 className="text-white text-3xl font-bold mb-2">Crypto Analysis Dashboard</h1>
              <p className="text-slate-400">Monitor blockchain activity, detect anomalies, and analyze cryptocurrency trends in real-time.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Volume"
                value="$2.4B"
                change="+12.5%"
                icon={TrendingUp}
                color="blue"
              />
              <StatCard
                title="Active Wallets"
                value="847K"
                change="-3.2%"
                icon={Wallet}
                color="teal"
              />
              <StatCard
                title="Anomalies Detected"
                value="23"
                change="+8.7%"
                icon={AlertTriangle}
                color="yellow"
              />
              <StatCard
                title="Network Health"
                value="98.2%"
                change="+0.5%"
                icon={Shield}
                color="green"
              />
            </div>

            {/* Latest Block Information */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Bitcoin className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Latest Bitcoin Block</h3>
                    <p className="text-slate-400 text-sm">Real-time blockchain data</p>
                  </div>
                </div>
                <button
                  onClick={fetchLatestBlock}
                  disabled={loadingBlock}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {loadingBlock ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{loadingBlock ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>

              {latestBlock ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Block Height</p>
                    <p className="text-xl font-bold text-white">{latestBlock.height.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Transactions</p>
                    <p className="text-xl font-bold text-white">{latestBlock.txIndexes?.length || 0}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Timestamp</p>
                    <p className="text-xl font-bold text-white">
                      {new Date(latestBlock.time * 1000).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Block Hash</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-mono text-teal-400 truncate">
                        {latestBlock.hash.substring(0, 12)}...
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(latestBlock.hash)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">Click Refresh to load latest block data</p>
                </div>
              )}
            </div>

            {/* Transaction Chart */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Transaction Volume Trends</h3>
                  <p className="text-slate-400 text-sm">24-hour analysis with anomaly detection</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    24H
                  </button>
                  <button className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                    7D
                  </button>
                  <button className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                    30D
                  </button>
                </div>
              </div>
              <div className="h-64 bg-slate-900/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Transaction Chart Component</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { type: 'transaction', desc: 'Large transaction detected', amount: '$1.2M', time: '2 min ago', status: 'normal' },
                  { type: 'anomaly', desc: 'Unusual pattern identified', amount: 'High Risk', time: '5 min ago', status: 'warning' },
                  { type: 'wallet', desc: 'New wallet created', amount: '0.5 BTC', time: '8 min ago', status: 'normal' },
                  { type: 'block', desc: 'Block mined successfully', amount: '6.25 BTC', time: '12 min ago', status: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'warning' ? 'bg-yellow-500/20' :
                        activity.status === 'success' ? 'bg-emerald-500/20' : 'bg-slate-600/20'
                      }`}>
                        {activity.type === 'transaction' && <Activity className="w-4 h-4 text-cyan-400" />}
                        {activity.type === 'anomaly' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                        {activity.type === 'wallet' && <Wallet className="w-4 h-4 text-teal-400" />}
                        {activity.type === 'block' && <Database className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{activity.desc}</p>
                        <p className="text-slate-400 text-xs">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        activity.status === 'warning' ? 'text-yellow-400' :
                        activity.status === 'success' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {activity.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return <TransactionChart />;
      case 'anomaly':
        return <AnomalyDetection />;
      case 'wallet':
        return <EnhancedWalletAnalysis />;
      case 'hash':
        return <HashAnalysis />;
      case 'blocks':
        return <BlockAnalysis />;
      case 'ledger':
        return <LedgerAnalysis />;
      case 'live':
        return <LiveTransactionTracker />;
      default:
        return <div className="text-white">Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                  <Bitcoin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CryptoAnalyzer</h1>
                  <p className="text-xs text-slate-400">Blockchain Intelligence Platform</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions, addresses, blocks..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Pills */}
      <div className="bg-slate-800/30 border-b border-slate-700/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
