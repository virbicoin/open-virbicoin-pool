import { getStats } from '@/lib/api';
import BlocksTabs from "@/components/BlocksTabs";

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
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Pool Blocks</h1>
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