"use client";
import useSWR from "swr";
import PaymentsTable from "@/components/PaymentsTable";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PaymentsPage() {
  const { data = {} } = useSWR(API_BASE_URL + "/api/payments", fetcher, { refreshInterval: 5000 });
  const payments = data.payments || [];

  return (
    <div>
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">Payments</h1>
          <p className="text-gray-400">Last 100 network-wide payouts.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-6 text-gray-100">Latest Payouts</h4>
            {payments.length > 0 ? (
              <PaymentsTable payments={payments} />
            ) : (
              <p className="text-gray-400">No payments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}