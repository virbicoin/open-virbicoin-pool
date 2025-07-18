"use client";

import DashboardStats from "@/components/DashboardStats";
import AccountLookupForm from "@/components/AccountLookupForm";
import { HomeIcon } from "@heroicons/react/24/outline";

interface HomePageClientProps {
  dashboardStats: {
    hashrate: number;
    miners: number;
    workers: number;
    lastBlockFound: number;
    networkHashrate: number;
    networkDifficulty: number;
    blockHeight: number;
    roundVariance: number;
  };
}

const HomePageClient: React.FC<HomePageClientProps> = ({ dashboardStats }) => {
  return (
    <div>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <HomeIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-100">VirBiCoin Mining Pool</h1>
          </div>
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
};

export default HomePageClient;
