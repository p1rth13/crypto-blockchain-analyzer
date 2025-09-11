import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Bitcoin, 
  Activity,
  Search,
  Zap,
  TrendingUp,
  Eye,
  Settings,
  Bell
} from 'lucide-react';
import TransactionChart from './TransactionChart';
import AnomalyDetection from './AnomalyDetection';
import WalletAnalysis from './WalletAnalysis';
import StatCard from './StatCard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400 animate-pulse">Initializing Crypto Analysis Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-bitcoin-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-success-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>

      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-electric-500 to-bitcoin-500 rounded-xl shadow-glow animate-pulse-glow">
                  <Bitcoin className="w-7 h-7 text-white animate-spin-slow" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-electric-500 to-bitcoin-500 rounded-xl blur opacity-20 animate-pulse"></div>
              </div>
              <div className="animate-slide-in-right">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-400 to-bitcoin-400 bg-clip-text text-transparent">
                  CryptoAnalysis
                </h1>
                <p className="text-sm text-dark-400 font-mono">Bitcoin Blockchain Intelligence Platform</p>
              </div>
            </div>
            
            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400 group-hover:text-electric-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search transactions, wallets, addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 glass-card text-dark-100 placeholder-dark-500 focus:ring-2 focus:ring-electric-500 focus:border-transparent transition-all duration-300 focus:shadow-glow text-sm"
                />
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
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-electric-400 to-success-400 bg-clip-text text-transparent">
                    Wallet Intelligence Analysis
                  </h2>
                  <p className="text-dark-400 mt-2">Deep dive into Bitcoin wallet behaviors and patterns</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-success-400" />
                    <span className="text-success-400 font-medium">Tracking {stats.activeWallets} wallets</span>
                  </div>
                </div>
              </div>
              <WalletAnalysis />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
