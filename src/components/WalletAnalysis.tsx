import React, { useState } from 'react';
import { Search, ExternalLink, Copy, Shield, AlertTriangle, TrendingUp, Loader } from 'lucide-react';

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
    note?: string;
  }>;
}

const WalletAnalysis: React.FC = () => {
  const [searchWallet, setSearchWallet] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API call to analyze Bitcoin wallet
  const analyzeWallet = async () => {
    if (!searchWallet.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call Blockchain.info API directly
      const response = await fetch(
        `https://blockchain.info/rawaddr/${searchWallet.trim()}?format=json&limit=10`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Invalid Bitcoin address or API error');
      }
      
      const data = await response.json();
      
      // Process the API response
      const newWallet: WalletData = {
        address: data.address,
        balance: `${(data.final_balance / 100000000).toFixed(8)} BTC`,
        totalTransactions: data.n_tx,
        firstSeen: data.txs && data.txs.length > 0 
          ? new Date(data.txs[data.txs.length - 1].time * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        lastActivity: data.txs && data.txs.length > 0 
          ? new Date(data.txs[0].time * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        riskScore: calculateRiskScore(data),
        category: getRiskCategory(calculateRiskScore(data)),
        tags: generateTags(data),
        recentActivity: data.txs ? data.txs.slice(0, 10).map((tx: any) => ({
          type: getTransactionType(tx, data.address),
          amount: `${(getTransactionAmount(tx, data.address) / 100000000).toFixed(8)} BTC`,
          from: tx.inputs && tx.inputs[0] && tx.inputs[0].prev_out 
            ? tx.inputs[0].prev_out.addr || 'Unknown' 
            : 'Unknown',
          to: tx.out && tx.out[0] ? tx.out[0].addr || 'Unknown' : 'Unknown',
          time: new Date(tx.time * 1000).toLocaleString(),
          hash: tx.hash
        })) : []
      };
      
      // Add to wallet data
      setWalletData(prev => {
        const exists = prev.find(w => w.address === newWallet.address);
        if (exists) {
          return prev.map(w => w.address === newWallet.address ? newWallet : w);
        }
        return [newWallet, ...prev];
      });
      
      setSearchWallet('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze wallet');
      console.error('Wallet analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate risk score based on transaction patterns
  const calculateRiskScore = (data: any): number => {
    let score = 0;
    
    // High transaction volume
    if (data.n_tx > 1000) score += 30;
    else if (data.n_tx > 100) score += 15;
    
    // Large balance
    const btcBalance = data.final_balance / 100000000;
    if (btcBalance > 100) score += 25;
    else if (btcBalance > 10) score += 10;
    
    // Transaction frequency analysis
    if (data.txs && data.txs.length > 1) {
      const recentTxs = data.txs.slice(0, 10);
      const times = recentTxs.map((tx: any) => tx.time).sort((a: number, b: number) => b - a);
      
      // Check for rapid transactions (less than 1 hour between transactions)
      for (let i = 1; i < times.length; i++) {
        if (times[i - 1] - times[i] < 3600) {
          score += 5;
        }
      }
      
      // Large transaction amounts
      const largeTransactions = recentTxs.filter((tx: any) => 
        tx.out && tx.out.some((output: any) => output.value > 10 * 100000000) // > 10 BTC
      );
      if (largeTransactions.length > 2) score += 15;
    }
    
    return Math.min(score, 100);
  };

  const getRiskCategory = (score: number): string => {
    if (score >= 80) return 'High Risk';
    if (score >= 60) return 'Suspicious';
    if (score >= 40) return 'Medium';
    return 'Normal';
  };

  const generateTags = (data: any): string[] => {
    const tags: string[] = [];
    
    if (data.n_tx > 1000) tags.push('High Volume');
    const btcBalance = data.final_balance / 100000000;
    if (btcBalance > 50) tags.push('Large Balance');
    
    const totalReceived = data.total_received / 100000000;
    const totalSent = data.total_sent / 100000000;
    if (totalSent > 0 && totalReceived > 0) {
      const ratio = totalSent / totalReceived;
      if (ratio > 0.9) tags.push('Rapid Movement');
    }
    
    if (btcBalance === 0 && data.n_tx > 0) tags.push('Empty Wallet');
    
    return tags;
  };

  const getTransactionType = (tx: any, address: string): string => {
    const isReceived = tx.out && tx.out.some((output: any) => output.addr === address);
    const isSent = tx.inputs && tx.inputs.some((input: any) => 
      input.prev_out && input.prev_out.addr === address
    );
    
    if (isReceived && !isSent) return 'Received';
    if (isSent && !isReceived) return 'Sent';
    return 'Internal';
  };

  const getTransactionAmount = (tx: any, address: string): number => {
    let amount = 0;
    
    // Check outputs for received amount
    if (tx.out) {
      tx.out.forEach((output: any) => {
        if (output.addr === address) {
          amount += output.value;
        }
      });
    }
    
    // If no received amount, calculate sent amount
    if (amount === 0 && tx.inputs) {
      tx.inputs.forEach((input: any) => {
        if (input.prev_out && input.prev_out.addr === address) {
          amount += input.prev_out.value;
        }
      });
    }
    
    return amount;
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'High Risk': return 'bg-red-100 text-red-800';
      case 'Suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-dark-100 text-dark-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate summary stats
  const totalBTC = walletData.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance.replace(' BTC', ''));
  }, 0);

  const highRiskCount = walletData.filter(w => 
    w.category === 'High Risk' || w.category === 'Suspicious'
  ).length;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Enter Bitcoin address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
            value={searchWallet}
            onChange={(e) => setSearchWallet(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && analyzeWallet()}
            className="w-full pl-10 pr-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-dark-900 placeholder-dark-500"
            disabled={loading}
          />
        </div>
        <button 
          onClick={analyzeWallet}
          disabled={loading || !searchWallet.trim()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          <span>{loading ? 'Analyzing...' : 'Analyze Wallet'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{walletData.length}</div>
              <div className="text-sm text-blue-700">Wallets Analyzed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">{highRiskCount}</div>
              <div className="text-sm text-red-700">High Risk Wallets</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{totalBTC.toFixed(2)}</div>
              <div className="text-sm text-green-700">Total BTC Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Overview */}
      {walletData.length > 0 && (
        <div className="bg-white border border-dark-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-200">
            <h3 className="text-lg font-medium text-dark-900">Last 10 Recent Transactions</h3>
            <p className="text-sm text-dark-500 mt-1">Latest transaction activity across all monitored wallets</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-200">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Transaction Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    From/To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    Wallet
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-dark-200">
                {walletData
                  .flatMap(wallet => 
                    wallet.recentActivity.map(activity => ({
                      ...activity,
                      walletAddress: wallet.address
                    }))
                  )
                  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                  .slice(0, 10)
                  .map((transaction, index) => (
                    <tr key={`${transaction.hash}-${index}`} className="hover:bg-dark-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-mono text-dark-900">
                            {transaction.hash ? 
                              `${transaction.hash.substring(0, 8)}...${transaction.hash.substring(transaction.hash.length - 8)}` 
                              : 'N/A'
                            }
                          </div>
                          {transaction.hash && (
                            <button
                              onClick={() => copyToClipboard(transaction.hash || '')}
                              className="text-dark-400 hover:text-dark-600"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'Received' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'Sent' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-900">
                          {transaction.type === 'Received' ? (
                            <div>
                              <div className="text-xs text-dark-500">From:</div>
                              <div className="font-mono">
                                {transaction.from && transaction.from !== 'Unknown' ? 
                                  `${transaction.from.substring(0, 6)}...${transaction.from.substring(transaction.from.length - 6)}` 
                                  : 'Unknown'
                                }
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-xs text-dark-500">To:</div>
                              <div className="font-mono">
                                {transaction.to && transaction.to !== 'Unknown' ? 
                                  `${transaction.to.substring(0, 6)}...${transaction.to.substring(transaction.to.length - 6)}` 
                                  : 'Unknown'
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
                        {transaction.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-dark-900">
                          {`${transaction.walletAddress.substring(0, 6)}...${transaction.walletAddress.substring(transaction.walletAddress.length - 6)}`}
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {walletData.every(wallet => wallet.recentActivity.length === 0) && (
              <div className="px-6 py-12 text-center">
                <div className="text-dark-500">
                  No recent transactions found in monitored wallets.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallets Table */}
      <div className="bg-white border border-dark-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-200">
          <h3 className="text-lg font-medium text-dark-900">Monitored Wallets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-200">
            <thead className="bg-dark-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-dark-200">
              {walletData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-dark-500">
                      No wallets analyzed yet. Enter a Bitcoin address above to get started.
                    </div>
                  </td>
                </tr>
              ) : (
                walletData.map((wallet) => (
                <tr key={wallet.address} className="hover:bg-dark-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-mono text-dark-900">
                        {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 8)}
                      </div>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="text-dark-400 hover:text-dark-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wallet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-dark-100 text-dark-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900 font-medium">
                    {wallet.balance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
                    {wallet.totalTransactions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getRiskColor(wallet.riskScore)}`}>
                      {wallet.riskScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(wallet.category)}`}>
                      {wallet.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
                    {wallet.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedWallet(wallet.address)}
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        Analyze
                      </button>
                      <button 
                        onClick={() => window.open(`https://blockchain.info/address/${wallet.address}`, '_blank')}
                        className="text-dark-400 hover:text-dark-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Wallet View */}
      {selectedWallet && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Wallet Details</h3>
            <button
              onClick={() => setSelectedWallet(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {walletData
            .filter(w => w.address === selectedWallet)
            .map(wallet => (
              <div key={wallet.address} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-dark-500">Address</div>
                    <div className="text-sm font-mono text-gray-900">{wallet.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-500">Balance</div>
                    <div className="text-lg font-semibold text-gray-900">{wallet.balance}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-500">First Seen</div>
                    <div className="text-sm text-gray-900">{wallet.firstSeen}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Recent Activity (Last 10 Transactions)</h4>
                  <div className="space-y-2">
                    {wallet.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                                activity.type === 'Received' ? 'bg-green-100 text-green-800' :
                                activity.type === 'Sent' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {activity.type}
                              </span>
                              {activity.amount}
                            </div>
                            <div className="text-sm text-dark-500">{activity.time}</div>
                          </div>
                          <div className="text-xs text-dark-500 mt-1">
                            {activity.type === 'Received' ? (
                              <>From: {activity.from?.substring(0, 16)}...{activity.from?.substring(activity.from.length - 6)}</>
                            ) : (
                              <>To: {activity.to?.substring(0, 16)}...{activity.to?.substring(activity.to.length - 6)}</>
                            )}
                          </div>
                          {activity.hash && (
                            <div className="text-xs text-dark-400 mt-1 font-mono">
                              Hash: {activity.hash.substring(0, 16)}...
                              <button
                                onClick={() => copyToClipboard(activity.hash || '')}
                                className="ml-2 text-dark-400 hover:text-dark-600"
                              >
                                <Copy className="w-3 h-3 inline" />
                              </button>
                              <button
                                onClick={() => window.open(`https://blockchain.info/tx/${activity.hash}`, '_blank')}
                                className="ml-1 text-dark-400 hover:text-dark-600"
                              >
                                <ExternalLink className="w-3 h-3 inline" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {wallet.recentActivity.length === 0 && (
                      <div className="text-center py-4 text-dark-500">
                        No recent transactions found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WalletAnalysis;
