import { getStats } from "@/lib/api";
import HomePageClient from "@/components/HomePageClient";

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
  
  // データの妥当性チェック - 無効なデータの場合は空のオブジェクトを渡す
  const isDataValid = networkHashrate > 1e9 && networkDifficulty > 1e6; // 最低1GH/s, 1M difficulty
  
  const dashboardStats = isDataValid ? {
    hashrate: stats.hashrate || 0,
    miners: stats.minersTotal || 0,
    workers: stats.minersTotal || 0,
    lastBlockFound: stats.stats?.lastBlockFound || 0,
    networkHashrate,
    networkDifficulty,
    blockHeight,
    roundVariance: stats.stats?.roundVariance || 0,
  } : {
    hashrate: 0,
    miners: 0,
    workers: 0,
    lastBlockFound: 0,
    networkHashrate: 0,
    networkDifficulty: 0,
    blockHeight: 0,
    roundVariance: 0,
  };

  return <HomePageClient dashboardStats={dashboardStats} />;
}
