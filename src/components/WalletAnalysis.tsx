import React, { useState } from 'react';
import { Search, ExternalLink, Copy, Shield, AlertTriangle, TrendingUp } from 'lucide-react';

const WalletAnalysis: React.FC = () => {
  const [searchWallet, setSearchWallet] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const walletData = [
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      balance: '125.67 BTC',
      totalTransactions: 1249,
      firstSeen: '2024-03-15',
      lastActivity: '2024-09-07',
      riskScore: 85,
      category: 'Suspicious',
      tags: ['High Volume', 'Rapid Movement'],
      recentActivity: [
        { type: 'Received', amount: '12.5 BTC', from: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', time: '14:23' },
        { type: 'Sent', amount: '8.2 BTC', to: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', time: '13:45' },
        { type: 'Received', amount: '25.1 BTC', from: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', time: '12:15' },
      ]
    },
    {
      address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      balance: '45.23 BTC',
      totalTransactions: 856,
      firstSeen: '2024-04-22',
      lastActivity: '2024-09-06',
      riskScore: 42,
      category: 'Normal',
      tags: ['Regular Pattern'],
      recentActivity: [
        { type: 'Sent', amount: '5.0 BTC', to: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', time: '09:12' },
        { type: 'Received', amount: '3.2 BTC', from: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', time: '08:45' },
      ]
    },
    {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      balance: '89.12 BTC',
      totalTransactions: 2156,
      firstSeen: '2024-02-10',
      lastActivity: '2024-09-07',
      riskScore: 92,
      category: 'High Risk',
      tags: ['Mixing Service', 'Privacy Focused'],
      recentActivity: [
        { type: 'Mixed', amount: '15.7 BTC', note: 'Privacy transaction', time: '15:30' },
        { type: 'Received', amount: '22.1 BTC', from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', time: '14:22' },
      ]
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search wallet address..."
            value={searchWallet}
            onChange={(e) => setSearchWallet(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          Analyze Wallet
        </button>
      </div>

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
              <div className="text-2xl font-bold text-red-900">2</div>
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
              <div className="text-2xl font-bold text-green-900">259.02</div>
              <div className="text-sm text-green-700">Total BTC Tracked</div>
            </div>
          </div>
        </div>
      </div>

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
            <tbody className="bg-white divide-y divide-gray-200">
              {walletData.map((wallet) => (
                <tr key={wallet.address} className="hover:bg-dark-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-mono text-gray-900">
                        {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 8)}
                      </div>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wallet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {wallet.balance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      <button className="text-gray-400 hover:text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                  <h4 className="text-md font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    {wallet.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {activity.type} {activity.amount}
                          </div>
                          <div className="text-xs text-dark-500">
                            {activity.type === 'Mixed' ? (activity as any).note : 
                             activity.type === 'Received' ? `From: ${(activity as any).from?.substring(0, 10)}...` :
                             `To: ${(activity as any).to?.substring(0, 10)}...`}
                          </div>
                        </div>
                        <div className="text-sm text-dark-500">{activity.time}</div>
                      </div>
                    ))}
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
