import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { getStats } from "@/lib/api";
import AccountLookupForm from "@/components/AccountLookupForm";
import DashboardStats from "@/components/DashboardStats";

export default async function Home() {
  const stats = await getStats();

  return (
    <div>
      <div className="page-header-container">
        <div className="container">
          <h1>
            <FontAwesomeIcon icon={faGaugeHigh} /> Dashboard
          </h1>
          <p className="text-muted">Real-time pool and network statistics.</p>
        </div>
      </div>

      <main className="container">
        <h1 className="text-center" style={{ margin: '20px 0 40px' }}>Pool Stats</h1>
        <DashboardStats initialStats={stats} />
        <div className="text-center" style={{ marginTop: '20px' }}>
          <h2>Lookup Account</h2>
          <AccountLookupForm />
        </div>
      </main>
    </div>
  );
}
