import { supabase } from "@/lib/supabase";

export default async function VerifyReceiptPage({
  params,
}: {
  params: Promise<{ receiptNumber: string }>;
}) {
  const { receiptNumber } = await params;

  const { data: receipt } = await supabase
    .from("receipts")
    .select("*")
    .eq("receipt_number", receiptNumber)
    .single();

  if (!receipt) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600">
            ❌ Receipt Not Found
          </h1>

          <p className="mt-4 text-gray-500">
            This receipt number does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center text-green-600">
          ✅ Receipt Verified
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          This receipt exists in the Receiptly database.
        </p>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span className="font-semibold">Receipt Number</span>
            <span>{receipt.receipt_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Sender</span>
            <span>{receipt.sender}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Receiver</span>
            <span>{receipt.receiver}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Amount</span>
            <span>₦{receipt.amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Payment Method</span>
            <span>{receipt.payment_method}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Description</span>
            <span>{receipt.description}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Date</span>
            <span>
              {new Date(receipt.created_at).toLocaleString()}
            </span>
          </div>

        </div>

      </div>
    </main>
  );
}