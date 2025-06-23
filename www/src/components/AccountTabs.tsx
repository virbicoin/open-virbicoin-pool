'use client';

import { useState } from 'react';
import { AccountWorker, AccountPayment } from '@/lib/api';
import { formatHashrate } from '@/lib/formatters';
import TimeAgo from './TimeAgo';

type AccountTabsProps = {
  workers: AccountWorker[];
  payments: AccountPayment[];
};

const AccountTabs = ({ workers, payments }: AccountTabsProps) => {
  const [activeTab, setActiveTab] = useState('workers');

  return (
    <div>
      <ul className="nav nav-tabs">
        <li className={activeTab === 'workers' ? 'active' : ''}>
          <a onClick={() => setActiveTab('workers')} style={{ cursor: 'pointer' }}>
            Workers <span className="badge" style={{ background: '#4caf50' }}>{workers.length}</span>
          </a>
        </li>
        <li className={activeTab === 'payouts' ? 'active' : ''}>
          <a onClick={() => setActiveTab('payouts')} style={{ cursor: 'pointer' }}>
            Payouts <span className="badge" style={{ background: '#337ab7' }}>{payments.length}</span>
          </a>
        </li>
      </ul>

      <div className="tab-content" style={{ marginTop: '20px' }}>
        {activeTab === 'workers' && (
          <div className="tab-pane active">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Hashrate</th>
                    <th>Avg Hashrate (1h)</th>
                    <th>Last Share</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker.name} className={worker.offline ? 'danger' : ''}>
                      <td>{worker.name}</td>
                      <td>{formatHashrate(worker.hr)}</td>
                      <td>{formatHashrate(worker.hr2)}</td>
                      <td><TimeAgo timestamp={worker.lastBeat} /></td>
                      <td>{worker.offline ? 'Offline' : 'Online'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="tab-pane active">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Tx ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payout) => (
                    <tr key={payout.tx}>
                      <td>{new Date(payout.timestamp * 1000).toLocaleString()}</td>
                      <td>{(payout.amount / 1e9).toFixed(4)} VBC</td>
                      <td>
                        <a href={`https://explorer.digitalregion.jp/tx/${payout.tx}`} className="hash" target="_blank" rel="noopener noreferrer">
                          {payout.tx.substring(0, 10)}...{payout.tx.substring(payout.tx.length - 8)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTabs; 