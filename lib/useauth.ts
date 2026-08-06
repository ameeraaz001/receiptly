"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        console.log("Checking user...");

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        console.log("User:", user);
        console.log("Error:", error);

        if (error) {
          console.error(error);
        }

        if (!user) {
          router.replace("/login");
          return;
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);

  return { loading };
}