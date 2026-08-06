export default function Features() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold">
        Features
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mt-10 px-10">
        <div className="border p-6 rounded-xl">
          PDF Export
        </div>

        <div className="border p-6 rounded-xl">
          QR Verification
        </div>

        <div className="border p-6 rounded-xl">
          Cloud Storage
        </div>
      </div>
    </section>
  );
}