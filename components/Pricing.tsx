export default function Pricing() {
  return (
    <section className="py-20 bg-slate-50">
      <h2 className="text-4xl font-bold text-center">
        Pricing
      </h2>

      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white shadow-xl rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold">
            Premium
          </h3>

          <p className="text-5xl font-bold text-blue-600 mt-4">
            ₦700
          </p>

          <p className="text-slate-500">
            per month
          </p>

          <ul className="mt-6 space-y-3">
            <li>✅ Unlimited Receipts</li>
            <li>✅ PDF Download</li>
            <li>✅ QR Verification</li>
            <li>✅ Receipt History</li>
          </ul>

          <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl">
            Start Premium
          </button>
        </div>
      </div>
    </section>
  );
}