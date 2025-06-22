"use client";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { formatHashrate } from '@/lib/formatters';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { 
  faWallet, faHourglassHalf, faMoneyBillWave, faCheckCircle, faClock, 
  faUsers, faTachometerAlt, faCube, faPaperPlane, faChartPie, faCalendarAlt, faUser
} from '@fortawesome/free-solid-svg-icons';
import AccountTabs from '@/components/AccountTabs';
import Countdown from '@/components/Countdown';
import TimeAgo from '@/components/TimeAgo';
import { AccountWorker } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

type StatCardProps = {
  title: string;
  value: string | number | React.ReactNode;
  subtext?: string;
  className?: string;
  icon: FontAwesomeIconProps['icon'];
};

function StatCard({ title, value, subtext, icon, className }: StatCardProps) {
  return (
    <div className={`col-md-4 col-sm-6 ${className || ''}`}>
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
}

export default function AccountPage() {
  const params = useParams();
  const address = params.address as string;

  const { data: accountData } = useSWR(address ? API_BASE_URL + `/api/accounts/${address}` : null, fetcher, { refreshInterval: 5000 });
  const { data: statsData } = useSWR(API_BASE_URL + "/api/stats", fetcher, { refreshInterval: 5000 });

  if (!accountData || !accountData.stats) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Account not found</h1>
        </div>
        <p>The account with address {address} was not found on this pool.</p>
      </div>
    );
  }

  const { stats, workers = {}, payments = [], workersOnline, paymentsTotal } = accountData;
  const poolRoundShares = statsData?.stats?.roundShares || 0;
  const yourRoundSharePercent = poolRoundShares > 0 ? (accountData.roundShares || 0 / poolRoundShares) * 100 : 0;
  const currentHeight = statsData?.pools?.virbicoin?.poolStats?.poolHeight || 0;
  const blockTime = statsData?.pools?.virbicoin?.config?.blockTime || 10;
  const epochBlocks = 30000;
  const blocksUntilEpoch = epochBlocks - (currentHeight % epochBlocks);
  const epochSwitchTimestamp = Date.now() + (blocksUntilEpoch * blockTime * 1000);
  const workerList = Object.entries(workers).map(([name, worker]) => ({
    ...(worker as AccountWorker),
    name,
  }));

  return (
    <div>
      <div className="page-header-container">
        <div className="container">
          <h1>
            <FontAwesomeIcon icon={faUser} /> Account Details
          </h1>
          <h4 className="hash">
            <FontAwesomeIcon icon={faWallet} />{' '}
            <a href={`https://explorer.digitalregion.jp/address/${address}`} target="_blank" rel="noopener noreferrer" className="hash">
              {address}
            </a>
          </h4>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <StatCard icon={faHourglassHalf} title="Immature Balance" value={`${(stats.immature / 1e9).toFixed(8)} VBC`} subtext="Awaiting blocks to mature." />
          <StatCard icon={faMoneyBillWave} title="Pending Balance" value={`${(stats.balance / 1e9).toFixed(8)} VBC`} subtext="Credited coins awaiting payout." />
          <StatCard icon={faCheckCircle} title="Total Paid" value={`${(stats.paid / 1e9).toFixed(8)} VBC`} />
        </div>
        <div className="row">
          <StatCard icon={faUsers} title="Workers Online" value={`${workersOnline || 0} Workers`} />
          <StatCard icon={faTachometerAlt} title="Hashrate (30m)" value={formatHashrate(accountData.currentHashrate || 0)} />
          <StatCard icon={faTachometerAlt} title="Hashrate (3h)" value={formatHashrate(accountData.hashrate || 0)} />
        </div>
        <div className="row">
          <StatCard 
            icon={faClock} 
            title="Last Share Submitted" 
            value={<TimeAgo timestamp={stats.lastShare} agoOnly={true} />} 
            subtext={stats.lastShare ? new Date(stats.lastShare * 1000).toLocaleString() : 'N/A'} 
          />
          <StatCard icon={faCube} title="Blocks Found" value={`${stats.blocksFound} Blocks`} />
          <StatCard icon={faPaperPlane} title="Total Payments" value={`${paymentsTotal || 0} Payouts`} />
        </div>
        <div className="row">
          <StatCard icon={faChartPie} title="Your Round Share" value={`${yourRoundSharePercent.toFixed(2)}%`} subtext="Contribution to current round." />
          <StatCard icon={faCalendarAlt} title="Epoch Switch" value={<Countdown to={epochSwitchTimestamp} />} subtext={`In ${blocksUntilEpoch} blocks`} />
        </div>

        <AccountTabs workers={workerList} payments={payments || []} />
      </div>
    </div>
  );
} 