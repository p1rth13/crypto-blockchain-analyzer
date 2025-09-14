import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Clock,
  RefreshCw,
  Eye
} from 'lucide-react';

interface VolumeData {
  time: string;
  volume: number;
  transactions: number;
  avgValue: number;
  anomalies: number;
  timestamp: number;
  hour?: number;
  isAnomaly?: boolean;
  riskScore?: number;
}

interface TrendMetrics {
  totalVolume: string;
  avgTransactionSize: string;
  peakHour: string;
  anomalyRate: string;
  volumeChange: number;
  transactionChange: number;
}

const TransactionVolumeTrends: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<'24H' | '7D' | '30D'>('24H');
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [metrics, setMetrics] = useState<TrendMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate realistic mock data based on timeframe
  const generateVolumeData = (timeframe: string): VolumeData[] => {
    const baseVolume = 2500000;
    const baseTransactions = 1200;
    let dataPoints: VolumeData[] = [];
    
    if (timeframe === '24H') {
      // Generate hourly data for 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(Date.now() - i * 60 * 60 * 1000);
        const hourNum = hour.getHours();
        
        // Simulate higher activity during certain hours
        const hourMultiplier = getHourMultiplier(hourNum);
        const randomVariation = 0.7 + Math.random() * 0.6;
        
        const volume = Math.floor(baseVolume * hourMultiplier * randomVariation);
        const transactions = Math.floor(baseTransactions * hourMultiplier * randomVariation);
        const anomalies = Math.floor(Math.random() * 8) + (hourNum === 2 || hourNum === 14 ? 5 : 0);
        
        dataPoints.push({
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          volume,
          transactions,
          avgValue: Math.floor(volume / transactions),
          anomalies,
          timestamp: hour.getTime(),
          hour: hourNum,
          isAnomaly: anomalies > 10,
          riskScore: Math.min(100, anomalies * 8 + Math.random() * 20)
        });
      }
    } else if (timeframe === '7D') {
      // Generate daily data for 7 days
      for (let i = 6; i >= 0; i--) {
        const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayMultiplier = getDayMultiplier(day.getDay());
        const randomVariation = 0.8 + Math.random() * 0.4;
        
        const volume = Math.floor(baseVolume * 24 * dayMultiplier * randomVariation);
        const transactions = Math.floor(baseTransactions * 24 * dayMultiplier * randomVariation);
        const anomalies = Math.floor(Math.random() * 50) + 10;
        
        dataPoints.push({
          time: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          volume,
          transactions,
          avgValue: Math.floor(volume / transactions),
          anomalies,
          timestamp: day.getTime(),
          isAnomaly: anomalies > 40,
          riskScore: Math.min(100, anomalies * 2 + Math.random() * 20)
        });
      }
    } else { // 30D
      // Generate daily data for 30 days
      for (let i = 29; i >= 0; i--) {
        const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayMultiplier = getDayMultiplier(day.getDay());
        const randomVariation = 0.6 + Math.random() * 0.8;
        
        const volume = Math.floor(baseVolume * 24 * dayMultiplier * randomVariation);
        const transactions = Math.floor(baseTransactions * 24 * dayMultiplier * randomVariation);
        const anomalies = Math.floor(Math.random() * 80) + 20;
        
        dataPoints.push({
          time: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          volume,
          transactions,
          avgValue: Math.floor(volume / transactions),
          anomalies,
          timestamp: day.getTime(),
          isAnomaly: anomalies > 70,
          riskScore: Math.min(100, anomalies * 1.5 + Math.random() * 25)
        });
      }
    }
    
    return dataPoints;
  };

  const getHourMultiplier = (hour: number): number => {
    // Simulate higher activity during business hours and late night
    if (hour >= 9 && hour <= 17) return 1.3; // Business hours
    if (hour >= 20 || hour <= 2) return 1.1; // Late night activity
    return 0.7; // Low activity hours
  };

  const getDayMultiplier = (dayOfWeek: number): number => {
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) return 0.8; // Weekend
    return 1.0; // Weekday
  };

  const calculateMetrics = (data: VolumeData[]): TrendMetrics => {
    const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
    const totalTransactions = data.reduce((sum, item) => sum + item.transactions, 0);
    const totalAnomalies = data.reduce((sum, item) => sum + item.anomalies, 0);
    
    // Find peak hour/day
    const peakData = data.reduce((max, item) => 
      item.volume > max.volume ? item : max, data[0]);
    
    // Calculate changes (comparing first half to second half)
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const firstHalfAvgVolume = firstHalf.reduce((sum, item) => sum + item.volume, 0) / firstHalf.length;
    const secondHalfAvgVolume = secondHalf.reduce((sum, item) => sum + item.volume, 0) / secondHalf.length;
    const volumeChange = ((secondHalfAvgVolume - firstHalfAvgVolume) / firstHalfAvgVolume) * 100;
    
    const firstHalfAvgTx = firstHalf.reduce((sum, item) => sum + item.transactions, 0) / firstHalf.length;
    const secondHalfAvgTx = secondHalf.reduce((sum, item) => sum + item.transactions, 0) / secondHalf.length;
    const transactionChange = ((secondHalfAvgTx - firstHalfAvgTx) / firstHalfAvgTx) * 100;

    return {
      totalVolume: formatVolume(totalVolume),
      avgTransactionSize: formatCurrency(totalVolume / totalTransactions),
      peakHour: peakData.time,
      anomalyRate: `${((totalAnomalies / totalTransactions) * 100).toFixed(2)}%`,
      volumeChange: Math.round(volumeChange * 100) / 100,
      transactionChange: Math.round(transactionChange * 100) / 100
    };
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const loadData = async (timeframe: string) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const data = generateVolumeData(timeframe);
    setVolumeData(data);
    setMetrics(calculateMetrics(data));
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    loadData(activeTimeframe);
  }, [activeTimeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-semibold mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Volume:</span>
              <span className="text-cyan-400 font-bold">{formatCurrency(data.volume)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Transactions:</span>
              <span className="text-blue-400 font-bold">{data.transactions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Avg Size:</span>
              <span className="text-green-400 font-bold">{formatCurrency(data.avgValue)}</span>
            </div>
            {data.anomalies > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Anomalies:</span>
                <span className="text-orange-400 font-bold">{data.anomalies}</span>
              </div>
            )}
            {data.isAnomaly && (
              <div className="mt-2 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-md">
                <span className="text-red-400 text-xs font-medium">⚠️ Anomaly Detected</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-xl font-bold mb-2">Transaction Volume Trends</h3>
            <p className="text-gray-400 text-sm">
              24-hour analysis with anomaly detection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(activeTimeframe)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-2">
          {(['24H', '7D', '30D'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTimeframe === timeframe
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="p-6 border-b border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400 text-sm">Total Volume</span>
              </div>
              <div className="text-white text-lg font-bold">{metrics.totalVolume}</div>
              <div className={`text-xs flex items-center gap-1 ${metrics.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.volumeChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metrics.volumeChange).toFixed(1)}%
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Avg Tx Size</span>
              </div>
              <div className="text-white text-lg font-bold">{metrics.avgTransactionSize}</div>
              <div className={`text-xs flex items-center gap-1 ${metrics.transactionChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.transactionChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metrics.transactionChange).toFixed(1)}%
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Peak Time</span>
              </div>
              <div className="text-white text-lg font-bold">{metrics.peakHour}</div>
              <div className="text-xs text-gray-500">Highest activity</div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400 text-sm">Anomaly Rate</span>
              </div>
              <div className="text-white text-lg font-bold">{metrics.anomalyRate}</div>
              <div className="text-xs text-gray-500">Detection rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading transaction data...</span>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="2 8" 
                  stroke="#334155" 
                  strokeWidth={1}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#94a3b8',
                    fontWeight: 500 
                  }}
                  dy={10}
                />
                
                <YAxis 
                  yAxisId="volume"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#94a3b8',
                    fontWeight: 500 
                  }}
                  tickFormatter={(value) => formatVolume(value)}
                  dx={-10}
                />
                
                <YAxis 
                  yAxisId="transactions"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: '#94a3b8',
                    fontWeight: 500 
                  }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  dx={10}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#volumeGradient)"
                  name="Volume"
                />
                
                <Area
                  yAxisId="transactions"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#transactionGradient)"
                  name="Transactions"
                  fillOpacity={0.6}
                />

                {/* Anomaly indicators */}
                {volumeData.map((item, index) => 
                  item.isAnomaly ? (
                    <ReferenceLine
                      key={index}
                      x={item.time}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                  ) : null
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span>Transaction Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Transaction Count</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>Anomaly Alert</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionVolumeTrends;
