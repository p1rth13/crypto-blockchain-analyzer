import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ComponentType<any>;
  description?: string;
  trend?: number[];
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description,
  trend 
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="w-4 h-4" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return 'var(--text-tertiary)';
    
    switch (change.type) {
      case 'increase':
        return 'var(--color-success-500)';
      case 'decrease':
        return 'var(--color-error-500)';
      default:
        return 'var(--text-tertiary)';
    }
  };

  return (
    <div className="metric-card">
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        <Icon className="metric-icon" />
      </div>
      
      <div className="metric-value">
        {formatValue(value)}
      </div>
      
      {change && (
        <div 
          className={`metric-change ${change.type === 'increase' ? 'positive' : change.type === 'decrease' ? 'negative' : 'neutral'}`}
          style={{ color: getChangeColor() }}
        >
          {getChangeIcon()}
          <span>
            {change.value > 0 ? '+' : ''}{change.value}%
          </span>
        </div>
      )}
      
      {description && (
        <div className="text-micro" style={{ color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
          {description}
        </div>
      )}
      
      {trend && trend.length > 1 && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <svg width="100%" height="32" className="sparkline">
            <polyline
              fill="none"
              stroke="var(--color-primary-400)"
              strokeWidth="2"
              points={trend.map((value, index) => {
                const x = (index / (trend.length - 1)) * 100;
                const normalizedValue = ((value - Math.min(...trend)) / (Math.max(...trend) - Math.min(...trend))) * 100;
                const y = 100 - normalizedValue;
                return `${x},${y}`;
              }).join(' ')}
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
