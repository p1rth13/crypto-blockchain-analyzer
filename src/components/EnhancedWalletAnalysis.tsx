import React, { useState } from 'react';
import { 
  Search, Copy, Shield, AlertTriangle, 
  Loader, CheckCircle, XCircle, Activity, Database,
  Globe, Network, BarChart3
} from 'lucide-react';
import { cryptoApiService } from '../utils/CryptoApiService';
import type { AggregatedWalletData } from '../utils/CryptoApiService';

const EnhancedWalletAnalysis: React.FC = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AggregatedWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const analyzeWallet = async () => {
    if (!searchAddress.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await cryptoApiService.analyzeWallet(searchAddress.trim());
      setCurrentAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setCurrentAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatBTC = (value: number) => {
    return `${value.toFixed(8)} BTC`;
  };

  const formatUSD = (btcValue: number, btcPrice: number = 50000) => {
    return `$${(btcValue * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-danger-100 text-danger-700 border-danger-200';
    if (score >= 40) return 'bg-warning-100 text-warning-700 border-warning-200';
    return 'bg-success-100 text-success-700 border-success-200';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 70) return AlertTriangle;
    if (score >= 40) return Shield;
    return CheckCircle;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'apis', label: 'API Status', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeWallet()}
              placeholder="Enter Bitcoin address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
              className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={analyzeWallet}
            disabled={isLoading || !searchAddress.trim()}
            className="px-6 py-3 bg-gradient-to-r from-electric-500 to-electric-600 hover:from-electric-600 hover:to-electric-700 disabled:from-dark-600 disabled:to-dark-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-card p-4 border-l-4 border-danger-500">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-danger-500" />
            <div>
              <p className="text-danger-700 font-medium">Analysis Error</p>
              <p className="text-danger-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Balance Card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-bitcoin-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-bitcoin-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">Balance</h3>
                    <p className="text-sm text-dark-400">Current Holdings</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-bitcoin-400">{formatBTC(currentAnalysis.balance)}</div>
                <div className="text-sm text-dark-400">{formatUSD(currentAnalysis.balance)}</div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">Transactions</h3>
                    <p className="text-sm text-dark-400">Total Count</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success-400">{currentAnalysis.transactionCount.toLocaleString()}</div>
                <div className="text-sm text-dark-400">{currentAnalysis.transactions.length} recent</div>
              </div>
            </div>

            {/* Risk Score Card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRiskColor(currentAnalysis.riskScore)}`}>
                    {React.createElement(getRiskIcon(currentAnalysis.riskScore), { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">Risk Score</h3>
                    <p className="text-sm text-dark-400">Security Assessment</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-dark-100">{currentAnalysis.riskScore}%</div>
                <div className="text-sm text-dark-400">{currentAnalysis.riskFactors.length} risk factors</div>
              </div>
            </div>

            {/* Data Sources Card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-electric-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-electric-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">Data Sources</h3>
                    <p className="text-sm text-dark-400">API Coverage</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-electric-400">{currentAnalysis.apiSources.length}</div>
                <div className="text-sm text-dark-400">{currentAnalysis.confidence}% confidence</div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-100">Address Information</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(currentAnalysis.riskScore)}`}>
                {currentAnalysis.dataQuality.toUpperCase()} QUALITY
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-800/30 rounded-lg">
                <div>
                  <p className="text-sm text-dark-400 mb-1">Bitcoin Address</p>
                  <p className="font-mono text-dark-100 break-all">{currentAnalysis.address}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(currentAnalysis.address)}
                  className="p-2 text-dark-400 hover:text-electric-400 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass-card">
            <div className="border-b border-dark-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-electric-500 text-electric-400'
                          : 'border-transparent text-dark-400 hover:text-dark-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-dark-100">Balance Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Total Received:</span>
                          <span className="font-semibold text-success-400">{formatBTC(currentAnalysis.totalReceived)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Total Sent:</span>
                          <span className="font-semibold text-danger-400">{formatBTC(currentAnalysis.totalSent)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">First Seen:</span>
                          <span className="font-semibold">{currentAnalysis.firstSeen ? new Date(currentAnalysis.firstSeen).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Last Activity:</span>
                          <span className="font-semibold">{currentAnalysis.lastSeen ? new Date(currentAnalysis.lastSeen).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-dark-100">Risk Factors</h4>
                      <div className="space-y-2">
                        {currentAnalysis.riskFactors.map((factor, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-dark-800/30 rounded">
                            <AlertTriangle className="w-4 h-4 text-warning-400" />
                            <span className="text-sm text-dark-300">{factor}</span>
                          </div>
                        ))}
                        {currentAnalysis.riskFactors.length === 0 && (
                          <div className="flex items-center space-x-2 p-2 bg-dark-800/30 rounded">
                            <CheckCircle className="w-4 h-4 text-success-400" />
                            <span className="text-sm text-success-300">No risk factors detected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-dark-100">Recent Transactions ({currentAnalysis.transactions.length})</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {currentAnalysis.transactions.map((tx) => (
                      <div key={tx.hash} className="p-4 bg-dark-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono text-dark-300">{tx.hash.substring(0, 16)}...</span>
                            <button
                              onClick={() => copyToClipboard(tx.hash)}
                              className="text-dark-400 hover:text-electric-400"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm text-dark-400">
                            {new Date(tx.time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-dark-400">Value:</span>
                          <span className="font-semibold">{formatBTC(tx.value / 100000000)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-dark-400">Confirmations:</span>
                          <span className="text-sm">{tx.confirmations}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-dark-100">Network Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-dark-200 mb-3">Cluster Information</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-dark-400">Cluster Size:</span>
                          <span className="font-semibold">{currentAnalysis.networkAnalysis.clusterSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark-400">Associated Addresses:</span>
                          <span className="font-semibold">{currentAnalysis.networkAnalysis.associatedAddresses.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-dark-200 mb-3">Pattern Detection</h5>
                      <div className="space-y-2">
                        {currentAnalysis.networkAnalysis.patterns.map((pattern, index) => (
                          <div key={index} className="p-2 bg-dark-800/30 rounded">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{pattern.type}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                pattern.severity === 'high' ? 'bg-danger-100 text-danger-700' :
                                pattern.severity === 'medium' ? 'bg-warning-100 text-warning-700' :
                                'bg-success-100 text-success-700'
                              }`}>
                                {pattern.severity}
                              </span>
                            </div>
                            <p className="text-xs text-dark-400 mt-1">{pattern.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'apis' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-dark-100">API Status & Sources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cryptoApiService.getApiStatus().map((api, index) => (
                      <div key={index} className="p-4 bg-dark-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-dark-200">{api.name}</span>
                          <div className="flex items-center space-x-2">
                            {api.status === 'healthy' ? (
                              <CheckCircle className="w-4 h-4 text-success-400" />
                            ) : api.status === 'limited' ? (
                              <AlertTriangle className="w-4 h-4 text-warning-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-danger-400" />
                            )}
                            <span className={`text-sm ${
                              api.status === 'healthy' ? 'text-success-400' :
                              api.status === 'limited' ? 'text-warning-400' :
                              'text-danger-400'
                            }`}>
                              {api.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-dark-400">
                          Remaining requests: {api.remaining}
                        </div>
                        <div className="text-xs text-dark-500 mt-1">
                          Used in analysis: {currentAnalysis.apiSources.includes(api.name.toLowerCase().replace('.', '').replace(' ', '-')) ? 'Yes' : 'No'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWalletAnalysis;
