export default function ReceiptPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Receiptly
          </h1>

          <p className="text-gray-500">
            Payment Receipt
          </p>
        </div>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Receipt ID</span>
            <span>RC-001</span>
          </div>

          <div className="flex justify-between">
            <span>Sender</span>
            <span>John Doe</span>
          </div>

          <div className="flex justify-between">
            <span>Receiver</span>
            <span>Ameer</span>
          </div>

          <div className="flex justify-between">
            <span>Amount</span>
            <span>₦15,000</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 font-bold">
              Paid
            </span>
          </div>

        </div>

        <button className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl">
          Download PDF
        </button>

      </div>
    </main>
  );
}