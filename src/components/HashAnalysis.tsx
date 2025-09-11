import React, { useState } from 'react';
import { Search, ExternalLink, Copy, Loader, Clock, DollarSign, Hash, ArrowUpDown, AlertCircle } from 'lucide-react';

interface TransactionDetail {
  hash: string;
  block_height: number;
  block_hash: string;
  time: number;
  confirmations: number;
  size: number;
  weight: number;
  fee: number;
  inputs: {
    address: string;
    value: number;
    prev_out?: {
      hash: string;
      n: number;
    };
  }[];
  outputs: {
    address: string;
    value: number;
    n: number;
  }[];
  total_input: number;
  total_output: number;
}

const HashAnalysis: React.FC = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('📋 Copied to clipboard:', text);
  };

  // Format BTC amount
  const formatBTC = (satoshis: number): string => {
    return `${(satoshis / 100000000).toFixed(8)} BTC`;
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Fetch transaction details
  const analyzeTransaction = async () => {
    if (!transactionHash.trim()) {
      setError('Please enter a transaction hash');
      return;
    }

    console.log('🔍 Starting transaction hash analysis for:', transactionHash);
    setLoading(true);
    setError(null);
    setTransactionDetail(null);

    try {
      // Try BlockCypher API first (supports CORS)
      console.log('📡 Trying BlockCypher API for transaction...');
      const blockCypherResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${transactionHash}`);
      
      if (blockCypherResponse.ok) {
        const rawTx = await blockCypherResponse.json();
        console.log('📦 BlockCypher transaction data:', rawTx);

        // Process BlockCypher transaction data
        const transactionData: TransactionDetail = {
          hash: rawTx.hash,
          block_height: rawTx.block_height || 0,
          block_hash: rawTx.block_hash || 'Unconfirmed',
          time: rawTx.confirmed ? Math.floor(new Date(rawTx.confirmed).getTime() / 1000) : Math.floor(Date.now() / 1000),
          confirmations: rawTx.confirmations || 0,
          size: rawTx.size || 0,
          weight: rawTx.weight || 0,
          fee: rawTx.fees || 0,
          inputs: rawTx.inputs?.map((input: any) => ({
            address: input.addresses?.[0] || 'Coinbase',
            value: input.output_value || 0,
            prev_out: input.prev_hash ? {
              hash: input.prev_hash,
              n: input.output_index || 0
            } : undefined
          })) || [],
          outputs: rawTx.outputs?.map((output: any, index: number) => ({
            address: output.addresses?.[0] || 'Unknown',
            value: output.value || 0,
            n: index
          })) || [],
          total_input: rawTx.total || 0,
          total_output: rawTx.total - (rawTx.fees || 0) || 0
        };

        console.log('✅ Processed BlockCypher transaction details:', transactionData);
        setTransactionDetail(transactionData);
        return;
      }
      
      console.log('⚠️ BlockCypher failed, trying CORS proxies...');

      // Fallback to CORS proxies for blockchain.info
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest=',
      ];

      for (let i = 0; i < corsProxies.length; i++) {
        try {
          console.log(`📡 Trying CORS proxy ${i + 1} for transaction: ${corsProxies[i]}`);
          const response = await fetch(corsProxies[i] + `https://blockchain.info/rawtx/${transactionHash}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Transaction not found');
            }
            throw new Error(`HTTP ${response.status}`);
          }
          
          const rawTx = await response.json();
          console.log('📦 Raw transaction data:', rawTx);
          console.log('🏠 Input addresses found:', rawTx.inputs?.map((input: any) => input.prev_out?.addr).filter(Boolean));
          console.log('🏠 Output addresses found:', rawTx.out?.map((output: any) => output.addr).filter(Boolean));

          // Process transaction data
          const transactionData: TransactionDetail = {
            hash: rawTx.hash,
            block_height: rawTx.block_height || 0,
            block_hash: rawTx.block_hash || 'Unconfirmed',
            time: rawTx.time || Date.now() / 1000,
            confirmations: rawTx.confirmations || 0,
            size: rawTx.size || 0,
            weight: rawTx.weight || 0,
            fee: rawTx.fee || 0,
            inputs: rawTx.inputs?.map((input: any) => {
              const address = input.prev_out?.addr || 'Coinbase';
              console.log('📥 Processing input address:', address, 'value:', input.prev_out?.value);
              return {
                address: address,
                value: input.prev_out?.value || 0,
                prev_out: input.prev_out ? {
                  hash: input.prev_out.tx_index?.toString() || '',
                  n: input.prev_out.n || 0
                } : undefined
              };
            }) || [],
            outputs: rawTx.out?.map((output: any, index: number) => {
              const address = output.addr || 'Unknown';
              console.log('📤 Processing output address:', address, 'value:', output.value);
              return {
                address: address,
                value: output.value || 0,
                n: index
              };
            }) || [],
            total_input: rawTx.inputs?.reduce((sum: number, input: any) => sum + (input.prev_out?.value || 0), 0) || 0,
            total_output: rawTx.out?.reduce((sum: number, output: any) => sum + (output.value || 0), 0) || 0
          };

          console.log('✅ Processed transaction details:', transactionData);
          setTransactionDetail(transactionData);
          return; // Success, exit function
        } catch (proxyErr: any) {
          console.log(`⚠️ CORS proxy ${i + 1} failed:`, proxyErr);
          if (i === corsProxies.length - 1) {
            throw proxyErr; // Last proxy failed, throw error
          }
        }
      }
    } catch (err: any) {
      console.error('❌ All APIs failed for transaction analysis:', err);
      setError(err.message || 'Failed to fetch transaction details. Please check the transaction hash and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeTransaction();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="hash-input" className="block text-sm font-medium text-dark-200 mb-2">
              Transaction Hash
            </label>
            <div className="relative">
              <input
                id="hash-input"
                type="text"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Bitcoin transaction hash (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa...)"
                className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-transparent font-mono text-sm"
              />
              <Hash className="absolute right-3 top-3 w-5 h-5 text-dark-400" />
            </div>
          </div>
          <button
            onClick={analyzeTransaction}
            disabled={loading || !transactionHash.trim()}
            className="glow-button px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Hash</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-card p-4 border-l-4 border-red-500">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Transaction Details */}
      {transactionDetail && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-electric-500/20 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-electric-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-dark-100">
                    {transactionDetail.confirmations || 'Unconfirmed'}
                  </div>
                  <div className="text-xs text-dark-400">Confirmations</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-bitcoin-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-bitcoin-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-dark-100">
                    {formatBTC(transactionDetail.fee)}
                  </div>
                  <div className="text-xs text-dark-400">Transaction Fee</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
                  <ArrowUpDown className="w-5 h-5 text-success-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-dark-100">
                    {transactionDetail.size.toLocaleString()} bytes
                  </div>
                  <div className="text-xs text-dark-400">Transaction Size</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-dark-100">
                    #{transactionDetail.block_height.toLocaleString()}
                  </div>
                  <div className="text-xs text-dark-400">Block Height</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Transaction Hash</h3>
            <div className="flex items-center space-x-2 p-3 bg-dark-800/50 rounded-lg">
              <div className="text-sm font-mono text-dark-100 break-all flex-1">
                {transactionDetail.hash}
              </div>
              <button
                onClick={() => copyToClipboard(transactionDetail.hash)}
                className="text-dark-400 hover:text-electric-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`https://blockstream.info/tx/${transactionDetail.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-400 hover:text-electric-300 transition-colors flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </a>
            </div>
          </div>

          {/* Block Information */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Block Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-dark-400 mb-1">Block Hash</div>
                <div className="text-sm font-mono text-dark-100 break-all p-2 bg-dark-800/50 rounded">
                  {transactionDetail.block_hash}
                </div>
              </div>
              <div>
                <div className="text-sm text-dark-400 mb-1">Timestamp</div>
                <div className="text-sm text-dark-100 p-2 bg-dark-800/50 rounded">
                  {formatTime(transactionDetail.time)}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-100">
                  Inputs ({transactionDetail.inputs.length})
                </h3>
                <div className="text-sm text-dark-400">
                  Total: {formatBTC(transactionDetail.total_input)}
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {transactionDetail.inputs.map((input, index) => (
                  <div key={index} className="p-3 bg-dark-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-dark-400">Input #{index + 1}</div>
                      <div className="text-sm font-semibold text-success-400">
                        {formatBTC(input.value)}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-dark-200 break-all">
                      {input.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outputs */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dark-100">
                  Outputs ({transactionDetail.outputs.length})
                </h3>
                <div className="text-sm text-dark-400">
                  Total: {formatBTC(transactionDetail.total_output)}
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {transactionDetail.outputs.map((output, index) => (
                  <div key={index} className="p-3 bg-dark-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-dark-400">Output #{index + 1}</div>
                      <div className="text-sm font-semibold text-bitcoin-400">
                        {formatBTC(output.value)}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-dark-200 break-all">
                      {output.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Technical Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-dark-400 mb-1">Size</div>
                <div className="text-sm text-dark-100">{transactionDetail.size.toLocaleString()} bytes</div>
              </div>
              <div>
                <div className="text-sm text-dark-400 mb-1">Weight</div>
                <div className="text-sm text-dark-100">{transactionDetail.weight.toLocaleString()} WU</div>
              </div>
              <div>
                <div className="text-sm text-dark-400 mb-1">Fee Rate</div>
                <div className="text-sm text-dark-100">
                  {transactionDetail.size > 0 ? 
                    Math.round((transactionDetail.fee / transactionDetail.size) * 100000000).toLocaleString() + ' sat/byte' 
                    : 'N/A'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-dark-400 mb-1">Status</div>
                <div className={`text-sm font-medium ${
                  transactionDetail.confirmations > 0 ? 'text-success-400' : 'text-warning-400'
                }`}>
                  {transactionDetail.confirmations > 0 ? 'Confirmed' : 'Unconfirmed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!transactionDetail && !loading && !error && (
        <div className="glass-card p-12 text-center">
          <Hash className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-100 mb-2">Hash Analysis</h3>
          <p className="text-dark-400 mb-6">
            Enter a Bitcoin transaction hash above to analyze its details, inputs, outputs, and technical information.
          </p>
          <div className="text-sm text-dark-500">
            Example: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa2yDXhpePgw3isKmq7bKSPpgwdosTf
          </div>
        </div>
      )}
    </div>
  );
};

export default HashAnalysis;
