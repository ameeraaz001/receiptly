"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useauth";

export default function CreateReceiptPage() {
  const router = useRouter();
  const { loading } = useAuth();

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [bank, setBank] = useState("OPay");
  const [description, setDescription] = useState("");

  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const templates = [
    { name: "OPay", premium: false },
    { name: "PalmPay", premium: false },
    { name: "Moniepoint", premium: false },

    { name: "Luxury", premium: true },
    { name: "Emerald", premium: true },
    { name: "Ocean", premium: true },
    { name: "Corporate", premium: true },
    { name: "Minimal", premium: true },
    { name: "Dark", premium: true },
  ];

  // ---------------------------------------
  // LOAD PROFILE
  // ---------------------------------------

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("User error:", userError);
          setProfileLoading(false);
          return;
        }

        if (!user) {
          router.push("/login");
          return;
        }

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile error:", profileError);
          alert(profileError.message);
          setProfileLoading(false);
          return;
        }

        if (!profileData) {
          alert("Your profile was not found.");
          setProfileLoading(false);
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Profile loading error:", error);
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  // ---------------------------------------
  // LOADING
  // ---------------------------------------

  if (loading || profileLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl font-semibold">
          Loading...
        </p>
      </main>
    );
  }

  // ---------------------------------------
  // PREMIUM STATUS
  // ---------------------------------------

  const premiumActive =
    profile?.plan === "premium" &&
    profile?.premium_until &&
    new Date(profile.premium_until) > new Date();

  // ---------------------------------------
  // CREATE RECEIPT
  // ---------------------------------------

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      // ---------------------------------------
      // CHECK AUTH USER
      // ---------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Your session has expired. Please login again.");
        router.push("/login");
        return;
      }

      // ---------------------------------------
      // VALIDATE INPUT
      // ---------------------------------------

      if (!sender.trim()) {
        alert("Please enter the sender name.");
        return;
      }

      if (!receiver.trim()) {
        alert("Please enter the receiver name.");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      // ---------------------------------------
      // CHECK PREMIUM TEMPLATE
      // ---------------------------------------

      const premiumTemplates = [
        "Luxury",
        "Emerald",
        "Ocean",
        "Corporate",
        "Minimal",
        "Dark",
      ];

      if (
        premiumTemplates.includes(bank) &&
        !premiumActive
      ) {
        alert(
          "This template is available for Premium users only."
        );
        return;
      }

      // ---------------------------------------
      // CHECK FREE RECEIPT LIMIT
      // ---------------------------------------

      const receiptUsed =
        Number(profile?.receipt_used ?? 0);

      const receiptLimit =
        Number(profile?.receipt_limit ?? 3);

      if (!premiumActive && receiptUsed >= receiptLimit) {
        alert(
          "Your free receipt limit has been reached. Upgrade to Premium."
        );
        return;
      }

      // ---------------------------------------
      // GENERATE RECEIPT DATA
      // ---------------------------------------

      const receiptNumber = `RCT-${Date.now()}`;

      const transactionId =
        Date.now().toString();

      const sessionId = Math.random()
        .toString()
        .slice(2, 18);

      const now = new Date();

      const transactionDate =
        now.toLocaleDateString();

      const transactionTime =
        now.toLocaleTimeString();

      const status = "Successful";

      // ---------------------------------------
      // INSERT RECEIPT
      // ---------------------------------------

      const { data, error } = await supabase
        .from("receipts")
        .insert({
          user_id: user.id,

          bank,
          receipt_number: receiptNumber,

          transaction_id: transactionId,
          session_id: sessionId,
          transaction_date: transactionDate,
          transaction_time: transactionTime,
          status,

          sender: sender.trim(),
          receiver: receiver.trim(),
          amount: Number(amount),
          payment_method: paymentMethod,
          description: description.trim(),
        })
        .select("id")
        .single();

      // ---------------------------------------
      // HANDLE INSERT ERROR
      // ---------------------------------------

      if (error) {
        console.error(
          "RECEIPT INSERT ERROR:",
          error
        );

        alert(
          `Could not save receipt:\n\n${error.message}`
        );

        return;
      }

      if (!data?.id) {
        alert(
          "Receipt was saved, but its ID could not be found."
        );
        return;
      }

      // ---------------------------------------
      // UPDATE FREE RECEIPT COUNT
      // ---------------------------------------

      if (!premiumActive) {
        const { error: updateError } =
          await supabase
            .from("profiles")
            .update({
              receipt_used: receiptUsed + 1,
            })
            .eq("id", user.id);

        if (updateError) {
          console.error(
            "PROFILE UPDATE ERROR:",
            updateError
          );
        }
      }

      // ---------------------------------------
      // SUCCESS
      // ---------------------------------------

      alert("Receipt saved successfully!");

      router.push(`/preview?id=${data.id}`);
    } catch (error) {
      console.error(
        "CREATE RECEIPT ERROR:",
        error
      );

      alert(
        "Something went wrong while creating the receipt."
      );
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Create Receipt
        </h1>

        <p className="text-gray-500 mb-8">
          Fill in the receipt details below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* SENDER */}

          <div>
            <label className="block mb-2 font-medium">
              Sender Name
            </label>

            <input
              type="text"
              value={sender}
              onChange={(e) =>
                setSender(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              placeholder="Enter sender name"
            />
          </div>

          {/* RECEIVER */}

          <div>
            <label className="block mb-2 font-medium">
              Receiver Name
            </label>

            <input
              type="text"
              value={receiver}
              onChange={(e) =>
                setReceiver(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              placeholder="Enter receiver name"
            />
          </div>

          {/* AMOUNT */}

          <div>
            <label className="block mb-2 font-medium">
              Amount
            </label>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              placeholder="Enter amount"
            />
          </div>

          {/* LIVE PREVIEW */}

          <div className="bg-slate-50 rounded-xl p-6">

            <h2 className="font-bold text-lg mb-4">
              Live Receipt Preview
            </h2>

            <div className="bg-white rounded-xl shadow p-5">

              <div className="flex justify-between">

                <span className="font-bold">
                  {bank}
                </span>

                <span className="text-green-600">
                  Successful
                </span>

              </div>

              <h1 className="text-4xl font-bold mt-5">
                ₦{amount || "0"}
              </h1>

              <div className="space-y-3 mt-6">

                <div className="flex justify-between gap-4">
                  <span>Sender</span>
                  <span>
                    {sender || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Receiver</span>
                  <span>
                    {receiver || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Method</span>
                  <span>
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Description</span>
                  <span>
                    {description || "-"}
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* BANK TEMPLATES */}

          <div>

            <label className="block mb-4 font-medium">
              Choose Bank Template
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {templates.map((item) => {

                const locked =
                  item.premium &&
                  !premiumActive;

                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={locked}
                    onClick={() =>
                      setBank(item.name)
                    }
                    className={`rounded-xl border-2 p-4 transition ${
                      bank === item.name
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    } ${
                      locked
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >

                    <div className="font-semibold">
                      {item.premium
                        ? "👑 "
                        : ""}
                      {item.name}
                    </div>

                    {locked && (
                      <p className="text-xs text-red-500 mt-2">
                        🔒 Premium
                      </p>
                    )}

                  </button>
                );
              })}

            </div>
          </div>

          {/* PAYMENT METHOD */}

          <div>

            <label className="block mb-2 font-medium">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            >
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>POS</option>
              <option>Card Payment</option>
            </select>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              placeholder="Optional description"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className={`w-full text-white py-3 rounded-lg ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving
              ? "Saving Receipt..."
              : "Generate Receipt"}
          </button>

        </form>

      </div>
    </main>
  );
}