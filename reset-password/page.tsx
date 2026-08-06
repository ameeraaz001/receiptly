"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");

  const updatePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6">
          New Password
        </h1>

        <form
          onSubmit={updatePassword}
          className="space-y-4"
        >

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded-lg text-black"
          />

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Update Password
          </button>

        </form>

      </div>

    </main>
  );
}