import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionChart: React.FC = () => {
  // Mock data for the last 6 months
  const data = [
    { month: 'Mar', transactions: 45000, suspicious: 320 },
    { month: 'Apr', transactions: 52000, suspicious: 280 },
    { month: 'May', transactions: 48000, suspicious: 450 },
    { month: 'Jun', transactions: 61000, suspicious: 380 },
    { month: 'Jul', transactions: 55000, suspicious: 520 },
    { month: 'Aug', transactions: 67000, suspicious: 410 },
    { month: 'Sep', transactions: 72000, suspicious: 600 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey="transactions"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTransactions)"
            name="Total Transactions"
          />
          <Area
            type="monotone"
            dataKey="suspicious"
            stroke="#EF4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSuspicious)"
            name="Suspicious Transactions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
