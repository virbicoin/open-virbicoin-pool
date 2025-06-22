"use client";

import { faCubes, faUsers } from '@fortawesome/free-solid-svg-icons';
import ActiveLink from '@/components/ActiveLink';
import useSWR from "swr";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

const HeaderStats = () => {
  const { data: stats } = useSWR(API_BASE_URL + "/api/stats", fetcher, { refreshInterval: 5000 });
  const immatureCount = stats?.immatureTotal ?? 0;
  const pendingCount = stats?.candidatesTotal ?? 0;
  const minersTotal = stats?.minersTotal ?? 0;
  const poolBlocksBadge = immatureCount + pendingCount;

  return <>
    <ActiveLink href="/blocks" icon={faCubes}>
      Pool Blocks
      {poolBlocksBadge > 0 && (
        <span className="badge" style={{ background: '#4caf50', marginLeft: 6, fontSize: '80%', verticalAlign: 'top' }}>{poolBlocksBadge}</span>
      )}
    </ActiveLink>
    <ActiveLink href="/miners" icon={faUsers}>
      Miners
      {minersTotal > 0 && (
        <span className="badge" style={{ background: '#337ab7', marginLeft: 6, fontSize: '80%', verticalAlign: 'top' }}>{minersTotal}</span>
      )}
    </ActiveLink>
  </>;
};

export default HeaderStats; 