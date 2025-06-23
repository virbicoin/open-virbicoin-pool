import { getPayments } from "@/lib/api";
import PaymentsTable from "@/components/PaymentsTable";

export default async function PaymentsPage() {
  const data = await getPayments();
  const payments = data.payments || [];

  return (
    <div>
      <div className="page-header-container">
        <div className="container">
          <h1>Payments</h1>
          <p className="text-muted">Last 100 network-wide payouts.</p>
        </div>
      </div>

      <div className="container">
        <div className="panel card">
          <div className="panel-body">
            <h4>Latest Payouts</h4>
            <div className="tab-content" style={{ marginTop: '20px' }}>
              {payments.length > 0 ? (
                <PaymentsTable payments={payments} />
              ) : (
                <p>No payments found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}