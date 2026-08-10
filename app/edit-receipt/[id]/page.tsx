"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditReceiptPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("OPay");
  const [paymentMethod, setPaymentMethod] =
    useState("Bank Transfer");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      fetchReceipt();
    }
  }, [id]);

  async function fetchReceipt() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      alert(
        error?.message || "Receipt not found."
      );

      router.push("/receipt-history");
      return;
    }

    setSender(data.sender || "");
    setReceiver(data.receiver || "");
    setAmount(
      data.amount !== null && data.amount !== undefined
        ? String(data.amount)
        : ""
    );
    setBank(data.bank || "OPay");
    setPaymentMethod(
      data.payment_method || "Bank Transfer"
    );
    setDescription(data.description || "");

    setLoading(false);
  }

  async function handleUpdate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!sender || !receiver || !amount) {
      alert(
        "Please fill in sender, receiver and amount."
      );
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setSaving(false);
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("receipts")
      .update({
        sender,
        receiver,
        amount: Number(amount),
        bank,
        payment_method: paymentMethod,
        description,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Receipt updated successfully!");

    router.push(`/preview?id=${id}`);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-lg font-semibold">
            Loading receipt...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Edit Receipt
              </h1>

              <p className="text-gray-500 mt-2">
                Update your receipt information.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(`/preview?id=${id}`)
              }
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleUpdate}
            className="space-y-6"
          >

            {/* Sender */}
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

            {/* Receiver */}
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

            {/* Amount */}
            <div>
              <label className="block mb-2 font-medium">
                Amount
              </label>

              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
                placeholder="Enter amount"
              />
            </div>

            {/* Bank */}
            <div>
              <label className="block mb-2 font-medium">
                Bank Template
              </label>

              <select
                value={bank}
                onChange={(e) =>
                  setBank(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              >
                <option value="OPay">
                  OPay
                </option>

                <option value="PalmPay">
                  PalmPay
                </option>

                <option value="Moniepoint">
                  Moniepoint
                </option>

                <option value="Luxury">
                  Luxury
                </option>

                <option value="Emerald">
                  Emerald
                </option>

                <option value="Ocean">
                  Ocean
                </option>

                <option value="Corporate">
                  Corporate
                </option>

                <option value="Minimal">
                  Minimal
                </option>

                <option value="Dark">
                  Dark
                </option>
              </select>
            </div>

            {/* Payment Method */}
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
                <option>
                  Bank Transfer
                </option>

                <option>
                  Cash
                </option>

                <option>
                  POS
                </option>

                <option>
                  Card Payment
                </option>
              </select>
            </div>

            {/* Description */}
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
                placeholder="Enter description"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}