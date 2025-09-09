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
        <div className="glass-card p-4 border border-white/20 shadow-glow min-w-[200px]">
          <p className="text-gray-200 font-semibold mb-2">{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <span className="text-gray-300 text-sm">{entry.name}:</span>
              <span 
                className="font-bold text-sm ml-2"
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
    <div className="w-full h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4757" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ff4757" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorBtcPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f7931a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f7931a" stopOpacity={0.02} />
            </linearGradient>
            
            {/* Glow filters */}
            <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(100, 116, 139, 0.2)" 
            strokeWidth={0.5}
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
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference line for average */}
          <ReferenceLine 
            y={580000} 
            stroke="#64748b" 
            strokeDasharray="5 5" 
            strokeOpacity={0.5}
            label={{ 
              value: "Avg Volume", 
              fill: "#64748b",
              fontSize: 11
            }}
          />
          
          {/* BTC Price (scaled down for visibility) */}
          <Area
            type="monotone"
            dataKey="btcPrice"
            stroke="#f7931a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBtcPrice)"
            name="BTC Price"
            filter="url(#glow-orange)"
            dot={{ 
              fill: "#f7931a", 
              strokeWidth: 2, 
              stroke: "#ffffff20",
              r: 4 
            }}
            activeDot={{ 
              r: 6, 
              fill: "#f7931a",
              stroke: "#ffffff",
              strokeWidth: 2,
              filter: "url(#glow-orange)"
            }}
          />
          
          {/* Total Transactions */}
          <Area
            type="monotone"
            dataKey="transactions"
            stroke="#00d4ff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTransactions)"
            name="Total Transactions"
            filter="url(#glow-blue)"
            dot={{ 
              fill: "#00d4ff", 
              strokeWidth: 2, 
              stroke: "#ffffff20",
              r: 5 
            }}
            activeDot={{ 
              r: 8, 
              fill: "#00d4ff",
              stroke: "#ffffff",
              strokeWidth: 2,
              filter: "url(#glow-blue)"
            }}
          />
          
          {/* Suspicious Transactions */}
          <Area
            type="monotone"
            dataKey="suspicious"
            stroke="#ff4757"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSuspicious)"
            name="Suspicious Transactions"
            filter="url(#glow-red)"
            dot={{ 
              fill: "#ff4757", 
              strokeWidth: 2, 
              stroke: "#ffffff20",
              r: 4 
            }}
            activeDot={{ 
              r: 7, 
              fill: "#ff4757",
              stroke: "#ffffff",
              strokeWidth: 2,
              filter: "url(#glow-red)"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-electric-500 shadow-glow"></div>
          <span className="text-xs text-gray-300 font-medium">Total Transactions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-danger-500 shadow-glow-danger"></div>
          <span className="text-xs text-gray-300 font-medium">Suspicious</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-bitcoin-500 shadow-glow-bitcoin"></div>
          <span className="text-xs text-gray-300 font-medium">BTC Price</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
