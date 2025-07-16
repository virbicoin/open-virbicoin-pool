import { getStats } from '@/lib/api';
import BlocksTabs from "@/components/BlocksTabs";
import { CubeIcon } from "@heroicons/react/24/outline";

export default async function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getStats();
  return (
    <div>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <CubeIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-100">Pool Blocks</h1>
          </div>
          <p className="text-gray-400">
            Full block rewards, including TX fees and uncle rewards, are always
            paid out.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4">
            <BlocksTabs />
          </div>
          <div className="p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 