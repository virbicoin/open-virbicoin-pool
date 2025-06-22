import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faChartLine,
  faWallet,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import MetaMaskButton from '@/components/MetaMaskButton';

export default function HelpPage() {
  return (
    <div>
      <div className="page-header-container">
        <div className="container">
          <h1>
            <FontAwesomeIcon icon={faRocket} /> Getting Started
          </h1>
          <p className="text-muted">
            Follow these simple steps to start mining VirBiCoin with our pool.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Step 1 Card */}
        <div className="panel card">
          <div className="panel-heading">
            <h3 className="panel-title">1. Get a VirBiCoin Wallet</h3>
          </div>
          <div className="panel-body">
            <p>
              To receive your mining rewards, you&apos;ll need a VirBiCoin wallet. If
              you don&apos;t have one, you can create a secure wallet using official
              or trusted third-party services.
            </p>
            <MetaMaskButton />
          </div>
        </div>

        {/* Step 2 Card */}
        <div className="panel card">
          <div className="panel-heading">
            <h3 className="panel-title">2. Configure Your Mining Software</h3>
          </div>
          <div className="panel-body">
            <p>
              Use your favorite mining software to connect to our pool. Here are
              the stratum server details:
            </p>
            <div className="note note-info">
              <code>stratum+tcp://stratum.digitalregion.jp:8002</code>
              <br />
              <strong>Username:</strong> Your VirBiCoin wallet address
              <br />
              <strong>Password:</strong> x (or any)
            </div>
            <h4>Mining software</h4>
            <p>
              For Nvidia GPUs we recommend T-Rex and for AMD GPUs we recommend
              TeamRedMiner.
            </p>
            <pre>
              <code>
                t-rex -a ethash -o stratum+tcp://stratum.digitalregion.jp:8002 -u
                YOUR_ADDRESS -w WORKER_NAME
              </code>
            </pre>
            <pre>
              <code>
                teamredminer -a ethash -o
                stratum+tcp://stratum.digitalregion.jp:8002 -u
                YOUR_ADDRESS.WORKER_NAME -p x
              </code>
            </pre>
          </div>
        </div>

        {/* Step 3 Card */}
        <div className="panel card">
          <div className="panel-heading">
            <h3 className="panel-title">
              3. Start Mining &amp; Monitor Your Progress
            </h3>
          </div>
          <div className="panel-body">
            <p>
              Once your miner is configured, run it to start mining. You can
              monitor your hashrate, earnings, and payout status on our
              dashboard by looking up your wallet address.
            </p>
            <Link href="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faChartLine} /> Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Payouts Card */}
        <div className="panel card">
          <div className="panel-heading">
            <h3 className="panel-title">
              <FontAwesomeIcon icon={faWallet} /> Payouts
            </h3>
          </div>
          <div className="panel-body">
            <p>
              Payouts are sent automatically every 2 hours for all balances
              above <strong>0.5 VBC</strong>, or <strong>0.1 VBC</strong> if you
              have been mining for more than 7 days and your balance is
              non-zero. The pool covers all transaction fees.
            </p>
          </div>
        </div>

        {/* Advanced Connection Details Card */}
        <div className="panel card">
          <div className="panel-heading">
            <h3 className="panel-title">
              <FontAwesomeIcon icon={faCogs} /> Advanced Connection Details
            </h3>
          </div>
          <div className="panel-body">
            <h4>Static Difficulty Ports</h4>
            <p>
              For miners who prefer to set a static difficulty, you can connect
              using the following ports:
            </p>
            <div className="note">
              <dl className="dl-horizontal">
                <dt>Port 8002:</dt> <dd>Difficulty 2G (Default)</dd>
                <dt>Port 8004:</dt> <dd>Difficulty 4G</dd>
                <dt>Port 8009:</dt> <dd>Difficulty 9G</dd>
              </dl>
            </div>

            <hr />

            <h4>NiceHash Configuration</h4>
            <p>To connect using NiceHash, use the following settings:</p>
            <div className="note">
              <dl className="dl-horizontal">
                <dt>Algorithm:</dt> <dd>
                  <code>Ethash</code>
                </dd>
                <dt>Stratum Host:</dt> <dd>
                  <code>stratum.digitalregion.jp</code>
                </dd>
                <dt>Port:</dt> <dd>
                  <code>8009</code>
                </dd>
                <dt>Username:</dt> <dd>
                  <code>Your VirBiCoin Wallet Address</code>
                </dd>
                <dt>Password:</dt> <dd>
                  <code>x</code>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 