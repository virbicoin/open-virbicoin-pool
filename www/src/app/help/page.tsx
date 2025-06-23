import Link from "next/link";
import MetaMaskButton from '@/components/MetaMaskButton';

export default function HelpPage() {
  return (
    <div>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Getting Started</h1>
          <p className="text-gray-400">
            Follow these simple steps to start mining VirBiCoin with our pool.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1 Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">1. Get a VirBiCoin Wallet</h3>
            <p className="text-gray-400 mb-4">
              To receive your mining rewards, you&apos;ll need a VirBiCoin wallet. If
              you don&apos;t have one, you can create a secure wallet using official
              or trusted third-party services.
            </p>
            <MetaMaskButton />
          </div>
        </div>

        {/* Step 2 Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">2. Configure Your Mining Software</h3>
            <p className="text-gray-400 mb-4">
              Use your favorite mining software to connect to our pool. Here are
              the stratum server details:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
              <code className="text-gray-300">stratum+tcp://stratum.digitalregion.jp:8002</code>
              <br />
              <strong className="text-gray-300">Username:</strong> <span className="text-gray-400">Your VirBiCoin wallet address</span>
              <br />
              <strong className="text-gray-300">Password:</strong> <span className="text-gray-400">x (or any)</span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-gray-100">Mining software</h4>
            <p className="text-gray-400 mb-4">
              For Nvidia GPUs we recommend T-Rex and for AMD GPUs we recommend
              TeamRedMiner.
            </p>
            <pre className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700 text-gray-300 overflow-x-auto">
              <code>
                t-rex -a ethash -o stratum+tcp://stratum.digitalregion.jp:8002 -u
                YOUR_ADDRESS -w WORKER_NAME
              </code>
            </pre>
            <pre className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-gray-300 overflow-x-auto">
              <code>
                teamredminer -a ethash -o
                stratum+tcp://stratum.digitalregion.jp:8002 -u
                YOUR_ADDRESS.WORKER_NAME -p x
              </code>
            </pre>
          </div>
        </div>

        {/* Step 3 Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">
              3. Start Mining &amp; Monitor Your Progress
            </h3>
            <p className="text-gray-400 mb-4">
              Once your miner is configured, run it to start mining. You can
              monitor your hashrate, earnings, and payout status on our
              dashboard by looking up your wallet address.
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors" style={{ color: '#fff' }}>
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Payouts Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Payouts</h3>
            <p className="text-gray-400">
              Payouts are sent automatically every 2 hours for all balances
              above <strong className="text-gray-300">0.1 VBC</strong>.
            </p>
          </div>
        </div>

        {/* Advanced Connection Details Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Advanced Connection Details</h3>
            <h4 className="text-lg font-semibold mb-2 text-gray-100">Static Difficulty Ports</h4>
            <p className="text-gray-400 mb-4">
              For miners who prefer to set a static difficulty, you can connect
              using the following ports:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
              <dl className="flex flex-col gap-2">
                <div>
                  <dt className="text-gray-300 font-medium">Port 8002:</dt>
                  <dd className="text-gray-400">Difficulty 2G (Default)</dd>
                </div>
                <div>
                  <dt className="text-gray-300 font-medium">Port 8004:</dt>
                  <dd className="text-gray-400">Difficulty 4G</dd>
                </div>
                <div>
                  <dt className="text-gray-300 font-medium">Port 8009:</dt>
                  <dd className="text-gray-400">Difficulty 9G</dd>
                </div>
              </dl>
            </div>

            <h4 className="text-lg font-semibold mb-2 text-gray-100">NiceHash Configuration</h4>
            <p className="text-gray-400 mb-4">To connect using NiceHash, use the following settings:</p>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <dl className="flex flex-col gap-2">
                <div>
                  <dt className="text-gray-300 font-medium">Algorithm:</dt>
                  <dd className="text-gray-400">
                    <code className="text-gray-300">Ethash</code>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-300 font-medium">Stratum Host:</dt>
                  <dd className="text-gray-400">
                    <code className="text-gray-300">stratum.digitalregion.jp</code>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-300 font-medium">Port:</dt>
                  <dd className="text-gray-400">
                    <code className="text-gray-300">8009</code>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-300 font-medium">Username:</dt>
                  <dd className="text-gray-400">
                    <code className="text-gray-300">Your VirBiCoin Wallet Address</code>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-300 font-medium">Password:</dt>
                  <dd className="text-gray-400">
                    <code className="text-gray-300">x</code>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 