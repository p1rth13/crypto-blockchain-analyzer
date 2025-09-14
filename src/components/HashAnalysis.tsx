import React, { useState, useEffect } from 'react';
import {
  Hash,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Copy,
  ExternalLink,
  Database,
  Activity,
  Users,
  Zap,
  DollarSign,
  Eye,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  Link,
  Layers,
  Target,
  FileText,
  Calendar,
  HardDrive
} from 'lucide-react';
import BlockCypherService from '../services/blockCypherService';

interface TransactionInput {
  previousTxHash: string;
  outputIndex: number;
  scriptSig: string;
  sequence: number;
  address: string;
  value: number;
  scriptType: string;
}

interface TransactionOutput {
  value: number;
  scriptPubKey: string;
  address: string;
  outputIndex: number;
  scriptType: string;
  spent: boolean;
  spentTxHash?: string;
}

interface TransactionDetails {
  hash: string;
  version: number;
  size: number;
  virtualSize: number;
  weight: number;
  lockTime: number;
  blockHash?: string;
  blockHeight?: number;
  confirmations: number;
  timestamp: string;
  fee: number;
  feeRate: number;
  totalInput: number;
  totalOutput: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  isConfirmed: boolean;
  rbf: boolean; // Replace-by-Fee
  segwit: boolean;
  coinbase: boolean;
}

interface HashAnalysisMetrics {
  privacyScore: number;
  complexityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  patterns: string[];
  addressReuse: number;
  mixingDetected: boolean;
  utxoAge: number;
  networkPropagation: number;
}

interface RelatedTransaction {
  hash: string;
  relationship: 'parent' | 'child' | 'sibling';
  timestamp: string;
  value: number;
  confirmations: number;
}

interface HashAnalysisState {
  searchHash: string;
  transaction: TransactionDetails | null;
  metrics: HashAnalysisMetrics | null;
  relatedTransactions: RelatedTransaction[];
  isLoading: boolean;
  searchLoading: boolean;
  error: string | null;
  selectedInput: number | null;
  selectedOutput: number | null;
  showAdvanced: boolean;
  filterType: 'all' | 'inputs' | 'outputs' | 'related';
}

const HashAnalysis: React.FC = () => {
  const [state, setState] = useState<HashAnalysisState>({
    searchHash: '',
    transaction: null,
    metrics: null,
    relatedTransactions: [],
    isLoading: false,
    searchLoading: false,
    error: null,
    selectedInput: null,
    selectedOutput: null,
    showAdvanced: false,
    filterType: 'all'
  });

  const searchTransaction = async () => {
    if (!state.searchHash.trim()) return;
    
    setState(prev => ({ ...prev, searchLoading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate comprehensive mock transaction data
      const mockTransaction = generateMockTransaction(state.searchHash);
      const mockMetrics = generateMockMetrics();
      const mockRelated = generateMockRelatedTransactions();

      setState(prev => ({
        ...prev,
        transaction: mockTransaction,
        metrics: mockMetrics,
        relatedTransactions: mockRelated,
        searchLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch transaction details',
        searchLoading: false
      }));
    }
  };

  const generateMockTransaction = (hash: string): TransactionDetails => {
    const inputCount = Math.floor(Math.random() * 5) + 1;
    const outputCount = Math.floor(Math.random() * 6) + 2;
    const totalInput = Math.floor(Math.random() * 10000000000) + 100000000; // 1-100 BTC
    const fee = Math.floor(Math.random() * 100000) + 10000; // 0.1-1 mBTC
    const totalOutput = totalInput - fee;

    const inputs: TransactionInput[] = [];
    for (let i = 0; i < inputCount; i++) {
      inputs.push({
        previousTxHash: `${Math.random().toString(16).substr(2, 64)}`,
        outputIndex: Math.floor(Math.random() * 5),
        scriptSig: `304502210${Math.random().toString(16).substr(2, 40)}`,
        sequence: 0xffffffff,
        address: `bc1${Math.random().toString(36).substr(2, 39)}`,
        value: Math.floor(totalInput / inputCount) + Math.floor(Math.random() * 1000000),
        scriptType: Math.random() > 0.5 ? 'P2WPKH' : 'P2PKH'
      });
    }

    const outputs: TransactionOutput[] = [];
    for (let i = 0; i < outputCount; i++) {
      outputs.push({
        value: i === 0 ? Math.floor(totalOutput * 0.6) : Math.floor(totalOutput * 0.4 / (outputCount - 1)),
        scriptPubKey: `0014${Math.random().toString(16).substr(2, 40)}`,
        address: `bc1${Math.random().toString(36).substr(2, 39)}`,
        outputIndex: i,
        scriptType: Math.random() > 0.3 ? 'P2WPKH' : 'P2SH',
        spent: Math.random() > 0.4,
        spentTxHash: Math.random() > 0.6 ? `${Math.random().toString(16).substr(2, 64)}` : undefined
      });
    }

    return {
      hash: hash.length === 64 ? hash : `${Math.random().toString(16).substr(2, 64)}`,
      version: 2,
      size: Math.floor(Math.random() * 1000) + 200,
      virtualSize: Math.floor(Math.random() * 800) + 150,
      weight: Math.floor(Math.random() * 3200) + 600,
      lockTime: 0,
      blockHash: Math.random() > 0.1 ? `00000000000000000${Math.random().toString(16).substr(2, 47)}` : undefined,
      blockHeight: Math.random() > 0.1 ? Math.floor(Math.random() * 850000) + 800000 : undefined,
      confirmations: Math.random() > 0.1 ? Math.floor(Math.random() * 1000) + 1 : 0,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      fee,
      feeRate: Math.round((fee / (Math.floor(Math.random() * 800) + 150)) * 1000) / 1000,
      totalInput,
      totalOutput,
      inputs,
      outputs,
      isConfirmed: Math.random() > 0.1,
      rbf: Math.random() > 0.7,
      segwit: Math.random() > 0.3,
      coinbase: Math.random() > 0.95
    };
  };

  const generateMockMetrics = (): HashAnalysisMetrics => ({
    privacyScore: Math.floor(Math.random() * 100),
    complexityScore: Math.floor(Math.random() * 100),
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    patterns: [
      'Standard P2WPKH Transaction',
      'Multiple Input Consolidation',
      'Change Output Detected',
      Math.random() > 0.7 ? 'Potential Mixing Pattern' : '',
      Math.random() > 0.8 ? 'Round Number Payment' : ''
    ].filter(Boolean),
    addressReuse: Math.floor(Math.random() * 5),
    mixingDetected: Math.random() > 0.85,
    utxoAge: Math.floor(Math.random() * 365),
    networkPropagation: Math.floor(Math.random() * 100) + 80
  });

  const generateMockRelatedTransactions = (): RelatedTransaction[] => {
    const related = [];
    const count = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < count; i++) {
      related.push({
        hash: `${Math.random().toString(16).substr(2, 64)}`,
        relationship: ['parent', 'child', 'sibling'][Math.floor(Math.random() * 3)] as 'parent' | 'child' | 'sibling',
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        value: Math.floor(Math.random() * 5000000000) + 100000000,
        confirmations: Math.floor(Math.random() * 100) + 1
      });
    }
    
    return related.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const formatBTC = (satoshis: number): string => {
    const btc = satoshis / 100000000;
    if (btc >= 1000) return `₿${(btc / 1000).toFixed(1)}K`;
    if (btc >= 1) return `₿${btc.toFixed(8)}`;
    return `${satoshis.toLocaleString()} sats`;
  };

  const formatHash = (hash: string): string => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const getPrivacyScoreColor = (score: number): string => {
    if (score >= 80) return 'var(--color-success-600)';
    if (score >= 60) return 'var(--color-warning-600)';
    return 'var(--color-error-600)';
  };

  const getRiskLevelColor = (level: string): string => {
    switch (level) {
      case 'low': return 'var(--color-success-600)';
      case 'medium': return 'var(--color-warning-600)';
      case 'high': return 'var(--color-error-600)';
      default: return 'var(--text-primary)';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary-500)'
            }}>
              <Hash style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                margin: '0 0 var(--space-1) 0'
              }}>
                Hash Analysis
              </h1>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>
                Comprehensive Bitcoin transaction hash analysis with privacy scoring and pattern detection
              </p>
            </div>
          </div>

          <button
            onClick={() => setState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--surface-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)'
            }}
          >
            {state.showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {/* Transaction Search */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center',
          padding: 'var(--space-4)',
          background: 'var(--surface-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <Search style={{ width: '20px', height: '20px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Enter Bitcoin transaction hash (e.g., a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d)"
            value={state.searchHash}
            onChange={(e) => setState(prev => ({ ...prev, searchHash: e.target.value }))}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontFamily: 'var(--font-family-mono)'
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchTransaction()}
          />
          <button
            onClick={searchTransaction}
            disabled={state.searchLoading}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--color-primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: state.searchLoading ? 'not-allowed' : 'pointer',
              fontSize: 'var(--text-sm)'
            }}
          >
            {state.searchLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* Error Display */}
        {state.error && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--color-error-50)',
            border: '1px solid var(--color-error-200)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <AlertTriangle style={{ width: '20px', height: '20px', color: 'var(--color-error-600)' }} />
            <span style={{ color: 'var(--color-error-600)' }}>{state.error}</span>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      {state.transaction && (
        <>
          {/* Basic Transaction Info */}
          <section>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-6)'
            }}>
              Transaction Overview
            </h2>
            <div style={{
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)' }}>
                    Transaction Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Hash</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ 
                          color: 'var(--text-primary)', 
                          fontFamily: 'var(--font-family-mono)', 
                          fontSize: 'var(--text-sm)' 
                        }}>
                          {formatHash(state.transaction.hash)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(state.transaction!.hash)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          <Copy style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Status</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {state.transaction.isConfirmed ? (
                          <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--color-success-600)' }} />
                        ) : (
                          <Clock style={{ width: '16px', height: '16px', color: 'var(--color-warning-600)' }} />
                        )}
                        <span style={{ 
                          color: state.transaction.isConfirmed ? 'var(--color-success-600)' : 'var(--color-warning-600)',
                          fontWeight: 'var(--font-semibold)' 
                        }}>
                          {state.transaction.isConfirmed ? 'Confirmed' : 'Unconfirmed'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Confirmations</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                        {state.transaction.confirmations.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Block Height</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {state.transaction.blockHeight?.toLocaleString() || 'Pending'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Timestamp</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {formatTimeAgo(state.transaction.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)' }}>
                    Financial Summary
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Total Input</span>
                      <span style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-semibold)' }}>
                        {formatBTC(state.transaction.totalInput)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Total Output</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>
                        {formatBTC(state.transaction.totalOutput)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Transaction Fee</span>
                      <span style={{ color: 'var(--color-warning-600)', fontWeight: 'var(--font-semibold)' }}>
                        {formatBTC(state.transaction.fee)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Fee Rate</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {state.transaction.feeRate.toFixed(1)} sat/vB
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0', fontSize: 'var(--text-lg)' }}>
                    Technical Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Size</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {formatBytes(state.transaction.size)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Virtual Size</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {formatBytes(state.transaction.virtualSize)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Weight</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {state.transaction.weight.toLocaleString()} WU
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Version</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {state.transaction.version}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>SegWit</span>
                      <span style={{ 
                        color: state.transaction.segwit ? 'var(--color-success-600)' : 'var(--text-primary)' 
                      }}>
                        {state.transaction.segwit ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Risk Analysis */}
          {state.metrics && (
            <section>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-6)'
              }}>
                Privacy & Risk Analysis
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--space-4)'
              }}>
                <div style={{
                  background: 'var(--surface-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <Shield style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Privacy Score</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Score</span>
                      <span style={{ 
                        color: getPrivacyScoreColor(state.metrics.privacyScore), 
                        fontWeight: 'var(--font-bold)',
                        fontSize: 'var(--text-lg)'
                      }}>
                        {state.metrics.privacyScore}/100
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--surface-tertiary)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${state.metrics.privacyScore}%`,
                        height: '100%',
                        background: getPrivacyScoreColor(state.metrics.privacyScore),
                        borderRadius: 'var(--radius-full)'
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Risk Level</span>
                      <span style={{ 
                        color: getRiskLevelColor(state.metrics.riskLevel), 
                        fontWeight: 'var(--font-semibold)',
                        textTransform: 'capitalize'
                      }}>
                        {state.metrics.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'var(--surface-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <Activity style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Pattern Analysis</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {state.metrics.patterns.map((pattern, index) => (
                      <div key={index} style={{
                        padding: 'var(--space-2)',
                        background: 'var(--surface-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)'
                      }}>
                        {pattern}
                      </div>
                    ))}
                    {state.metrics.mixingDetected && (
                      <div style={{
                        padding: 'var(--space-2)',
                        background: 'var(--color-warning-50)',
                        border: '1px solid var(--color-warning-200)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-warning-700)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}>
                        <AlertTriangle style={{ width: '14px', height: '14px' }} />
                        Potential Mixing Activity
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  background: 'var(--surface-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <Database style={{ width: '20px', height: '20px', color: 'var(--color-primary-500)' }} />
                    <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>UTXO Analysis</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Address Reuse</span>
                      <span style={{ 
                        color: state.metrics.addressReuse > 0 ? 'var(--color-warning-600)' : 'var(--color-success-600)',
                        fontWeight: 'var(--font-semibold)' 
                      }}>
                        {state.metrics.addressReuse}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Average UTXO Age</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {state.metrics.utxoAge} days
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Network Propagation</span>
                      <span style={{ color: 'var(--color-success-600)', fontWeight: 'var(--font-semibold)' }}>
                        {state.metrics.networkPropagation}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Transaction Inputs */}
          <section>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-6)'
            }}>
              Transaction Inputs ({state.transaction.inputs.length})
            </h2>
            <div style={{
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}>
              {state.transaction.inputs.map((input, index) => (
                <div
                  key={index}
                  style={{
                    padding: 'var(--space-4)',
                    borderBottom: index < state.transaction!.inputs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-success-100)',
                      border: '1px solid var(--color-success-300)'
                    }}>
                      <ArrowDownLeft style={{ width: '16px', height: '16px', color: 'var(--color-success-600)' }} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                          Input {index + 1}:
                        </span>
                        <code style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-family-mono)'
                        }}>
                          {formatHash(input.previousTxHash)}:{input.outputIndex}
                        </code>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--surface-tertiary)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {input.scriptType}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-family-mono)'
                      }}>
                        {formatHash(input.address)}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-success-600)'
                      }}>
                        {formatBTC(input.value)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Transaction Outputs */}
          <section>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-6)'
            }}>
              Transaction Outputs ({state.transaction.outputs.length})
            </h2>
            <div style={{
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}>
              {state.transaction.outputs.map((output, index) => (
                <div
                  key={index}
                  style={{
                    padding: 'var(--space-4)',
                    borderBottom: index < state.transaction!.outputs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      background: output.spent ? 'var(--color-error-100)' : 'var(--color-primary-100)',
                      border: `1px solid ${output.spent ? 'var(--color-error-300)' : 'var(--color-primary-300)'}`
                    }}>
                      <ArrowUpRight style={{ 
                        width: '16px', 
                        height: '16px', 
                        color: output.spent ? 'var(--color-error-600)' : 'var(--color-primary-600)' 
                      }} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                          Output {index}:
                        </span>
                        <code style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-family-mono)'
                        }}>
                          {formatHash(output.address)}
                        </code>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--surface-tertiary)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {output.scriptType}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: output.spent ? 'var(--color-error-600)' : 'var(--color-success-600)'
                      }}>
                        {output.spent ? `Spent in ${formatHash(output.spentTxHash || '')}` : 'Unspent'}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-primary)'
                      }}>
                        {formatBTC(output.value)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Transactions */}
          {state.relatedTransactions.length > 0 && (
            <section>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-6)'
              }}>
                Related Transactions
              </h2>
              <div style={{
                background: 'var(--surface-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
              }}>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {state.relatedTransactions.slice(0, 20).map((tx, index) => (
                    <div
                      key={tx.hash}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        borderBottom: index < 19 ? '1px solid var(--border-subtle)' : 'none',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--surface-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        background: tx.relationship === 'parent' ? 'var(--color-warning-100)' : 
                                   tx.relationship === 'child' ? 'var(--color-success-100)' : 'var(--color-primary-100)',
                        border: `1px solid ${tx.relationship === 'parent' ? 'var(--color-warning-300)' : 
                                             tx.relationship === 'child' ? 'var(--color-success-300)' : 'var(--color-primary-300)'}`
                      }}>
                        <Link style={{ 
                          width: '16px', 
                          height: '16px', 
                          color: tx.relationship === 'parent' ? 'var(--color-warning-600)' : 
                                 tx.relationship === 'child' ? 'var(--color-success-600)' : 'var(--color-primary-600)' 
                        }} />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                          <code style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-family-mono)'
                          }}>
                            {formatHash(tx.hash)}
                          </code>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            padding: 'var(--space-1) var(--space-2)',
                            background: 'var(--surface-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            textTransform: 'capitalize'
                          }}>
                            {tx.relationship}
                          </div>
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)'
                        }}>
                          {tx.confirmations} confirmations • {formatTimeAgo(tx.timestamp)}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--text-primary)'
                        }}>
                          {formatBTC(tx.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Loading Spinner Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HashAnalysis;
