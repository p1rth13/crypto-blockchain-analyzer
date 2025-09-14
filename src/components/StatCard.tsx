import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'teal';
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  change, 
  trend = 'neutral',
  description 
}) => {
  const colorConfig = {
    blue: {
      bg: 'bg-slate-800',
      text: 'text-blue-400',
      border: 'border-slate-700',
      accent: 'bg-blue-500',
      changeColor: 'text-blue-400'
    },
    green: {
      bg: 'bg-slate-800',
      text: 'text-emerald-400', 
      border: 'border-slate-700',
      accent: 'bg-emerald-500',
      changeColor: 'text-emerald-400'
    },
    yellow: {
      bg: 'bg-slate-800',
      text: 'text-amber-400',
      border: 'border-slate-700', 
      accent: 'bg-amber-500',
      changeColor: 'text-amber-400'
    },
    red: {
      bg: 'bg-slate-800',
      text: 'text-red-400',
      border: 'border-slate-700',
      accent: 'bg-red-500', 
      changeColor: 'text-red-400'
    },
    purple: {
      bg: 'bg-slate-800',
      text: 'text-purple-400',
      border: 'border-slate-700',
      accent: 'bg-purple-500',
      changeColor: 'text-purple-400'
    },
    indigo: {
      bg: 'bg-slate-800', 
      text: 'text-indigo-400',
      border: 'border-slate-700',
      accent: 'bg-indigo-500',
      changeColor: 'text-indigo-400'
    },
    teal: {
      bg: 'bg-slate-800',
      text: 'text-teal-400',
      border: 'border-slate-700',
      accent: 'bg-teal-500',
      changeColor: 'text-teal-400'
    }
  };

  const config = colorConfig[color];

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  // Simple mini chart data
  const miniChartData = [
    { value: Math.random() * 50 + 25 },
    { value: Math.random() * 50 + 30 },
    { value: Math.random() * 50 + 35 },
    { value: Math.random() * 50 + 40 },
    { value: Math.random() * 50 + 45 },
    { value: Math.random() * 50 + 50 },
    { value: Math.random() * 50 + 55 }
  ];

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-6 hover:border-slate-600 transition-all duration-200 group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              {title}
            </h3>
            <div className={`p-2 rounded-lg ${config.accent}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold text-white mb-1">
              {value}
            </div>
            {change && (
              <div className={`flex items-center text-sm ${config.changeColor}`}>
                <span className="mr-1">{getTrendIcon()}</span>
                <span className="font-medium">{change}</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>

          {/* Mini Chart */}
          <div className="flex items-end space-x-1 h-8">
            {miniChartData.map((point, index) => (
              <div
                key={index}
                className={`${config.accent} rounded-sm opacity-70 group-hover:opacity-100 transition-opacity`}
                style={{
                  width: '4px',
                  height: `${(point.value / 100) * 32}px`,
                  minHeight: '2px'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {description && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      )}
    </div>
  );
};

export default StatCard;
