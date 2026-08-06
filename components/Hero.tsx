export default function Hero() {
  return (
    <section className="px-6 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          🚀 Fast • Secure • Professional
        </span>

        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-slate-900">
          Professional Payment Receipts
          <span className="text-blue-600"> in Seconds</span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Create, manage and verify beautiful payment receipts
          with QR verification and cloud storage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700">
            Get Started
          </button>

          <button className="border border-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}