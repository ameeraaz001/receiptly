"use client";

import Link from "next/link";

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">
          Subscription
        </h1>

        <div className="border rounded-xl p-6">
          <h2 className="text-2xl font-bold">
            Premium Plan
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-3">
            ₦700
            <span className="text-lg text-gray-500">
              /month
            </span>
          </p>

          <ul className="mt-6 space-y-2 text-gray-700">
            <li>✅ Unlimited Receipts</li>
            <li>✅ Unlimited PDF Downloads</li>
            <li>✅ Premium Support</li>
            <li>✅ Future Updates</li>
          </ul>

          <Link href="/billing">
            <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              Upgrade to Premium
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}