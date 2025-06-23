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
    <div className="flex space-x-4 border-b border-gray-700">
      <Link
        href="/blocks"
        className={`tab-link px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
          path === "/blocks"
            ? "tab-link-active border-blue-400 text-blue-400"
            : "tab-link-inactive border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
        }`}
      >
        Matured
        {maturedCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-900 text-blue-200 border border-blue-700">
            {maturedCount}
          </span>
        )}
      </Link>
      <Link
        href="/blocks/immature"
        className={`tab-link px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
          path === "/blocks/immature"
            ? "tab-link-active border-green-400 text-green-400"
            : "tab-link-inactive border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
        }`}
      >
        Immature
        {immatureCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-900 text-green-200 border border-green-700">
            {immatureCount}
          </span>
        )}
      </Link>
      <Link
        href="/blocks/pending"
        className={`tab-link px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
          path === "/blocks/pending"
            ? "tab-link-active border-cyan-400 text-cyan-400"
            : "tab-link-inactive border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
        }`}
      >
        Pending
        {pendingCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-900 text-cyan-200 border border-cyan-700">
            {pendingCount}
          </span>
        )}
      </Link>
    </div>
  );
} 