"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useauth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Receipt = {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  payment_method: string;
  created_at: string;
};

export default function DashboardPage() {
  const { loading: authLoading } = useAuth();
  const router = useRouter();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
const [receiptLimit, setReceiptLimit] = useState(10);
const [receiptUsed, setReceiptUsed] = useState(0);
const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const { data: profile } = await supabase
  .from("profiles")
  .select("plan, receipt_limit, receipt_used, premium_until")
  .eq("id", user.id)
  .single();

if (profile) {
  setPlan(profile.plan);
  setReceiptLimit(profile.receipt_limit);
  setReceiptUsed(profile.receipt_used);
  setPremiumUntil(profile.premium_until);
}

  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!error) {
    setReceipts(data || []);
  }

  setLoading(false);
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        Loading...
      </div>
    );
  }

  const totalReceipts = receipts.length;

  const totalAmount = receipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );

  const premiumActive =
  plan === "premium" &&
  premiumUntil &&
  new Date(premiumUntil) > new Date();

const remainingReceipts = premiumActive
  ? "Unlimited"
  : Math.max(0, receiptLimit - receiptUsed);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar
  open={sidebarOpen}
  setOpen={setSidebarOpen}
/>

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">

  <button
    onClick={() => setSidebarOpen(true)}
    className="bg-white shadow rounded-xl p-3 hover:bg-slate-100 transition"
  >
    ☰
  </button>

  <div></div>

</div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back to Receiptly
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mt-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">
              Total Receipts
            </h2>

            <p className="text-4xl font-bold mt-3">
              {totalReceipts}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">
              Total Amount
            </h2>

            <p className="text-3xl font-bold mt-3 text-green-600">
              ₦{totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
  <h2 className="text-gray-500">
    Subscription
  </h2>

  <p
    className={`text-2xl font-bold mt-3 ${
      plan === "premium"
        ? "text-green-600"
        : "text-blue-600"
    }`}
  >
    {premiumActive
  ? "Premium Plan"
  : "Free Plan"}
  </p>

  {premiumActive ? (
    <>
      <div className="mt-3 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-center font-semibold">
        ✔ Premium Active
      </div>
      {premiumUntil && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Expires on {new Date(premiumUntil).toLocaleDateString()}
        </p>
      )}
    </>
  ) : (
    <Link href="/subscription">
      <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
        Upgrade to Premium
      </button>
    </Link>
  )}
</div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">
              Remaining Free Receipts
            </h2>

            <p className="text-4xl font-bold mt-3 text-orange-600">
  {remainingReceipts}
</p>

{plan === "free" && (
  <p className="text-sm text-gray-500 mt-2">
    {receiptUsed} of {receiptLimit} receipts used
  </p>
)}
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              Recent Receipts
            </h2>

            <Link href="/receipt-history">
              <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg">
                View All
              </button>
            </Link>
          </div>

          {receipts.length === 0 ? (
            <p className="text-gray-500">
              No receipts yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-slate-200">
                    <th className="text-left p-3">Sender</th>
                    <th className="text-left p-3">Receiver</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Method</th>
                    <th className="text-left p-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {receipts.slice(0, 5).map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-3">
                        {receipt.sender}
                      </td>

                      <td className="p-3">
                        {receipt.receiver}
                      </td>

                      <td className="p-3">
                        ₦{receipt.amount.toLocaleString()}
                      </td>

                      <td className="p-3">
                        {receipt.payment_method}
                      </td>

                      <td className="p-3">
                        {new Date(
                          receipt.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}