import { getStats } from "@/lib/api";
import AccountLookupForm from "@/components/AccountLookupForm";
import DashboardStats from "@/components/DashboardStats";

function calcNetworkHashrate(difficulty: number, blockTime: number = 10) {
  // Network Hashrate = Difficulty / BlockTime
  if (!difficulty || !blockTime) return 0;
  return difficulty / blockTime;
}

export default async function Home() {
  const stats = await getStats();
  // APIのノード配列から最新のdifficultyとheightを取得
  const latestNode = stats.nodes && stats.nodes.length > 0 ? stats.nodes[0] : null;
  const networkDifficulty = latestNode ? parseFloat(latestNode.difficulty) : (stats.stats?.networkDifficulty || 0);
  const blockHeight = latestNode ? parseInt(latestNode.height) : (stats.stats?.height || 0);
  // blockTimeは10秒で固定（VBC仕様）
  const networkHashrate = calcNetworkHashrate(networkDifficulty, 10);
  const dashboardStats = {
    hashrate: stats.hashrate || 0,
    miners: stats.minersTotal || 0,
    workers: stats.minersTotal || 0,
    lastBlockFound: stats.stats?.lastBlockFound || 0,
    networkHashrate,
    networkDifficulty,
    blockHeight,
    roundVariance: stats.stats?.roundVariance || 0,
  };

  return (
    <div>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Dashboard</h1>
          <p className="text-gray-400">Real-time pool and network statistics.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <DashboardStats stats={dashboardStats} />
        <div className="text-center mt-12">
          <AccountLookupForm />
        </div>
      </div>
    </div>
  );
}
