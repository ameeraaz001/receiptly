"use client";

import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="text-xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Link
          href="/create-receipt"
          className="rounded-xl bg-blue-600 p-4 text-center text-white font-semibold hover:bg-blue-700"
        >
          ➕ Create
        </Link>

        <Link
          href="/receipt-history"
          className="rounded-xl bg-green-600 p-4 text-center text-white font-semibold hover:bg-green-700"
        >
          📜 History
        </Link>

        <Link
          href="/subscription"
          className="rounded-xl bg-purple-600 p-4 text-center text-white font-semibold hover:bg-purple-700"
        >
          💳 Billing
        </Link>

        <Link
          href="/profile"
          className="rounded-xl bg-orange-600 p-4 text-center text-white font-semibold hover:bg-orange-700"
        >
          👤 Profile
        </Link>

      </div>

    </div>
  );
}