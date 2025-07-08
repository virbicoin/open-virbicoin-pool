"use client";

import useSWR from "swr";
import { formatHashrate } from "@/lib/formatters";
import TimeAgo from "@/components/TimeAgo";
import PoolHealthStatus from "@/components/PoolHealthStatus";
import {
  UserGroupIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CubeIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  GiftIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface Stats {
  hashrate: number
  miners: number
  workers: number
  lastBlockFound: number
  networkHashrate?: number
  networkDifficulty?: number
  blockHeight?: number
  roundVariance?: number
}

interface DashboardStatsProps {
  stats: Stats
}

function calcNetworkHashrate(difficulty: number, blockTime: number = 10) {
  if (!difficulty || !blockTime) return 0;
  return difficulty / blockTime;
}

// ローディング状態のスケルトンコンポーネント
function DashboardStatsLoading() {
  return (
    <div>
      <div className="mb-8">
        <PoolHealthStatus />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
            <div className="w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-8 bg-gray-600 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardStats({ stats: initialStats }: DashboardStatsProps) {
  // ローカル環境（開発・本番問わず）では模擬データを使用
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isDevelopment = process.env.NODE_ENV === 'development' || isLocalhost;
  
  // 開発環境用の模擬データを定義
  const mockData = {
    hashrate: 8.93e12, // 8.93 GH/s
    minersTotal: 810, // 810人に固定
    stats: {
      lastBlockFound: Math.floor((Date.now() - 1200000) / 1000), // 20分前のUnixタイムスタンプ（秒）
      networkDifficulty: 3.64364e12, // 3643.64 GH (表示用)
      height: 114514, // 114514に固定
      roundShares: 1.8e8,
      roundVariance: 85.2
    },
    nodes: [{
      difficulty: '191900000000000', // 19.19 TH/s になるように調整 (19.19 * 10^12 * 10)
      height: '114514' // 114514に固定
    }]
  };
  
  const fetcher = (url: string) => {
    if (isDevelopment) {
      console.log('[Dev/Local Mode] Using simulated stats data');
      // 開発環境またはローカル環境では模擬データを返す
      return Promise.resolve(mockData);
    }
    // 本番環境ではAPIプロキシを使用
    return fetch(url).then(res => res.json());
  };
  
  // useSWRは常に呼び出す（Reactフックのルール）
  const swrResult = useSWR("/api/stats", fetcher, { 
    refreshInterval: isDevelopment ? 0 : 5000, // 開発環境では自動更新を無効化
    // 有効な初期データがある場合のみfallbackDataを使用
    ...(initialStats && initialStats.hashrate > 0 ? { fallbackData: initialStats } : {}),
    revalidateOnFocus: false,
    revalidateOnReconnect: !isDevelopment, // 開発環境では再接続時の再検証を無効化
    dedupingInterval: 2000,
    errorRetryInterval: 1000,
    errorRetryCount: isDevelopment ? 0 : 3, // 開発環境ではリトライを無効化
  });

  // 開発環境では模擬データを使用
  const swr = isDevelopment ? 
    { data: mockData, isLoading: false, error: null } :
    swrResult;

  const { data, isLoading, error } = swr;

  // データが読み込み中、またはエラーがある場合
  if (isLoading || error || !data) {
    return <DashboardStatsLoading />;
  }

  const latestNode = data?.nodes && data.nodes.length > 0 ? data.nodes[0] : null;
  
  // 開発環境では個別の値を使用、本番環境では従来の計算を使用
  const networkDifficulty = isDevelopment ? 
    (data?.stats?.networkDifficulty || 0) :  // 開発環境: stats.networkDifficultyを使用
    (latestNode ? parseFloat(latestNode.difficulty) : (data?.stats?.networkDifficulty || 0));
    
  const networkHashrateCalculationDifficulty = latestNode ? parseFloat(latestNode.difficulty) : (data?.stats?.networkDifficulty || 0);
  const blockHeight = latestNode ? parseInt(latestNode.height) : (data?.stats?.height || 0);
  const networkHashrate = calcNetworkHashrate(networkHashrateCalculationDifficulty, 10);

  // データの妥当性チェック - 開発環境では常に有効とみなす
  const isDataValid = isDevelopment || (networkHashrate > 1e9 && networkDifficulty > 1e6);
  
  if (!isDataValid && !isDevelopment) {
    return <DashboardStatsLoading />;
  }

  let roundVariance = data?.stats?.roundVariance;
  if (roundVariance === undefined || roundVariance === 0) {
    const roundShares = data?.stats?.roundShares;
    if (roundShares && networkDifficulty) {
      roundVariance = (roundShares / networkDifficulty) * 100;
    } else {
      roundVariance = 0;
    }
  }

  const stats = {
    hashrate: data?.hashrate || 0,
    miners: data?.minersTotal || 0,
    workers: data?.minersTotal || 0,
    lastBlockFound: data?.stats?.lastBlockFound || 0,
    // 開発環境では模擬データを、本番環境では検証済みデータを使用
    networkHashrate: isDevelopment ? networkHashrate : (isDataValid ? networkHashrate : 0),
    networkDifficulty: isDevelopment ? networkDifficulty : (isDataValid ? networkDifficulty : 0),
    blockHeight: isDevelopment ? blockHeight : (isDataValid ? blockHeight : 0),
    roundVariance: isDevelopment ? roundVariance : (isDataValid ? roundVariance : 0),
  };

  return (
    <div>
      <div className="mb-8">
        <PoolHealthStatus />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <UserGroupIcon className="w-8 h-8 text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Miners Online</h3>
          <p className="text-2xl font-bold text-blue-500">{stats.miners} Miners</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <CpuChipIcon className="w-8 h-8 text-green-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Pool Hashrate</h3>
          <p className="text-2xl font-bold text-blue-500">{formatHashrate(stats.hashrate)}</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <GlobeAltIcon className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Network Hashrate</h3>
          <p className="text-2xl font-bold text-blue-500">
            {stats.networkHashrate > 0 ? formatHashrate(stats.networkHashrate) : 'Loading...'}
          </p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <ChartBarIcon className="w-8 h-8 text-pink-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Network Difficulty</h3>
          <p className="text-2xl font-bold text-blue-500">
            {stats.networkDifficulty > 0 ? `${(stats.networkDifficulty / 1e9).toFixed(2)} GH` : 'Loading...'}
          </p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <CubeIcon className="w-8 h-8 text-orange-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Blockchain Height</h3>
          <p className="text-2xl font-bold text-blue-500">{(stats.blockHeight || 0).toLocaleString()} Blocks</p>
          <span className="text-sm text-gray-400 block mt-1">Best viewed in a <a href={`https://explorer.digitalregion.jp/block/${stats.blockHeight}`} target="_blank" rel="noopener noreferrer">block explorer</a></span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <ClockIcon className="w-8 h-8 text-cyan-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Last Block Found</h3>
          <p className="text-2xl font-bold text-blue-500">
            {stats.lastBlockFound ? (
              <TimeAgo timestamp={stats.lastBlockFound} agoOnly={true} />
            ) : (
              'Never'
            )}
          </p>
          {stats.lastBlockFound ? (
            <span className="text-sm text-gray-400 block mt-1">
                {new Date(stats.lastBlockFound * 1000).toLocaleString(undefined, { timeZoneName: 'short' })}
            </span>
          ) : null}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <AdjustmentsHorizontalIcon className="w-8 h-8 text-purple-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Round Variance</h3>
          <p className="text-2xl font-bold text-blue-500">
            {stats.roundVariance ? `${stats.roundVariance.toFixed(2)}%` : '0%'}
          </p>
          <span className="text-sm text-gray-400 block mt-1">Lower is better</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <ArrowPathIcon className="w-8 h-8 text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Payouts</h3>
          <p className="text-2xl font-bold text-blue-500">Every 2 hours</p>
          <span className="text-sm text-gray-400 block mt-1">Automatic payouts to your wallet</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Pool Fee</h3>
          <p className="text-2xl font-bold text-blue-500">1.0%</p>
            <span className="text-sm text-gray-400 block mt-1">Low fee</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <CreditCardIcon className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Minimum Payout</h3>
          <p className="text-2xl font-bold text-blue-500">0.1 VBC</p>
          <span className="text-sm text-gray-400 block mt-1">Low threshold for payouts</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <GiftIcon className="w-8 h-8 text-pink-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Block Reward</h3>
          <p className="text-2xl font-bold text-blue-500">8 VBC</p>
            <span className="text-sm text-gray-400 block mt-1">Unlimited supply</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full transition-all duration-300 hover:shadow-lg hover:bg-gray-700/80 hover:border-gray-600">
        <BanknotesIcon className="w-8 h-8 text-cyan-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Payment Method</h3>
          <p className="text-2xl font-bold text-blue-500">PROP</p>
          <span className="text-sm text-gray-400 block mt-1">Stable and profitable pool with regular payouts</span>        </div>
      </div>
    </div>
    </div>
  )
}
