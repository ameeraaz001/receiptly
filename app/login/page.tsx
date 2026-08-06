"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const { error } =
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

if (error) {
  alert(error.message);
  return;
}

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

alert("Login successful!");

if (profile?.role === "admin") {
  router.push("/admin");
} else {
  router.push("/dashboard");
}
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
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
          <Link
  href="/forgot-password"
  className="text-blue-600 text-sm hover:underline"
>
  Forgot Password?
</Link>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}