"use client";

type Props = {
  name: string;
  plan: string;
};

export default function DashboardHeader({
  name,
  plan,
}: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-600 p-8 text-white shadow-xl">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, {name} 👋
          </h1>

          <p className="mt-2 text-blue-100">
            Manage your receipts with Receiptly.
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-blue-100">
            Current Plan
          </div>

          <div
            className={`mt-2 inline-flex rounded-full px-5 py-2 font-semibold ${
              plan === "premium"
                ? "bg-green-500"
                : "bg-white text-blue-700"
            }`}
          >
            {plan === "premium"
              ? "⭐ Premium"
              : "Free"}
          </div>
        </div>

      </div>

    </div>
  );
}