"use client";
import { generateReceiptPdf } from "@/utils/genearatepdf";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useauth";

export default function CreateReceiptPage() {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [bank, setBank] = useState("OPay");
  const [description, setDescription] = useState("");
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
  const { loading } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData || null);
    };

    fetchProfile();
  }, []);

if (loading) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const receiptNumber = `RCT-${Date.now()}`;
  const transactionId = Date.now().toString();

const sessionId = Math.random()
  .toString()
  .slice(2, 18);

const transactionDate = new Date().toLocaleDateString();

const transactionTime = new Date().toLocaleTimeString();

const status = "Successful";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first.");
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log("User ID:", user.id);
console.log("Profile:", profile);
console.log("Profile Error:", profileError);

if (profileError || !profile) {
  alert(
    JSON.stringify(profileError, null, 2)
  );
  return;
}
const premiumTemplates = [
  "Luxury",
  "Emerald",
  "Ocean",
  "Corporate",
  "Minimal",
  "Dark",
];

if (
  profile.plan !== "premium" &&
  premiumTemplates.includes(bank)
) {
  alert(
    "This template is available for Premium users only."
  );
  return;
}

  // Check free plan limit
  const premiumActive =
  profile.plan === "premium" &&
  profile.premium_until &&
  new Date(profile.premium_until) > new Date();

if (
  !premiumActive &&
  profile.receipt_used >= profile.receipt_limit
) {
  alert(
    "Your free receipt limit has been reached. Upgrade to Premium."
  );
  return;
}

  // Save receipt
  const { data, error } = await supabase
  .from("receipts")
  .insert([
    {
      user_id: user.id,

      // Receipt Info
      bank,
      receipt_number: receiptNumber,

      // Transaction Info
      transaction_id: transactionId,
      session_id: sessionId,
      transaction_date: transactionDate,
      transaction_time: transactionTime,
      status,

      // Payment Info
      sender,
      receiver,
      amount: Number(amount),
      payment_method: paymentMethod,
      description,
    },
  ])
  .select()
  .single();
  if (error) {
    alert(error.message);
    return;
  }

  // Increase receipts used
  if (profile.plan === "free") {
  await supabase
    .from("profiles")
    .update({
      receipt_used: profile.receipt_used + 1,
    })
    .eq("id", user.id);
}

  alert("Receipt saved successfully!");

router.push(`/preview?id=${data.id}`);

  setSender("");
  setReceiver("");
  setAmount("");
  setPaymentMethod("Bank Transfer");
  setDescription("");
};
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Create Receipt
        </h1>

        <p className="text-gray-500 mb-8">
          Fill in the receipt details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">
              Sender Name
            </label>

            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Receiver Name
            </label>

            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            />
          </div>
          <div className="bg-slate-50 rounded-xl p-6">

  <h2 className="font-bold text-lg mb-4">
    Live Receipt Preview
  </h2>

  <div className="bg-white rounded-xl shadow p-5">

    <div className="flex justify-between">
      <span className="font-bold">{bank}</span>

      <span className="text-green-600">
        Successful
      </span>
    </div>

    <h1 className="text-4xl font-bold mt-5">
      ₦{amount || "0"}
    </h1>

    <div className="space-y-3 mt-6">

      <div className="flex justify-between">
        <span>Sender</span>
        <span>{sender || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Receiver</span>
        <span>{receiver || "-"}</span>
      </div>

      <div className="flex justify-between">
        <span>Method</span>
        <span>{paymentMethod}</span>
      </div>

      <div className="flex justify-between">
        <span>Description</span>
        <span>{description || "-"}</span>
      </div>

    </div>

  </div>

</div>

          <div>
            <label className="block mb-2 font-medium">
              Payment Method
            </label>
            <div>
  <label className="block mb-4 font-medium">
    Choose Bank Template
  </label>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    {templates.map((item) => {
 const premiumActive =
  profile?.plan === "premium" &&
  profile?.premium_until &&
  new Date(profile.premium_until) > new Date();

const locked =
  item.premium &&
  !premiumActive;

  return (
    <button
      key={item.name}
      type="button"
      disabled={locked}
      onClick={() => setBank(item.name)}
      className={`rounded-xl border-2 p-4 transition ${
        bank === item.name
          ? "border-blue-600 bg-blue-50"
          : "border-gray-300"
      } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="font-semibold">
  {item.premium ? "👑 " : ""}
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

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            >
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>POS</option>
              <option>Card Payment</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Generate Receipt
          </button>
        </form>
      </div>
    </main>
  );
}