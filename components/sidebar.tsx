"use client";

import Link from "next/link";

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Sidebar({
  open,
  setOpen,
}: SidebarProps) {
  return (
    <>
      {/* Dark overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r shadow-xl transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h1 className="text-2xl font-bold text-blue-600">
            Receiptly
          </h1>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="p-5 space-y-3">

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-lg p-3 hover:bg-slate-100"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/create-receipt"
            onClick={() => setOpen(false)}
            className="block rounded-lg p-3 hover:bg-slate-100"
          >
            ➕ Create Receipt
          </Link>

          <Link
            href="/receipt-history"
            onClick={() => setOpen(false)}
            className="block rounded-lg p-3 hover:bg-slate-100"
          >
            📜 Receipt History
          </Link>

          <Link
            href="/subscription"
            onClick={() => setOpen(false)}
            className="block rounded-lg p-3 hover:bg-slate-100"
          >
            💳 Subscription
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block rounded-lg p-3 hover:bg-slate-100"
          >
            👤 Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block rounded-lg p-3 hover:bg-slate-100"
          >
            ⚙ Settings
          </Link>

        </nav>
      </aside>
    </>
  );
}