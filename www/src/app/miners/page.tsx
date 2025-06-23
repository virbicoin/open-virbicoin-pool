"use client";

import useSWR from "swr";
import Link from 'next/link';
import { formatHashrate } from '@/lib/formatters';
import TimeAgo from '@/components/TimeAgo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Miner型を定義
interface Miner {
  hr: number;
  lastBeat: number;
  offline?: boolean;
}

export default function MinersPage() {
  const { data = {} } = useSWR(API_BASE_URL + "/api/miners", fetcher, { refreshInterval: 5000 });
  const minersObject: { [address: string]: Miner } = data.miners || {};
  const minersArray = Object.entries(minersObject).map(([address, miner]) => ({
    miner: address,
    ...miner,
  }));
  const sortedMiners = minersArray.sort((a, b) => (b.hr || 0) - (a.hr || 0));

  return (
    <div>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Miners</h1>
          <p className="text-gray-400">List of all active miners in the pool ({minersArray.length} total).</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-6 text-gray-100">Active Miners</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hashrate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Last Beat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedMiners.map((miner) => (
                    <tr 
                      key={miner.miner} 
                      className={`hover:bg-gray-700 transition-colors ${miner.offline ? 'bg-red-900/50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <Link 
                          href={`/account/${miner.miner}`} 
                          className="font-mono text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          {miner.miner}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{formatHashrate(miner.hr)}</td>
                      <td className="px-4 py-3 text-gray-300">
                        <TimeAgo timestamp={miner.lastBeat} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 