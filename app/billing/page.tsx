"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email || "");
    setLoading(false);
  }

  async function startSubscription() {
    setPaying(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        "/api/paystack/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.authorization_url) {
        alert(
          result.error ||
            "Could not start payment."
        );
        return;
      }

      window.location.href =
        result.authorization_url;
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">

        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
            ⭐
          </div>

          <h1 className="text-3xl font-bold mt-5">
            Receiptly Premium
          </h1>

          <p className="text-gray-500 mt-2">
            Unlock the full Receiptly experience.
          </p>

        </div>

        <div className="mt-8 text-center">

          <p className="text-5xl font-bold text-blue-600">
            ₦700
          </p>

          <p className="text-gray-500 mt-1">
            per month
          </p>

        </div>

        <div className="mt-8 space-y-3">

          <div>✅ Unlimited receipts</div>
          <div>✅ Premium receipt templates</div>
          <div>✅ Unlimited PDF downloads</div>
          <div>✅ Premium support</div>
          <div>✅ Future Premium updates</div>

        </div>

        <div className="mt-8 bg-slate-50 rounded-xl p-4">

          <p className="text-xs text-gray-500">
            Subscription email
          </p>

          <p className="font-semibold mt-1 break-all">
            {email}
          </p>

        </div>

        <button
          onClick={startSubscription}
          disabled={paying}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold"
        >
          {paying
            ? "Opening Paystack..."
            : "Subscribe for ₦700/month"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          You will be redirected to Paystack to
          complete your subscription.
        </p>

      </div>
    </main>
  );
}