"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import router from "next/router";
import { error } from "console";

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  role: string;
  receipt_limit: number;
  receipt_used: number;
  premium_until: string | null;
  created_at: string;
  avatar_url: string | null;
};
type UserReceipt = {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  payment_method: string;
  created_at: string;
};
type Payment = {
  id: number;
  user_id: string;
  email: string | null;
  reference: string;
  amount: number;
  plan: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    premium: 0,
    receipts: 0,
  });

  const [users, setUsers] = useState<UserProfile[]>([]);
const [selectedUser, setSelectedUser] =
  useState<UserProfile | null>(null);
  const [userReceipts, setUserReceipts] = useState<UserReceipt[]>([]);
const [receiptsLoading, setReceiptsLoading] = useState(false);
const [payments, setPayments] = useState<Payment[]>([]);
const [totalRevenue, setTotalRevenue] = useState(0);
const [totalPayments, setTotalPayments] = useState(0);

const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
const filteredUsers = users.filter((user) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    user.full_name?.toLowerCase().includes(searchText) ||
    user.email.toLowerCase().includes(searchText);

  const matchesFilter =
    filter === "all" ||
    (filter === "premium" && user.plan === "premium") ||
    (filter === "free" && user.plan === "free") ||
    (filter === "admin" && user.role === "admin");

  return matchesSearch && matchesFilter;
});

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      router.push("/dashboard");
      return;
    }

    // Only your account can access the admin panel
    if (
      profile.role !== "admin" ||
      user.email !== "ameenusaeed001@gmail.com"
    ) {
      router.push("/dashboard");
      return;
    }

    await loadStats();
  }

  async function loadStats() {
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { data: premiumUsers } = await supabase
  .from("profiles")
  .select("premium_until")
  .eq("plan", "premium");

const premium =
  premiumUsers?.filter(
    (user) =>
      user.premium_until &&
      new Date(user.premium_until) > new Date()
  ).length || 0;

    const { count: totalReceipts } = await supabase
      .from("receipts")
      .select("*", {
        count: "exact",
        head: true,
      });
      const { data: paymentsList, error: paymentsError } =
  await supabase
    .from("payments")
    .select("*")
    .eq("status", "success")
    .order("created_at", {
      ascending: false,
    });

if (paymentsError) {
  console.error(
    "Payments error:",
    paymentsError
  );
}

const paymentRows = paymentsList || [];

const revenue = paymentRows.reduce(
  (sum, payment) =>
    sum + Number(payment.amount || 0),
  0
);

setPayments(paymentRows);
setTotalPayments(paymentRows.length);
setTotalRevenue(revenue);

    const { data: usersList, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Users error:", error);
    }

    setStats({
    users: totalUsers || 0,
      premium: premium,
      receipts: totalReceipts || 0,
    });

    setUsers(usersList || []);
    setLoading(false);
  }
  async function loadUserReceipts(userId: string) {
  setReceiptsLoading(true);

  const { data, error } = await supabase
    .from("receipts")
    .select(
      "id, sender, receiver, amount, payment_method, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Receipts error:", error);
    alert(error.message);
    setUserReceipts([]);
  } else {
    setUserReceipts(data || []);
  }

  setReceiptsLoading(false);
}

  async function upgradeUser(userId: string) {
    const premiumUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error } = await supabase
      .from("profiles")
      .update({
        plan: "premium",
        receipt_limit: 999999,
        premium_until: premiumUntil,
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("User upgraded to Premium for 30 days.");

    setSelectedUser(null);
    await loadStats();
  }

  async function downgradeUser(userId: string) {
    const { error } = await supabase
      .from("profiles")
      .update({
  plan: "free",
  receipt_limit: 5,
  premium_until: null,
})
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("User downgraded to Free.");

    setSelectedUser(null);
    await loadStats();
  }

  async function makeAdmin(userId: string) {
    const { error } = await supabase
      .from("profiles")
      .update({
        role: "admin",
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("User is now an admin.");

    setSelectedUser(null);
    await loadStats();
  }

  async function removeAdmin(userId: string) {
    const { error } = await supabase
      .from("profiles")
      .update({
        role: "user",
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Admin role removed.");

    setSelectedUser(null);
    await loadStats();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-400">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="text-blue-500">
                Receipt
              </span>
              ly Admin
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Platform administration dashboard
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {/* MAIN CONTENT */}

      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* PAGE TITLE */}

        <div className="mb-8">

          <p className="text-blue-500 font-semibold text-sm">
            ADMINISTRATION
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Dashboard Overview
          </h2>

          <p className="text-slate-400 mt-2">
            Monitor users, subscriptions and receipts.
          </p>

        </div>

        {/* STATISTICS */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* USERS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500">
                  Total Users
                </p>

                <p className="text-4xl font-bold mt-3">
                  {stats.users}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                👥
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-5">
              Registered accounts
            </p>

          </div>

          {/* PREMIUM */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500">
                  Premium Users
                </p>

                <p className="text-4xl font-bold text-green-400 mt-3">
                  {stats.premium}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                ⭐
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-5">
              Active premium accounts
            </p>

          </div>

          {/* RECEIPTS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500">
                  Receipts Generated
                </p>

                <p className="text-4xl font-bold text-blue-400 mt-3">
                  {stats.receipts}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                🧾
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-5">
              Total receipts created
            </p>

          </div>

        </div>
        {/* PAYMENT STATISTICS */}

<div className="grid md:grid-cols-2 gap-6 mt-6">

  {/* REVENUE */}

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-slate-500">
          Total Revenue
        </p>

        <p className="text-4xl font-bold text-emerald-400 mt-3">
          ₦{(totalRevenue / 100).toLocaleString()}
        </p>

      </div>

      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
        💰
      </div>

    </div>

    <p className="text-xs text-slate-500 mt-5">
      Successful Paystack payments
    </p>

  </div>


  {/* PAYMENTS */}

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-slate-500">
          Successful Payments
        </p>

        <p className="text-4xl font-bold text-purple-400 mt-3">
          {totalPayments}
        </p>

      </div>

      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
        💳
      </div>

    </div>

    <p className="text-xs text-slate-500 mt-5">
      Completed Premium purchases
    </p>

  </div>

</div>

        {/* USERS TABLE */}

        <section className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-2xl font-bold">
              User Management
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Manage Receiptly accounts and subscriptions.
            </p>
            <div className="flex flex-col md:flex-row gap-3 mt-6">

  <input
    type="text"
    placeholder="Search users by name or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    className="bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
  >
    <option value="all">
      All Users
    </option>

    <option value="premium">
      Premium
    </option>

    <option value="free">
      Free
    </option>

    <option value="admin">
      Admins
    </option>
  </select>

</div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              <thead className="bg-slate-950">

                <tr className="text-left text-sm text-slate-500">

                  <th className="px-6 py-4">
                    User
                  </th>

                  <th className="px-6 py-4">
                    Plan
                  </th>

                  <th className="px-6 py-4">
                    Role
                  </th>

                  <th className="px-6 py-4">
                    Receipts
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-t border-slate-800 hover:bg-slate-800/50"
                  >

                    {/* USER */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">

                          {user.full_name
                            ? user.full_name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}

                        </div>

                        <div>

                          <p className="font-semibold">
                            {user.full_name ||
                              "Unnamed User"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* PLAN */}

                    <td className="px-6 py-4">

                      {user.plan === "premium" ? (

                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ Premium
                        </span>

                      ) : (

                        <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                          Free
                        </span>

                      )}

                    </td>

                    {/* ROLE */}

                    <td className="px-6 py-4">

                      {user.role === "admin" ? (

                        <span className="text-purple-400 font-semibold">
                          👑 Admin
                        </span>

                      ) : (

                        <span className="text-slate-400">
                          User
                        </span>

                      )}

                    </td>

                    {/* RECEIPTS */}

                    <td className="px-6 py-4 text-slate-300">
                      {user.receipt_used || 0}
                    </td>

                    {/* MANAGE */}

                    <td className="px-6 py-4">

                      
                      <button
  onClick={() => {
    setSelectedUser(user);
    loadUserReceipts(user.id);
  }}
  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
>
  Manage
</button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {filteredUsers.length === 0 && (
  <div className="p-10 text-center text-slate-500">
    No users match your search.
  </div>
)}

        </section>
        {/* PAYSTACK TRANSACTIONS */}

<section className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

  <div className="p-6 border-b border-slate-800">

    <div className="flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold">
          Paystack Transactions
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          Recent successful Premium payments.
        </p>

      </div>

      <div className="bg-green-500/10 text-green-400 px-3 py-2 rounded-lg text-sm font-semibold">
        {payments.length} Payments
      </div>

    </div>

  </div>


  {payments.length === 0 ? (

    <div className="p-10 text-center">

      <div className="text-4xl mb-3">
        💳
      </div>

      <p className="text-slate-400">
        No successful payments yet.
      </p>

      <p className="text-slate-600 text-sm mt-2">
        Paystack transactions will appear here
        after a successful Premium purchase.
      </p>

    </div>

  ) : (

    <div className="overflow-x-auto">

      <table className="w-full min-w-[800px]">

        <thead className="bg-slate-950">

          <tr className="text-left text-sm text-slate-500">

            <th className="px-6 py-4">
              Customer
            </th>

            <th className="px-6 py-4">
              Amount
            </th>

            <th className="px-6 py-4">
              Reference
            </th>

            <th className="px-6 py-4">
              Plan
            </th>

            <th className="px-6 py-4">
              Date
            </th>

            <th className="px-6 py-4">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {payments.slice(0, 20).map((payment) => (

            <tr
              key={payment.id}
              className="border-t border-slate-800 hover:bg-slate-800/50"
            >

              <td className="px-6 py-4">

                <p className="font-semibold">
                  {payment.email || "Unknown"}
                </p>

              </td>


              <td className="px-6 py-4">

                <span className="font-bold text-green-400">
                  ₦{(
                    Number(payment.amount) / 100
                  ).toLocaleString()}
                </span>

              </td>


              <td className="px-6 py-4">

                <span className="text-xs text-slate-400 font-mono">
                  {payment.reference}
                </span>

              </td>


              <td className="px-6 py-4">

                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                  Premium
                </span>

              </td>


              <td className="px-6 py-4 text-sm text-slate-400">

                {new Date(
                  payment.created_at
                ).toLocaleDateString()}

              </td>


              <td className="px-6 py-4">

                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ Successful
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

</section>

      </div>

      {/* MANAGE USER MODAL */}

      {selectedUser && (

        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-7 w-full max-w-md shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Manage User
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Account controls
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                ✕
              </button>

            </div>

            {/* USER INFO */}

            <div className="bg-slate-950 rounded-xl p-4 mb-6">

              <p className="font-semibold">
                {selectedUser.full_name ||
                  "Unnamed User"}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {selectedUser.email}
              </p>

              <div className="flex gap-2 mt-4">

                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs">
                  {selectedUser.plan}
                </span>

                <span className="bg-slate-800 px-3 py-1 rounded-full text-xs">
                  {selectedUser.role}
                </span>

              </div>

            </div>
            {/* USER STATISTICS */}

<div className="grid grid-cols-2 gap-3 mb-6">

  <div className="bg-slate-950 rounded-xl p-4">
    <p className="text-xs text-slate-500">
      Receipts Used
    </p>

    <p className="text-2xl font-bold mt-1">
      {selectedUser.receipt_used || 0}
    </p>
  </div>

  <div className="bg-slate-950 rounded-xl p-4">
    <p className="text-xs text-slate-500">
      Receipt Limit
    </p>

    <p className="text-2xl font-bold mt-1">
      {selectedUser.plan === "premium"
        ? "∞"
        : selectedUser.receipt_limit}
    </p>
  </div>

</div>

<div className="bg-slate-950 rounded-xl p-4 mb-6">

  <p className="text-xs text-slate-500">
    Member Since
  </p>

  <p className="font-semibold mt-1">
    {new Date(
      selectedUser.created_at
    ).toLocaleDateString()}
  </p>

</div>
{selectedUser.plan === "premium" &&
  selectedUser.premium_until && (
    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">

      <p className="text-xs text-green-400">
        Premium Expiry
      </p>

      <p className="font-semibold text-green-300 mt-1">
        {new Date(
          selectedUser.premium_until
        ).toLocaleDateString()}
      </p>

      <p className="text-xs text-green-500 mt-1">
        {new Date(selectedUser.premium_until) >
        new Date()
          ? `${Math.ceil(
              (new Date(
                selectedUser.premium_until
              ).getTime() -
                Date.now()) /
                (1000 * 60 * 60 * 24)
            )} days remaining`
          : "Premium expired"}
      </p>

    </div>
  )}
{/* USER RECEIPTS */}

<div className="mb-6">

  <div className="flex items-center justify-between mb-3">

    <h3 className="font-bold">
      Recent Receipts
    </h3>

    <span className="text-xs text-slate-500">
      {userReceipts.length} found
    </span>

  </div>

  {receiptsLoading ? (

    <div className="bg-slate-950 rounded-xl p-6 text-center">
      <p className="text-slate-500">
        Loading receipts...
      </p>
    </div>

  ) : userReceipts.length === 0 ? (

    <div className="bg-slate-950 rounded-xl p-6 text-center">
      <p className="text-slate-500">
        This user has not created any receipts yet.
      </p>
    </div>

  ) : (

    <div className="bg-slate-950 rounded-xl overflow-hidden">

      <div className="max-h-64 overflow-y-auto">

        {userReceipts.slice(0, 10).map((receipt) => (

          <div
            key={receipt.id}
            className="p-4 border-b border-slate-800 last:border-b-0"
          >

            <div className="flex justify-between gap-4">

              <div className="min-w-0">

                <p className="font-semibold truncate">
                  {receipt.sender}
                  {" → "}
                  {receipt.receiver}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {receipt.payment_method}
                  {" • "}
                  {new Date(
                    receipt.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

              <p className="font-bold text-green-400 whitespace-nowrap">
                ₦{Number(
                  receipt.amount
                ).toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )}

</div>

            {/* UPGRADE */}

            <button
              onClick={() =>
                upgradeUser(selectedUser.id)
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold mb-3"
            >
              ⭐ Upgrade to Premium
            </button>

            {/* DOWNGRADE */}

            <button
              onClick={() =>
                downgradeUser(selectedUser.id)
              }
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold mb-3"
            >
              Downgrade to Free
            </button>

            {/* ADMIN */}

            {selectedUser.role === "admin" ? (

              <button
                onClick={() =>
                  removeAdmin(selectedUser.id)
                }
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold mb-3"
              >
                Remove Admin Role
              </button>

            ) : (

              <button
                onClick={() =>
                  makeAdmin(selectedUser.id)
                }
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold mb-3"
              >
                👑 Make Admin
              </button>

            )}

            {/* CLOSE */}

            <button
              onClick={() =>
                setSelectedUser(null)
              }
              className="w-full border border-slate-700 hover:bg-slate-800 text-slate-300 py-3 rounded-xl font-semibold"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

function loadStats() {
    throw new Error("Function not implemented.");
}
function setSelectedUser(arg0: null) {
    throw new Error("Function not implemented.");
}

