import React, { useState } from 'react';
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Bitcoin, 
  Activity,
  Search,
  Filter
} from 'lucide-react';
import TransactionChart from './TransactionChart';
import AnomalyDetection from './AnomalyDetection';
import WalletAnalysis from './WalletAnalysis';
import StatCard from './StatCard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const stats = {
    totalTransactions: 156420,
    suspiciousTransactions: 1247,
    activeWallets: 8930,
    anomaliesDetected: 23
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'anomalies', label: 'Anomaly Detection', icon: Shield },
    { id: 'wallets', label: 'Wallet Analysis', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CryptoAnalysis</h1>
                <p className="text-sm text-gray-500">Bitcoin Blockchain Analysis Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions, wallets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Transactions"
                value={stats.totalTransactions.toLocaleString()}
                icon={Activity}
                color="blue"
                change={"+12.5%"}
              />
              <StatCard
                title="Suspicious Transactions"
                value={stats.suspiciousTransactions.toLocaleString()}
                icon={AlertTriangle}
                color="red"
                change={"+2.3%"}
              />
              <StatCard
                title="Active Wallets"
                value={stats.activeWallets.toLocaleString()}
                icon={Bitcoin}
                color="green"
                change={"+5.7%"}
              />
              <StatCard
                title="Anomalies Detected"
                value={stats.anomaliesDetected.toLocaleString()}
                icon={Shield}
                color="purple"
                change={"-8.1%"}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume (Last 6 Months)</h3>
                <TransactionChart />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomaly Detection Overview</h3>
                <AnomalyDetection />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Anomaly Detection Engine</h2>
            <AnomalyDetection detailed />
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet Analysis</h2>
            <WalletAnalysis />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
