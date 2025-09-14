import React from 'react';
import { Search, Bell, Settings, Download } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Array<{
    id: string;
    name: string;
    icon: React.ComponentType<any>;
  }>;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <nav className="nav-primary">
      <div className="container">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Brand */}
          <div className="nav-brand">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-primary-500)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v6m0 6v6m8-13h-6m-4 0H4m16 6h-6m-4 0H4"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <div className="text-h3" style={{ color: 'var(--text-primary)' }}>CryptoAnalyzer</div>
              <div className="text-micro" style={{ color: 'var(--text-tertiary)' }}>
                Blockchain Intelligence Platform
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type="text"
                placeholder="Search transactions, addresses, blocks..."
                className="form-input pl-10"
                style={{ 
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="btn-icon btn-tertiary interactive-target">
              <Bell className="w-5 h-5" />
              <span className="sr-only">Notifications</span>
            </button>
            <button className="btn-icon btn-tertiary interactive-target">
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </button>
            <button className="btn btn-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-tab interactive-target ${activeTab === tab.id ? 'active' : ''}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
