"use client";

import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faTachometerAlt, faGlobe, faCube, faClock, faChartPie, faHistory, faHandHoldingUsd, faWallet, faGift, faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";
import { formatHashrate, formatDifficulty, formatLargeNumber } from "@/lib/formatters";
import { StatsData } from "@/lib/api";
import TimeAgo from "@/components/TimeAgo";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

function formatDateYMDHMS(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

type StatCardProps = {
  icon: IconDefinition;
  title: string;
  value: React.ReactNode;
  subtext?: string;
};

const StatCard = ({ icon, title, value, subtext }: StatCardProps) => (
  <div className="col-md-4 col-sm-6">
    <div className="panel stat-card">
      <div className="panel-body">
        <div className="stat-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <span className="stat-value">{value}</span>
          <span className="stat-subtext">{subtext || '\u00A0'}</span>
        </div>
      </div>
    </div>
  </div>
);

type DashboardStatsProps = {
  initialStats: StatsData;
};

export default function DashboardStats({ initialStats }: DashboardStatsProps) {
  const { data: stats = initialStats } = useSWR(
    API_BASE_URL + "/api/stats",
    fetcher,
    { refreshInterval: 5000 }
  );

  const firstNode = stats.nodes?.[0];
  const networkDifficulty = firstNode ? parseFloat(firstNode.difficulty) : 0;
  const blockTime = 12; // Blocktime is 12 seconds
  const networkHashrate = blockTime > 0 ? networkDifficulty / blockTime : 0;
  const roundShares = stats.stats?.roundShares || 0;
  const roundVariance = networkDifficulty > 0 ? (roundShares / networkDifficulty) * 100 : 0;
  const lastBlockFoundTimestamp = stats.stats?.lastBlockFound;
  const lastBlockFoundDate = lastBlockFoundTimestamp ? formatDateYMDHMS(new Date(lastBlockFoundTimestamp * 1000)) : 'N/A';

  return (
    <div className="row">
      <StatCard icon={faUsers} title="Miners Online" value={`${stats.minersTotal?.toString() || '0'} Miners`} />
      <StatCard icon={faTachometerAlt} title="Pool Hashrate" value={formatHashrate(stats.hashrate)} />
      <StatCard icon={faTachometerAlt} title="Network Hashrate" value={formatHashrate(networkHashrate)} />
      <StatCard icon={faGlobe} title="Network Difficulty" value={formatDifficulty(networkDifficulty)} />
      <StatCard 
        icon={faCube} 
        title="Blockchain Height" 
        value={
          <>
            {formatLargeNumber(parseInt(stats.nodes[0]?.height || '0', 10))} Blocks
          </>
        } 
      />
      <StatCard icon={faClock} title="Last Block Found" value={<TimeAgo timestamp={lastBlockFoundTimestamp} agoOnly={true} />} subtext={lastBlockFoundDate} />
      <StatCard icon={faChartPie} title="Round Variance" value={`${roundVariance.toFixed(2)}%`} subtext="Lower is better" />
      <StatCard icon={faHistory} title="Payouts" value="Every 2 hours" />
      <StatCard icon={faHandHoldingUsd} title="Pool Fee" value="1.0%" />
      <StatCard icon={faWallet} title="Minimum Payout" value="0.1 VBC" />
      <StatCard icon={faGift} title="Block Reward" value="8 VBC" />
      <StatCard icon={faExchangeAlt} title="Payment Method" value="PROP" subtext="Stable and profitable pool with regular payouts"/>
    </div>
  );
}
