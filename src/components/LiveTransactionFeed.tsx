import React, { useState, useEffect } from 'react';
import { 
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Clock,
  Hash,
  DollarSign,
  Zap,
  AlertCircle,
  CheckCircle,
  Eye,
  Pause,
  Play
} from 'lucide-react';
import BlockCypherService from '../services/blockCypherService';
import type { LiveTransaction, LiveTransactionUpdate } from '../services/blockCypherService';

interface LiveTransactionFeedProps {
  maxTransactions?: number;
}

const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({ maxTransactions = 10 }) => {
  const [liveData, setLiveData] = useState<LiveTransactionUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (isPaused) return;

    setIsConnected(true);
    
    const cleanup = BlockCypherService.startLiveTracking((update) => {
      setLiveData(update);
      setLastUpdate(new Date());
    }, 15000); // Update every 15 seconds

    return () => {
      cleanup();
      setIsConnected(false);
    };
  }, [isPaused]);

  const formatValue = (satoshis: number): string => {
    const btc = satoshis / 100000000;
    if (btc >= 1) {
      return `₿${btc.toFixed(4)}`;
    } else {
      return `${satoshis.toLocaleString()} sats`;
    }
  };

  const formatTime = (timeString: string): string => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return time.toLocaleTimeString();
  };

  const getTransactionIcon = (transaction: LiveTransaction) => {
    switch (transaction.type) {
      case 'incoming':
        return <ArrowDownLeft style={{ width: '16px', height: '16px', color: 'var(--color-success-500)' }} />;
      case 'outgoing':
        return <ArrowUpRight style={{ width: '16px', height: '16px', color: 'var(--color-error-500)' }} />;
      default:
        return <RefreshCw style={{ width: '16px', height: '16px', color: 'var(--color-warning-500)' }} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle style={{ width: '14px', height: '14px', color: 'var(--color-success-500)' }} />;
      case 'unconfirmed':
        return <Clock style={{ width: '14px', height: '14px', color: 'var(--color-warning-500)' }} />;
      default:
        return <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--color-error-500)' }} />;
    }
  };

  return (
    <div style={{
      background: 'var(--surface-primary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-6)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: isConnected ? 'var(--color-success-500)' : 'var(--color-error-500)'
            }}>
              <Activity style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                margin: '0 0 var(--space-1) 0'
              }}>
                Live Transaction Feed
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isConnected ? 'var(--color-success-500)' : 'var(--color-error-500)',
                  animation: isConnected ? 'pulse 2s infinite' : 'none'
                }} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                {lastUpdate && (
                  <>
                    <span>•</span>
                    <span>Updated {formatTime(lastUpdate.toISOString())}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setIsPaused(!isPaused)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'transparent',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-interactive)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {isPaused ? <Play style={{ width: '14px', height: '14px' }} /> : <Pause style={{ width: '14px', height: '14px' }} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>

        {/* Live Stats */}
        {liveData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--surface-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)'
              }}>
                {liveData.transactionCount24h.toLocaleString()}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-medium)'
              }}>
                24h Transactions
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)'
              }}>
                {formatValue(liveData.totalVolume24h)}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-medium)'
              }}>
                24h Volume
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)'
              }}>
                {formatValue(liveData.averageFee)}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-medium)'
              }}>
                Avg Fee
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-success-600)'
              }}>
                {liveData.networkHealth.toFixed(1)}%
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-medium)'
              }}>
                Network Health
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div style={{
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        {liveData?.transactions?.length ? (
          liveData.transactions.slice(0, maxTransactions).map((transaction, index) => (
            <div
              key={transaction.hash}
              style={{
                padding: 'var(--space-4)',
                borderBottom: index < liveData.transactions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                transition: 'all var(--transition-fast)',
                animation: index === 0 ? 'fadeIn 0.5s ease-in-out' : 'none',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                margin: 'var(--space-1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {/* Transaction Type Icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: transaction.type === 'incoming' 
                    ? 'var(--color-success-100)' 
                    : transaction.type === 'outgoing' 
                    ? 'var(--color-error-100)' 
                    : 'var(--color-warning-100)',
                  border: `1px solid ${
                    transaction.type === 'incoming' 
                      ? 'var(--color-success-300)' 
                      : transaction.type === 'outgoing' 
                      ? 'var(--color-error-300)' 
                      : 'var(--color-warning-300)'
                  }`
                }}>
                  {getTransactionIcon(transaction)}
                </div>

                {/* Transaction Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <Hash style={{ width: '12px', height: '12px', color: 'var(--text-secondary)' }} />
                    <code style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-mono)',
                      fontWeight: 'var(--font-medium)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {transaction.hash.substring(0, 16)}...
                    </code>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      {getStatusIcon(transaction.status)}
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-primary)',
                        textTransform: 'capitalize',
                        fontWeight: 'var(--font-medium)'
                      }}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-4)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <DollarSign style={{ width: '12px', height: '12px', color: 'var(--color-success-600)' }} />
                      <span style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>{formatValue(transaction.value)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Zap style={{ width: '12px', height: '12px', color: 'var(--color-warning-600)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{formatValue(transaction.fees)} fee</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Clock style={{ width: '12px', height: '12px', color: 'var(--text-secondary)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{formatTime(transaction.time)}</span>
                    </div>
                  </div>
                </div>

                {/* Confirmations */}
                <div style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: transaction.confirmations > 0 ? 'var(--color-success-500)' : 'var(--color-warning-500)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-bold)',
                  minWidth: '70px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {transaction.confirmations} conf
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-tertiary)'
          }}>
            <Eye style={{ width: '48px', height: '48px', margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <p>Waiting for live transactions...</p>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LiveTransactionFeed;
