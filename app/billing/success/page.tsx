"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    verifyPayment();
  }, []);

  async function verifyPayment() {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("Payment reference not found.");
      return;
    }

    try {
      const response = await fetch(
        "/api/paystack/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus(
          result.error ||
            "Payment verification failed."
        );
        return;
      }

      setStatus(
        "🎉 Premium activated successfully!"
      );

      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      console.error(error);

      setStatus(
        "Something went wrong while verifying payment."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-5">
          💳
        </div>

        <h1 className="text-2xl font-bold">
          Premium Subscription
        </h1>

        <p className="text-gray-500 mt-4">
          {status}
        </p>
      </div>
    </main>
  );
}

function LoadingPaymentPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-5">
          💳
        </div>

        <h1 className="text-2xl font-bold">
          Premium Subscription
        </h1>

        <p className="text-gray-500 mt-4">
          Loading payment information...
        </p>
      </div>
    </main>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<LoadingPaymentPage />}>
      <BillingSuccessContent />
    </Suspense>
  );
}