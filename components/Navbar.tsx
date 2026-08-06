import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-2xl font-bold text-blue-600">
        Receiptly
      </h1>

      <div className="flex gap-3">
        <Link
          href="/login"
          className="px-4 py-2 border border-gray-300 rounded-lg text-black"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}