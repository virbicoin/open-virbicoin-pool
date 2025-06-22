"use client";

import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BlocksTabs() {
  const { data: stats } = useSWR(API_BASE_URL + "/api/stats", fetcher, { refreshInterval: 5000 });
  const maturedCount = stats?.maturedTotal ?? 0;
  const immatureCount = stats?.immatureTotal ?? 0;
  const pendingCount = stats?.candidatesTotal ?? 0;

  const path = usePathname();

  return (
    <ul className="nav nav-tabs">
      <li className={path === "/blocks" ? "active" : ""}>
        <Link href="/blocks">
          Matured <span className="badge" style={{ background: "#337ab7", marginLeft: 4 }}>{maturedCount}</span>
        </Link>
      </li>
      <li className={path === "/blocks/immature" ? "active" : ""}>
        <Link href="/blocks/immature">
          Immature <span className="badge" style={{ background: "#4caf50", marginLeft: 4 }}>{immatureCount}</span>
        </Link>
      </li>
      <li className={path === "/blocks/pending" ? "active" : ""}>
        <Link href="/blocks/pending">
          Pending <span className="badge" style={{ background: "#5bc0de", marginLeft: 4 }}>{pendingCount}</span>
        </Link>
      </li>
    </ul>
  );
} 