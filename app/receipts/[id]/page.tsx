import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ReceiptDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: receipt } = await supabase
    .from("receipts")
    .select("*")
    .eq("id", id)
    .single();

  if (!receipt) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-3xl font-bold text-red-600">
          Receipt Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-blue-600 text-white p-8">

          <h1 className="text-4xl font-bold">
            Receiptly
          </h1>

          <p className="mt-2">
            Payment Receipt
          </p>

        </div>

        <div className="p-8 space-y-6">

          <div className="flex justify-between">

            <div>

              <h2 className="text-gray-500">
                Receipt Number
              </h2>

              <p className="font-bold text-xl">
                {receipt.receipt_number}
              </p>

            </div>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              Successful
            </span>

          </div>

          <hr />

          <div className="grid grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">
                Sender
              </p>

              <h3 className="font-semibold text-lg">
                {receipt.sender}
              </h3>
            </div>

            <div>
              <p className="text-gray-500">
                Receiver
              </p>

              <h3 className="font-semibold text-lg">
                {receipt.receiver}
              </h3>
            </div>

            <div>
              <p className="text-gray-500">
                Payment Method
              </p>

              <h3 className="font-semibold text-lg">
                {receipt.payment_method}
              </h3>
            </div>

            <div>
              <p className="text-gray-500">
                Date
              </p>

              <h3 className="font-semibold text-lg">
                {new Date(
                  receipt.created_at
                ).toLocaleString()}
              </h3>
            </div>

          </div>

          <div className="bg-slate-100 rounded-2xl p-6">

            <p className="text-gray-500">
              Amount
            </p>

            <h1 className="text-5xl font-bold text-blue-600">
              ₦{receipt.amount.toLocaleString()}
            </h1>

          </div>

          <div>

            <p className="text-gray-500 mb-2">
              Description
            </p>

            <div className="bg-slate-100 p-5 rounded-xl">
              {receipt.description}
            </div>

          </div>

          <div className="flex gap-4">

            <Link
              href="/receipt-history"
              className="flex-1 bg-gray-200 py-3 rounded-xl text-center"
            >
              Back
            </Link>

            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
            >
              Print Receipt
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}