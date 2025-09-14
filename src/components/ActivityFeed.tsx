import React from 'react';
import { Activity, AlertTriangle, Wallet, Database, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'transaction' | 'anomaly' | 'wallet' | 'block';
  title: string;
  description: string;
  value: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, title = "Recent Activity" }) => {
  const getActivityIcon = (type: ActivityItem['type']): React.ComponentType<any> => {
    switch (type) {
      case 'transaction':
        return Activity;
      case 'anomaly':
        return AlertTriangle;
      case 'wallet':
        return Wallet;
      case 'block':
        return Database;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'var(--color-success-500)';
      case 'warning':
        return 'var(--color-warning-500)';
      case 'error':
        return 'var(--color-error-500)';
      default:
        return 'var(--color-primary-500)';
    }
  };

  const getStatusBadge = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'error':
        return 'badge-error';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">Latest blockchain activity and alerts</p>
      </div>
      
      <div className="card-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            
            return (
              <div 
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  background: 'var(--surface-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
                className="activity-item"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.background = 'var(--surface-interactive)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--surface-secondary)';
                }}
              >
                {/* Icon */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-lg)',
                    background: `${getStatusColor(activity.status)}20`,
                    color: getStatusColor(activity.status),
                    flexShrink: 0
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                    <div style={{ flex: 1 }}>
                      <h4 
                        className="text-small"
                        style={{ 
                          color: 'var(--text-primary)', 
                          fontWeight: 'var(--font-medium)',
                          margin: '0 0 var(--space-1) 0'
                        }}
                      >
                        {activity.title}
                      </h4>
                      <p 
                        className="text-micro"
                        style={{ 
                          color: 'var(--text-tertiary)', 
                          margin: '0 0 var(--space-2) 0'
                        }}
                      >
                        {activity.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Clock className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-micro" style={{ color: 'var(--text-tertiary)' }}>
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    {/* Value */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div 
                        className="text-small"
                        style={{ 
                          color: 'var(--text-primary)', 
                          fontWeight: 'var(--font-semibold)',
                          marginBottom: 'var(--space-1)'
                        }}
                      >
                        {activity.value}
                      </div>
                      <div className={`badge ${getStatusBadge(activity.status)}`}>
                        {activity.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="card-actions">
        <button className="btn btn-tertiary">View All Activity</button>
        <button className="btn btn-primary">Export Report</button>
      </div>
    </div>
  );
};

export default ActivityFeed;
