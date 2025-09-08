import React from 'react';
import { AlertTriangle, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface AnomalyDetectionProps {
  detailed?: boolean;
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ detailed = false }) => {
  const anomalies = [
    {
      id: 1,
      type: 'Volume Spike',
      description: 'Sudden increase in transaction volume',
      severity: 'high',
      wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: '125.67 BTC',
      timestamp: '2024-09-07 14:23:15',
      risk: 85,
    },
    {
      id: 2,
      type: 'Rapid Movement',
      description: 'Multiple rapid transactions detected',
      severity: 'medium',
      wallet: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      amount: '45.23 BTC',
      timestamp: '2024-09-07 13:45:32',
      risk: 65,
    },
    {
      id: 3,
      type: 'Mixing Pattern',
      description: 'Potential coin mixing activity',
      severity: 'high',
      wallet: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      amount: '89.12 BTC',
      timestamp: '2024-09-07 12:15:47',
      risk: 92,
    },
    {
      id: 4,
      type: 'Dust Attacks',
      description: 'Multiple small value transactions',
      severity: 'low',
      wallet: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      amount: '0.0045 BTC',
      timestamp: '2024-09-07 11:30:21',
      risk: 35,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600';
    if (risk >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!detailed) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">23</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">45</div>
            <div className="text-sm text-gray-600">Medium Risk</div>
          </div>
        </div>
        
        <div className="space-y-3">
          {anomalies.slice(0, 3).map((anomaly) => (
            <div key={anomaly.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getSeverityColor(anomaly.severity)}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{anomaly.type}</div>
                <div className="text-xs text-gray-500">{anomaly.description}</div>
              </div>
              <div className={`text-sm font-medium ${getRiskColor(anomaly.risk)}`}>
                {anomaly.risk}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">23</div>
              <div className="text-sm text-red-700">High Risk Anomalies</div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">45</div>
              <div className="text-sm text-yellow-700">Medium Risk</div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">1,247</div>
              <div className="text-sm text-blue-700">Total Flagged</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">2.3s</div>
              <div className="text-sm text-green-700">Avg Detection Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Anomalies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {anomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{anomaly.type}</div>
                      <div className="text-sm text-gray-500">{anomaly.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">
                      {anomaly.wallet.substring(0, 10)}...{anomaly.wallet.substring(anomaly.wallet.length - 6)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {anomaly.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getRiskColor(anomaly.risk)}`}>
                      {anomaly.risk}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {anomaly.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetection;
