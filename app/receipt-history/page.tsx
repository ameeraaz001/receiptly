"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { generateReceiptPdf } from "@/utils/genearatepdf";

type Receipt = {
  id: number;
  receipt_number: string;
  sender: string;
  receiver: string;
  amount: number;
  payment_method: string;
  description: string;
  created_at: string;
};

export default function ReceiptHistoryPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReceipts = async () => {
      const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

const { data, error } = await supabase
  .from("receipts")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setReceipts(data || []);
      setLoading(false);
    };

    fetchReceipts();
  }, []);
  <div className="flex justify-between items-center mb-6">

  <h1 className="text-3xl font-bold">
    Receipt History
  </h1>

  <input
    type="text"
    placeholder="Search receipts..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-lg px-4 py-2 w-72 text-black"
  />

</div>
const filteredReceipts = receipts.filter((receipt) => {
  const query = search.toLowerCase();

  return (
    receipt.sender.toLowerCase().includes(query) ||
    receipt.receiver.toLowerCase().includes(query) ||
    receipt.receipt_number.toLowerCase().includes(query)
  );
});
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        

        {loading ? (
          <p>Loading receipts...</p>
        ) : receipts.length === 0 ? (
          <p>No receipts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-200">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Sender</th>
                  <th className="p-3 text-left">Receiver</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b">
                    <td className="p-3">
                      {receipt.receipt_number}
                    </td>

                    <td className="p-3">
                      {receipt.sender}
                    </td>

                    <td className="p-3">
                      {receipt.receiver}
                    </td>

                    <td className="p-3">
                      ₦{receipt.amount}
                    </td>

                    <td className="p-3">
                      {receipt.payment_method}
                    </td>

                    <td className="p-3">
                      {new Date(receipt.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">

                        <Link
                          href={`/receipts/${receipt.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          View
                        </Link>
                        <Link
  href={`/edit-receipt/${receipt.id}`}
  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
>
  Edit
</Link>

                        <button
                          onClick={() =>
  generateReceiptPdf(
    receipt.receipt_number,
    receipt.sender,
    receipt.receiver,
    receipt.amount.toString(),
    receipt.payment_method,
    receipt.description,
    receipt.created_at
  )
}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Download
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}