"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Create profile for the new user
    if (data.user) {
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: data.user.id,
        email,
        full_name: fullName,
        plan: "free",
        receipt_limit: 5,
        receipt_used: 0,
        role: "user",
      },
    ]);

  if (profileError) {
    console.log(profileError);
  }
}

    alert("Account created successfully. Check your email.");

    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black placeholder:text-gray-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black placeholder:text-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}