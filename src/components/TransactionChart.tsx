import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TransactionChart: React.FC = () => {
  // Enhanced mock data for the last 6 months with more realistic patterns
  const data = [
    { month: 'Mar', transactions: 485000, suspicious: 1320, btcPrice: 45000 },
    { month: 'Apr', transactions: 520000, suspicious: 980, btcPrice: 52000 },
    { month: 'May', transactions: 448000, suspicious: 1450, btcPrice: 48000 },
    { month: 'Jun', transactions: 610000, suspicious: 1180, btcPrice: 61000 },
    { month: 'Jul', transactions: 575000, suspicious: 1520, btcPrice: 55000 },
    { month: 'Aug', transactions: 678000, suspicious: 1410, btcPrice: 67000 },
    { month: 'Sep', transactions: 742000, suspicious: 1600, btcPrice: 72000 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-semibold mb-3">{`${label} 2024`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300 text-sm font-medium">{entry.name}</span>
              </div>
              <span 
                className="font-bold text-sm"
                style={{ color: entry.color }}
              >
                {entry.name === 'BTC Price' ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Transaction Volume Analysis</h3>
        <p className="text-gray-400 text-sm">Last 6 months blockchain activity</p>
      </div>
      
      <div className="w-full h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorBtcPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="2 8" 
              stroke="#334155" 
              strokeWidth={1}
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
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
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 12, 
                fill: '#94a3b8',
                fontWeight: 500 
              }}
              tickFormatter={(value) => `${(value / 1000)}K`}
              dx={-10}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line for average */}
            <ReferenceLine 
              y={580000} 
              stroke="#64748b" 
              strokeDasharray="4 6" 
              strokeOpacity={0.6}
              strokeWidth={1.5}
              label={{ 
                value: "Average", 
                fill: "#64748b",
                fontSize: 12,
                fontWeight: 500,
                position: "right"
              }}
            />
            
            {/* BTC Price (scaled down for visibility) */}
            <Area
              type="monotone"
              dataKey="btcPrice"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBtcPrice)"
              name="BTC Price"
              dot={{ 
                fill: "#10b981", 
                strokeWidth: 2, 
                stroke: "#0f172a",
                r: 3 
              }}
              activeDot={{ 
                r: 6, 
                fill: "#10b981",
                stroke: "#0f172a",
                strokeWidth: 3
              }}
            />
            
            {/* Total Transactions */}
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTransactions)"
              name="Total Transactions"
              dot={{ 
                fill: "#06b6d4", 
                strokeWidth: 2, 
                stroke: "#0f172a",
                r: 3 
              }}
              activeDot={{ 
                r: 6, 
                fill: "#06b6d4",
                stroke: "#0f172a",
                strokeWidth: 3
              }}
            />
            
            {/* Suspicious Transactions */}
            <Area
              type="monotone"
              dataKey="suspicious"
              stroke="#f59e0b"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSuspicious)"
              name="Suspicious Transactions"
              dot={{ 
                fill: "#f59e0b", 
                strokeWidth: 2, 
                stroke: "#0f172a",
                r: 3 
              }}
              activeDot={{ 
                r: 6, 
                fill: "#f59e0b",
                stroke: "#0f172a",
                strokeWidth: 3
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Modern Legend */}
        <div className="flex items-center justify-center space-x-8 mt-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-sm text-gray-300 font-medium">Total Transactions</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-300 font-medium">Suspicious</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-gray-300 font-medium">BTC Price</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
