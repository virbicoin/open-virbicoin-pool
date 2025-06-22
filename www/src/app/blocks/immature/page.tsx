"use client";
import useSWR from "swr";
import BlocksTable from "@/components/BlocksTable";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ImmatureBlocksPage() {
  const { data = {} } = useSWR(API_BASE_URL + "/api/blocks", fetcher, { refreshInterval: 5000 });
  const immatureBlocks = data.immature || [];

  return (
    <div>
      {immatureBlocks.length > 0 ? (
        <>
          <h4>Immature Blocks</h4>
          <BlocksTable blocks={immatureBlocks} type="immature" />
        </>
      ) : (
        <h3>No immature blocks yet</h3>
      )}
    </div>
  );
} 