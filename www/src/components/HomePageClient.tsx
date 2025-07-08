"use client";

import DashboardStats from "@/components/DashboardStats";
import AccountLookupForm from "@/components/AccountLookupForm";

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
};

export default HomePageClient;
