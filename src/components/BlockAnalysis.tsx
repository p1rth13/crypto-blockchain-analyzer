import React, { useState } from 'react';
import { 
  Search, 
  Loader, 
  Hash, 
  Users, 
  ArrowRightLeft, 
  Database,
  Copy,
  Activity,
  AlertCircle
} from 'lucide-react';

interface Transaction {
  hash: string;
  size: number;
  weight: number;
  fee: number;
  inputs: Array<{
    address: string;
    value: number;
    prev_out?: {
      hash: string;
      n: number;
    };
  }>;
  outputs: Array<{
    address: string;
    value: number;
    n: number;
  }>;
  time: number;
}

interface BlockDetail {
  hash: string;
  ver: number;
  prev_block: string;
  mrkl_root: string;
  time: number;
  bits: number;
  nonce: number;
  n_tx: number;
  size: number;
  block_index: number;
  main_chain: boolean;
  height: number;
  received_time: number;
  relayed_by: string;
  tx: Transaction[];
  fee: number;
  reward: number;
}

const BlockAnalysis: React.FC = () => {
  const [blockHash, setBlockHash] = useState<string>('');
  const [blockDetail, setBlockDetail] = useState<BlockDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allAddresses, setAllAddresses] = useState<Array<{address: string, totalValue: number, type: 'input' | 'output'}>>([]);

  // Analyze block using blockchain.info/rawblock API
  const analyzeBlock = async () => {
    if (!blockHash.trim()) {
      setError('Please enter a block hash');
      return;
    }

    console.log('🔍 Starting block analysis for:', blockHash);
    setLoading(true);
    setError(null);
    setBlockDetail(null);
    setAllAddresses([]);

    try {
      // Try BlockCypher API first (supports CORS)
      console.log('📡 Trying BlockCypher API for block...');
      const blockCypherResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/blocks/${blockHash}?txstart=0&limit=50`);
      
      if (blockCypherResponse.ok) {
        const rawBlock = await blockCypherResponse.json();
        console.log('📦 BlockCypher block data:', rawBlock);

        // Process BlockCypher block data
        const processedBlock: BlockDetail = {
          hash: rawBlock.hash,
          ver: rawBlock.ver || 1,
          prev_block: rawBlock.prev_block || '',
          mrkl_root: rawBlock.mrkl_root || '',
          time: rawBlock.time ? Math.floor(new Date(rawBlock.time).getTime() / 1000) : 0,
          bits: rawBlock.bits || 0,
          nonce: rawBlock.nonce || 0,
          n_tx: rawBlock.n_tx || 0,
          size: rawBlock.size || 0,
          block_index: rawBlock.height || 0,
          main_chain: true,
          height: rawBlock.height || 0,
          received_time: rawBlock.received_time ? Math.floor(new Date(rawBlock.received_time).getTime() / 1000) : 0,
          relayed_by: rawBlock.relayed_by || 'Unknown',
          tx: [], // Will be populated if transaction details are available
          fee: rawBlock.fees || 0,
          reward: rawBlock.reward || 0
        };

        // Process addresses from BlockCypher data
        const addressMap = new Map<string, {totalValue: number, type: 'input' | 'output'}>();
        
        if (rawBlock.txids && rawBlock.txids.length > 0) {
          console.log('📊 Block contains', rawBlock.txids.length, 'transactions');
          console.log('🔍 Trying to fetch transaction details for addresses...');
          
          // Fetch first few transactions to get addresses (BlockCypher has rate limits)
          const txsToFetch = rawBlock.txids.slice(0, 5); // Limit to first 5 transactions
          
          try {
            for (let i = 0; i < txsToFetch.length; i++) {
              const txResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txsToFetch[i]}`);
              if (txResponse.ok) {
                const txData = await txResponse.json();
                console.log(`📋 Transaction ${i + 1} data:`, txData);
                
                // Process inputs
                txData.inputs?.forEach((input: any) => {
                  if (input.addresses && input.addresses.length > 0) {
                    const addr = input.addresses[0];
                    const value = input.output_value || 0;
                    console.log(`📥 Found input address: ${addr} (${value} satoshis)`);
                    const existing = addressMap.get(addr) || {totalValue: 0, type: 'input' as const};
                    addressMap.set(addr, {
                      totalValue: existing.totalValue + value,
                      type: 'input'
                    });
                  }
                });
                
                // Process outputs
                txData.outputs?.forEach((output: any) => {
                  if (output.addresses && output.addresses.length > 0) {
                    const addr = output.addresses[0];
                    const value = output.value || 0;
                    console.log(`� Found output address: ${addr} (${value} satoshis)`);
                    const existing = addressMap.get(addr) || {totalValue: 0, type: 'output' as const};
                    addressMap.set(addr, {
                      totalValue: existing.totalValue + value,
                      type: 'output'
                    });
                  }
                });
              }
              
              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log('✅ Extracted addresses from BlockCypher:', addressMap.size);
          } catch (txErr) {
            console.log('⚠️ Failed to fetch transaction details from BlockCypher:', txErr);
          }
        }

        setBlockDetail(processedBlock);
        setAllAddresses(Array.from(addressMap.entries()).map(([address, data]) => ({
          address,
          totalValue: data.totalValue,
          type: data.type
        })));
        
        // If we got addresses from BlockCypher, return early
        if (addressMap.size > 0) {
          console.log('🎉 Successfully extracted', addressMap.size, 'addresses from BlockCypher API');
          return;
        }
      }
      
      console.log('⚠️ BlockCypher failed or no addresses found, trying blockchain.info directly...');

      // Try blockchain.info API directly for the block with transaction details
      try {
        console.log('📡 Trying blockchain.info direct API...');
        const directResponse = await fetch(`https://blockchain.info/rawblock/${blockHash}?format=json`);
        
        if (directResponse.ok) {
          const rawBlock = await directResponse.json();
          console.log('📦 Direct blockchain.info block data:', rawBlock);
          console.log('🔢 Total transactions in block:', rawBlock.tx?.length);

          // Process all addresses from all transactions
          const addressMap = new Map<string, {totalValue: number, type: 'input' | 'output'}>();
          
          rawBlock.tx?.forEach((transaction: any, txIndex: number) => {
            console.log(`📋 Processing transaction ${txIndex + 1}/${rawBlock.tx.length}: ${transaction.hash}`);
            
            // Process inputs
            transaction.inputs?.forEach((input: any, inputIndex: number) => {
              if (input.prev_out?.addr) {
                const addr = input.prev_out.addr;
                const value = input.prev_out.value || 0;
                console.log(`📥 Input ${inputIndex}: ${addr} (${value} satoshis)`);
                const existing = addressMap.get(addr) || {totalValue: 0, type: 'input' as const};
                addressMap.set(addr, {
                  totalValue: existing.totalValue + value,
                  type: 'input'
                });
              }
            });

            // Process outputs
            transaction.out?.forEach((output: any, outputIndex: number) => {
              if (output.addr) {
                const addr = output.addr;
                const value = output.value || 0;
                console.log(`📤 Output ${outputIndex}: ${addr} (${value} satoshis)`);
                const existing = addressMap.get(addr) || {totalValue: 0, type: 'output' as const};
                addressMap.set(addr, {
                  totalValue: existing.totalValue + value,
                  type: 'output'
                });
              }
            });
          });

          const blockData: BlockDetail = {
            ...rawBlock,
            tx: rawBlock.tx?.map((tx: any) => ({
              hash: tx.hash,
              size: tx.size || 0,
              weight: tx.weight || 0,
              fee: tx.fee || 0,
              inputs: tx.inputs?.map((input: any) => ({
                address: input.prev_out?.addr || 'Coinbase',
                value: input.prev_out?.value || 0,
                prev_out: input.prev_out ? {
                  hash: input.prev_out.tx_index?.toString() || '',
                  n: input.prev_out.n || 0
                } : undefined
              })) || [],
              outputs: tx.out?.map((output: any, index: number) => ({
                address: output.addr || 'Unknown',
                value: output.value || 0,
                n: index
              })) || [],
              time: tx.time || rawBlock.time
            })) || []
          };

          console.log('✅ Direct API - Found unique addresses:', addressMap.size);
          console.log('🏠 All addresses:', Array.from(addressMap.keys()));
          
          setBlockDetail(blockData);
          setAllAddresses(Array.from(addressMap.entries()).map(([address, data]) => ({
            address,
            totalValue: data.totalValue,
            type: data.type
          })));
          return;
        }
      } catch (directErr) {
        console.log('⚠️ Direct blockchain.info API failed:', directErr);
      }

      // Fallback to CORS proxies for blockchain.info
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest=',
      ];

      for (let i = 0; i < corsProxies.length; i++) {
        try {
          console.log(`📡 Trying CORS proxy ${i + 1} for block: ${corsProxies[i]}`);
          const response = await fetch(corsProxies[i] + `https://blockchain.info/rawblock/${blockHash}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Block not found');
            }
            throw new Error(`HTTP ${response.status}`);
          }
          
          const rawBlock = await response.json();
          console.log('📦 Raw block data:', rawBlock);
          console.log('🔢 Total transactions in block:', rawBlock.tx?.length);

          // Process all addresses from all transactions with detailed logging
          const addressMap = new Map<string, {totalValue: number, type: 'input' | 'output'}>();
          
          rawBlock.tx?.forEach((transaction: any, txIndex: number) => {
            console.log(`📋 Processing transaction ${txIndex + 1}/${rawBlock.tx.length}: ${transaction.hash}`);
            
            // Process inputs - looking for prev_out.addr like "bc1qryhgpmfv03qjhhp2dj8nw8g4ewg08jzmgy3cyx"
            transaction.inputs?.forEach((input: any, inputIndex: number) => {
              if (input.prev_out?.addr) {
                const addr = input.prev_out.addr;
                const value = input.prev_out.value || 0;
                console.log(`📥 Input ${inputIndex}: ${addr} (${value} satoshis)`);
                const existing = addressMap.get(addr) || {totalValue: 0, type: 'input' as const};
                addressMap.set(addr, {
                  totalValue: existing.totalValue + value,
                  type: existing.type === 'output' ? existing.type : 'input'
                });
              }
            });

            // Process outputs - looking for addr like "bc1qu33dxs7leevepkpe8zkkc83m0d34t52hprj2n0"
            transaction.out?.forEach((output: any, outputIndex: number) => {
              if (output.addr) {
                const addr = output.addr;
                const value = output.value || 0;
                console.log(`📤 Output ${outputIndex}: ${addr} (${value} satoshis)`);
                const existing = addressMap.get(addr) || {totalValue: 0, type: 'output' as const};
                addressMap.set(addr, {
                  totalValue: existing.totalValue + value,
                  type: 'output'
                });
              }
            });
          });

          // Convert transactions to our format
          const processedTransactions: Transaction[] = rawBlock.tx?.map((tx: any) => ({
            hash: tx.hash,
            size: tx.size || 0,
            weight: tx.weight || 0,
            fee: tx.fee || 0,
            inputs: tx.inputs?.map((input: any) => ({
              address: input.prev_out?.addr || 'Coinbase',
              value: input.prev_out?.value || 0,
              prev_out: input.prev_out ? {
                hash: input.prev_out.tx_index?.toString() || '',
                n: input.prev_out.n || 0
              } : undefined
            })) || [],
            outputs: tx.out?.map((output: any, index: number) => ({
              address: output.addr || 'Unknown',
              value: output.value || 0,
              n: index
            })) || [],
            time: tx.time || rawBlock.time
          })) || [];

          const blockData: BlockDetail = {
            ...rawBlock,
            tx: processedTransactions
          };

          console.log('✅ Processed block details:', blockData);
          console.log('📍 Found unique addresses:', addressMap.size);
          console.log('🏠 All addresses:', Array.from(addressMap.keys()));
          
          setBlockDetail(blockData);
          setAllAddresses(Array.from(addressMap.entries()).map(([address, data]) => ({
            address,
            totalValue: data.totalValue,
            type: data.type
          })));
          return; // Success, exit function
        } catch (proxyErr: any) {
          console.log(`⚠️ CORS proxy ${i + 1} failed:`, proxyErr);
          if (i === corsProxies.length - 1) {
            throw proxyErr; // Last proxy failed, throw error
          }
        }
      }
    } catch (err: any) {
      console.error('❌ All APIs failed for block analysis:', err);
      setError(err.message || 'Failed to fetch block details. Please check the block hash and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatSatoshis = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8) + ' BTC';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Block Hash Input */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Block Analysis</h2>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={blockHash}
              onChange={(e) => setBlockHash(e.target.value)}
              placeholder="Enter block hash (e.g., 00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054)"
              className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            />
          </div>
          <button
            onClick={analyzeBlock}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Analyze Block
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}
      </div>

      {/* Block Details */}
      {blockDetail && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Block Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-400" />
              Block Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-300">Block Hash</label>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-xs break-all">{blockDetail.hash}</span>
                  <button onClick={() => copyToClipboard(blockDetail.hash)} className="text-blue-400 hover:text-blue-300">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Height</label>
                  <p className="text-white font-semibold">{blockDetail.height.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Transactions</label>
                  <p className="text-white font-semibold">{blockDetail.n_tx.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Timestamp</label>
                <p className="text-white">{formatDate(blockDetail.time)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Size</label>
                  <p className="text-white">{(blockDetail.size / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Nonce</label>
                  <p className="text-white font-mono">{blockDetail.nonce.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Block Statistics */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Block Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Fees</span>
                <span className="text-white font-semibold">{formatSatoshis(blockDetail.fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Block Reward</span>
                <span className="text-white font-semibold">{formatSatoshis(blockDetail.reward)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Unique Addresses</span>
                <span className="text-white font-semibold">{allAddresses.length.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Version</span>
                <span className="text-white font-mono">{blockDetail.ver}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Addresses in Block */}
      {allAddresses.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            All Addresses in Block ({allAddresses.length})
          </h3>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {allAddresses.map((addr, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      addr.type === 'input' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {addr.type}
                    </span>
                    <span className="text-white font-mono text-sm break-all">{addr.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm">{formatSatoshis(addr.totalValue)}</span>
                    <button onClick={() => copyToClipboard(addr.address)} className="text-blue-400 hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Preview */}
      {blockDetail && blockDetail.tx && blockDetail.tx.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-yellow-400" />
            Transactions Preview (First 10)
          </h3>
          <div className="space-y-3">
            {blockDetail.tx.slice(0, 10).map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">#{index + 1}</span>
                  <span className="text-white font-mono text-sm">{tx.hash.substring(0, 16)}...</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">{tx.inputs.length} inputs</span>
                  <span className="text-gray-300 text-sm">{tx.outputs.length} outputs</span>
                  <span className="text-gray-300 text-sm">{formatSatoshis(tx.fee)} fee</span>
                  <button onClick={() => copyToClipboard(tx.hash)} className="text-blue-400 hover:text-blue-300">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {blockDetail.tx.length > 10 && (
            <p className="text-gray-400 text-sm mt-3 text-center">
              Showing 10 of {blockDetail.tx.length} transactions
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockAnalysis;
