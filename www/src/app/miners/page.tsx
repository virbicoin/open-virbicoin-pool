"use client";

import useSWR from "swr";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
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
      <div className="page-header-container">
        <div className="container">
          <h1><FontAwesomeIcon icon={faUsers} /> Miners</h1>
          <p className="text-muted">List of all active miners in the pool ({minersArray.length} total).</p>
        </div>
      </div>
      <div className="container">
        <div className="panel card">
          <div className="panel-body">
            <h4>Active Miners</h4>
            <div className="tab-content" style={{ marginTop: '20px' }}>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Hashrate</th>
                      <th>Last Beat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMiners.map((miner) => (
                      <tr key={miner.miner} className={miner.offline ? 'danger' : ''}>
                        <td>
                          <Link href={`/account/${miner.miner}`} className="hash">
                            {miner.miner}
                          </Link>
                        </td>
                        <td>{formatHashrate(miner.hr)}</td>
                        <td><TimeAgo timestamp={miner.lastBeat} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 