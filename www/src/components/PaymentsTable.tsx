"use client";
import TimeAgo from "@/components/TimeAgo";
import { Payment } from "@/lib/api";

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="table-responsive">
      <table className="table table-condensed table-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>Address</th>
            <th>Amount</th>
            <th>Tx ID</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td><TimeAgo timestamp={payment.timestamp} /></td>
              <td>
                <a href={`https://explorer.digitalregion.jp/address/${payment.address}`} className="hash" target="_blank" rel="noopener noreferrer">
                  {payment.address}
                </a>
              </td>
              <td>
                {(payment.amount / 1e9).toFixed(4)} VBC
              </td>
              <td>
                <a href={`https://explorer.digitalregion.jp/tx/${payment.tx}`} className="hash" target="_blank" rel="noopener noreferrer">
                  {payment.tx.substring(0, 10)}...{payment.tx.substring(payment.tx.length - 8)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 