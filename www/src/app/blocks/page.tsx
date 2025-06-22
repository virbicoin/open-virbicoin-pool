"use client";
import useSWR from "swr";
import BlocksTable from "@/components/BlocksTable";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BlocksPage() {
  const { data: blocksData = {} } = useSWR(API_BASE_URL + "/api/blocks", fetcher, { refreshInterval: 5000 });
  const maturedBlocks = blocksData.matured || [];
  return (
    <div>
      {maturedBlocks.length > 0 ? (
        <>
          <h4>Matured Blocks</h4>
          <BlocksTable blocks={maturedBlocks} type="matured" />
        </>
      ) : (
        <h3>No matured blocks yet</h3>
      )}
    </div>
  );
} 