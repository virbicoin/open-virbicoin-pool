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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function DashboardStats({ stats: initialStats }: DashboardStatsProps) {
  const fetcher = (url: string) => fetch(`${API_BASE_URL}${url}`).then(res => res.json());
  const { data } = useSWR("/api/stats", fetcher, { refreshInterval: 5000, fallbackData: initialStats });

  const latestNode = data?.nodes && data.nodes.length > 0 ? data.nodes[0] : null;
  const networkDifficulty = latestNode ? parseFloat(latestNode.difficulty) : (data?.stats?.networkDifficulty || 0);
  const blockHeight = latestNode ? parseInt(latestNode.height) : (data?.stats?.height || 0);
  const networkHashrate = calcNetworkHashrate(networkDifficulty, 10);

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
    networkHashrate,
    networkDifficulty,
    blockHeight,
    roundVariance,
  };

  return (
    <div>
      <div className="mb-8">
        <PoolHealthStatus />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <UserGroupIcon className="w-8 h-8 text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Miners Online</h3>
          <p className="text-2xl font-bold text-blue-500">{stats.miners} Miners</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <CpuChipIcon className="w-8 h-8 text-green-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Pool Hashrate</h3>
          <p className="text-2xl font-bold text-blue-500">{formatHashrate(stats.hashrate)}</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <GlobeAltIcon className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Network Hashrate</h3>
          <p className="text-2xl font-bold text-blue-500">{formatHashrate(stats.networkHashrate || 0)}</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <ChartBarIcon className="w-8 h-8 text-pink-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Network Difficulty</h3>
          <p className="text-2xl font-bold text-blue-500">{((stats.networkDifficulty || 0) / 1e9).toFixed(2)} G</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <CubeIcon className="w-8 h-8 text-orange-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Blockchain Height</h3>
          <p className="text-2xl font-bold text-blue-500">{((stats.blockHeight || 0) / 1000).toFixed(2)} K Blocks</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
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
              {new Date(stats.lastBlockFound * 1000).toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <AdjustmentsHorizontalIcon className="w-8 h-8 text-purple-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Round Variance</h3>
          <p className="text-2xl font-bold text-blue-500">
            {stats.roundVariance ? `${stats.roundVariance.toFixed(2)}%` : '0%'}
          </p>
          <span className="text-sm text-gray-400 block mt-1">Lower is better</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <ArrowPathIcon className="w-8 h-8 text-blue-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Payouts</h3>
          <p className="text-2xl font-bold text-blue-500">Every 2 hours</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Pool Fee</h3>
          <p className="text-2xl font-bold text-blue-500">1.0%</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <CreditCardIcon className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Minimum Payout</h3>
          <p className="text-2xl font-bold text-blue-500">0.1 VBC</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
        <GiftIcon className="w-8 h-8 text-pink-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-1">Block Reward</h3>
          <p className="text-2xl font-bold text-blue-500">8 VBC</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex items-center gap-4 min-h-[140px] h-full">
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
