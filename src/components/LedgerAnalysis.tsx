import React, { useState, useEffect } from 'react';
import { Search, Wallet, TrendingUp, TrendingDown, DollarSign, BarChart3, Zap } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  high_24h: number;
  low_24h: number;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    price_btc: number;
    score: number;
  };
}

interface GlobalData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

const LedgerAnalysis: React.FC = () => {
  const [topCoins, setTopCoins] = useState<CoinData[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch top cryptocurrencies
  const fetchTopCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTopCoins(data);
      console.log('Top Coins:', data);
    } catch (err) {
      console.error('Error fetching top coins:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch top coins');
    }
  };

  // Fetch trending cryptocurrencies
  const fetchTrendingCoins = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTrendingCoins(data.coins || []);
      console.log('Trending Coins:', data.coins);
    } catch (err) {
      console.error('Error fetching trending coins:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trending coins');
    }
  };

  // Fetch global market data
  const fetchGlobalData = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/global');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setGlobalData(data.data);
      console.log('Global Data:', data.data);
    } catch (err) {
      console.error('Error fetching global data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch global data');
    }
  };

  // Search for specific cryptocurrency
  const searchCryptocurrency = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearchResult(null);
      
      // First, get the coin ID from search
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchQuery)}`
      );
      
      if (!searchResponse.ok) {
        throw new Error(`Search API Error: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      console.log('Search Results:', searchData);
      
      if (searchData.coins && searchData.coins.length > 0) {
        const coinId = searchData.coins[0].id;
        
        // Get detailed coin data
        const coinResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h`
        );
        
        if (!coinResponse.ok) {
          throw new Error(`Coin API Error: ${coinResponse.status}`);
        }
        
        const coinData = await coinResponse.json();
        if (coinData && coinData.length > 0) {
          setSearchResult(coinData[0]);
          console.log('Search Result Coin:', coinData[0]);
        } else {
          setError('Cryptocurrency not found');
        }
      } else {
        setError('No cryptocurrency found with that name');
      }
    } catch (err) {
      console.error('Error searching cryptocurrency:', err);
      setError(err instanceof Error ? err.message : 'Failed to search cryptocurrency');
    } finally {
      setLoading(false);
    }
  };

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  // Format percentage with color
  const formatPercentage = (percentage: number): { value: string; isPositive: boolean } => {
    const isPositive = percentage >= 0;
    return {
      value: `${isPositive ? '+' : ''}${percentage.toFixed(2)}%`,
      isPositive
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTopCoins(),
        fetchTrendingCoins(),
        fetchGlobalData()
      ]);
      setLoading(false);
    };

    initializeData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Wallet className="w-8 h-8 text-blue-400" />
          Ledger Portfolio Analytics
        </h2>
        <p className="text-gray-400">Real-time cryptocurrency market data and portfolio insights</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Global Market Overview */}
      {globalData && (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-400" />
            Global Market Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Market Cap</p>
              <p className="text-white text-lg font-semibold">
                {formatNumber(globalData.total_market_cap.usd)}
              </p>
              <p className={`text-sm ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(globalData.market_cap_change_percentage_24h_usd).value} 24h
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm">24h Volume</p>
              <p className="text-white text-lg font-semibold">
                {formatNumber(globalData.total_volume.usd)}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm">BTC Dominance</p>
              <p className="text-white text-lg font-semibold">
                {globalData.market_cap_percentage.btc.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Active Cryptocurrencies</p>
              <p className="text-white text-lg font-semibold">
                {globalData.active_cryptocurrencies.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Cryptocurrency */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-400" />
          Search Cryptocurrency
        </h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchCryptocurrency()}
            placeholder="Enter cryptocurrency name (e.g., Bitcoin, Ethereum)"
            className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={searchCryptocurrency}
            disabled={loading || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </div>

        {searchResult && (
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <img src={searchResult.image} alt={searchResult.name} className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="text-white text-lg font-semibold">{searchResult.name}</h4>
                <p className="text-gray-400 uppercase">{searchResult.symbol}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-white text-xl font-bold">${searchResult.current_price.toFixed(2)}</p>
                <p className={`text-sm ${searchResult.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                  {searchResult.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentage(searchResult.price_change_percentage_24h).value}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-white font-medium">{formatNumber(searchResult.market_cap)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-white font-medium">{formatNumber(searchResult.total_volume)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h High</p>
                <p className="text-white font-medium">${searchResult.high_24h.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Low</p>
                <p className="text-white font-medium">${searchResult.low_24h.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Cryptocurrencies */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-yellow-400" />
          Top 10 Cryptocurrencies
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 py-2">Rank</th>
                <th className="text-left text-gray-400 py-2">Name</th>
                <th className="text-right text-gray-400 py-2">Price</th>
                <th className="text-right text-gray-400 py-2">24h %</th>
                <th className="text-right text-gray-400 py-2">Market Cap</th>
                <th className="text-right text-gray-400 py-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {topCoins.map((coin) => {
                const priceChange = formatPercentage(coin.price_change_percentage_24h);
                return (
                  <tr key={coin.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-3 text-gray-300">#{coin.market_cap_rank}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-white font-medium">{coin.name}</p>
                          <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right text-white font-medium">
                      ${coin.current_price.toFixed(2)}
                    </td>
                    <td className={`py-3 text-right font-medium ${priceChange.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {priceChange.isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {priceChange.value}
                      </div>
                    </td>
                    <td className="py-3 text-right text-gray-300">
                      {formatNumber(coin.market_cap)}
                    </td>
                    <td className="py-3 text-right text-gray-300">
                      {formatNumber(coin.total_volume)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trending Cryptocurrencies */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-400" />
          Trending Cryptocurrencies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingCoins.slice(0, 6).map((trendingCoin, index) => (
            <div key={trendingCoin.item.id} className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-yellow-400 font-bold">#{index + 1}</span>
                <img src={trendingCoin.item.thumb} alt={trendingCoin.item.name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-white font-medium">{trendingCoin.item.name}</p>
                  <p className="text-gray-400 text-sm uppercase">{trendingCoin.item.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Price in BTC</p>
                <p className="text-white font-medium">{trendingCoin.item.price_btc.toFixed(8)} BTC</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-2">Loading cryptocurrency data...</p>
        </div>
      )}
    </div>
  );
};

export default LedgerAnalysis;
