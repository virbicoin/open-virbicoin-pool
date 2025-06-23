"use client";
import useSWR from "swr";
import BlocksTable from "@/components/BlocksTable";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PendingBlocksPage() {
  const { data: blocksData = {} } = useSWR(API_BASE_URL + "/api/blocks", fetcher, { refreshInterval: 5000 });
  const pendingBlocks = blocksData.candidates || [];
  return (
    <div className="container mx-auto px-4 py-2">
      {pendingBlocks.length > 0 ? (
        <>
          <h4 className="text-xl font-semibold mb-6 text-gray-100">Pending Blocks</h4>
          <BlocksTable blocks={pendingBlocks} type="pending" />
        </>
      ) : (
        <h3 className="text-xl font-semibold text-gray-100">No pending blocks yet</h3>
      )}
    </div>
  );
}