import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'green' | 'purple' | 'yellow' | 'electric' | 'bitcoin' | 'success' | 'danger' | 'warning';
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    electric: 'bg-electric-500/20 text-electric-400 border-electric-500/30',
    bitcoin: 'bg-bitcoin-500/20 text-bitcoin-400 border-bitcoin-500/30',
    success: 'bg-success-500/20 text-success-400 border-success-500/30',
    danger: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
    warning: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
  };

  const iconGlowClasses = {
    blue: 'shadow-blue-500/50',
    red: 'shadow-red-500/50',
    green: 'shadow-green-500/50',
    purple: 'shadow-purple-500/50',
    yellow: 'shadow-yellow-500/50',
    electric: 'shadow-electric-500/50',
    bitcoin: 'shadow-bitcoin-500/50',
    success: 'shadow-success-500/50',
    danger: 'shadow-danger-500/50',
    warning: 'shadow-warning-500/50',
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-400';
    if (trend === 'down') return 'text-danger-400';
    return 'text-dark-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <div className="glass-card group hover:scale-105 transition-all duration-300 hover:shadow-glow overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-dark-400 mb-1 tracking-wide uppercase">{title}</p>
            <p className="text-3xl font-bold text-dark-100 tracking-tight">
              {value}
            </p>
          </div>
          
          <div className={`flex items-center justify-center w-16 h-16 rounded-2xl border backdrop-blur-sm ${colorClasses[color]} ${iconGlowClasses[color]} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
        
        {change && (
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-bold ${getTrendColor()}`}>
              {getTrendIcon()} {change}
            </span>
            <span className="text-xs text-dark-500">vs last month</span>
          </div>
        )}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorClasses[color].includes('electric') ? 'from-electric-500/20 to-bitcoin-500/20' : colorClasses[color].includes('bitcoin') ? 'from-bitcoin-500/20 to-electric-500/20' : colorClasses[color].includes('success') ? 'from-success-500/20 to-electric-500/20' : 'from-electric-500/20 to-bitcoin-500/20'} blur-sm`}></div>
      </div>
    </div>
  );
};

export default StatCard;
