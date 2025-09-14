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
  Loader,
  Hash,
  Database,
  Wallet,
  Search,
  Download
} from 'lucide-react';
import TransactionVolumeTrends from './TransactionVolumeTrends';
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'anomalies', label: 'Anomaly Detection', icon: Shield },
    { id: 'wallets', label: 'Wallet Analysis', icon: Activity },
    { id: 'hash', label: 'Hash Analysis', icon: Hash },
    { id: 'block', label: 'Block Analysis', icon: Database },
    { id: 'ledger', label: 'Ledger Portfolio', icon: Wallet },
    { id: 'live', label: 'Live Transactions', icon: Zap },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-xl flex flex-col items-center border border-slate-700">
          <Loader className="w-12 h-12 animate-spin text-teal-400 mb-4" />
          <div className="text-xl font-medium text-white">Loading Dashboard...</div>
          <div className="text-sm text-gray-400 mt-2">Initializing crypto analysis tools</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Professional Dark Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-white">
                Advanced Blockchain Analysis & Security
              </h1>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pill Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="TOTAL TRANSACTIONS"
                value="2,156,420"
                icon={BarChart3}
                color="blue"
                change="+15.7%"
                trend="up"
              />
              <StatCard
                title="SUSPICIOUS TRANSACTIONS"
                value="3,247"
                icon={AlertTriangle}
                color="yellow"
                change="+3.2%"
                trend="up"
              />
              <StatCard
                title="ACTIVE WALLETS"
                value="18,930"
                icon={Bitcoin}
                color="green"
                change="+8.4%"
                trend="up"
              />
              <StatCard
                title="ANOMALIES DETECTED"
                value="412"
                icon={Shield}
                color="red"
                change="-4.1%"
                trend="down"
              />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TransactionVolumeTrends />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white text-lg font-semibold mb-4">Insight Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white text-sm font-medium">Suspicious large transfer</p>
                        <p className="text-gray-400 text-xs">Critical: Wallet flagged</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-gray-300 text-sm font-medium">Recent Alerts</h4>
                      <div className="space-y-2">
                        <div className="text-gray-400 text-xs">• Anomaly: Unusual volume spike</div>
                        <div className="text-gray-400 text-xs">• Risk: High-risk wallet activity</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white text-lg font-semibold mb-4">Quick Filters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">All Wallets</span>
                      <span className="text-gray-500 text-xs">✓</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Blocks</span>
                      <span className="text-gray-500 text-xs">0</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500 text-xs">3 min ago</p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-white text-lg font-semibold mb-4">Search</h3>
                  <input
                    type="text"
                    placeholder="Search wallets, tx hash, addresses..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div>
            <AnomalyDetection />
          </div>
        )}

        {activeTab === 'wallets' && (
          <div>
            <EnhancedWalletAnalysis />
          </div>
        )}

        {activeTab === 'hash' && (
          <div>
            <HashAnalysis />
          </div>
        )}

        {activeTab === 'block' && (
          <div>
            <BlockAnalysis />
          </div>
        )}

        {activeTab === 'ledger' && (
          <div>
            <LedgerAnalysis />
          </div>
        )}

        {activeTab === 'live' && (
          <div>
            <LiveTransactionTracker />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
