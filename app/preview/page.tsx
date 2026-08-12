"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import OpayReceipt from "@/components/receipts/OpayReceipt";
import PalmPayReceipt from "@/components/receipts/PalmpayReceipt";
import MoniepointReceipt from "@/components/receipts/MoniepointReceipt";
import LuxuryReceipt from "@/components/receipts/LuxuryReceipt";
import EmeraldReceipt from "@/components/receipts/EmeraldReceipt";
import OceanReceipt from "@/components/receipts/OceanReceipt";
import CorporateReceipt from "@/components/receipts/CorporateReceipt";
import MinimalReceipt from "@/components/receipts/MinimalReceipt";
import DarkReceipt from "@/components/receipts/DarkReceipt";

type Receipt = {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  payment_method: string;
  description: string;
  receipt_number: string;
  transaction_id: string;
  session_id: string;
  transaction_date: string;
  transaction_time: string;
  status: string;
  bank: string;
};

function PreviewContent() {
  const params = useSearchParams();
  const router = useRouter();

  const receiptRef = useRef<HTMLDivElement>(null);

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, []);

  async function fetchReceipt() {
    const id = params.get("id");

    if (!id) {
      alert("Receipt not found.");
      router.push("/dashboard");
      return;
    }

    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      router.push("/dashboard");
      return;
    }

    setReceipt(data);
    setLoading(false);
  }

  const downloadPDF = async () => {
    if (!receiptRef.current || !receipt) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 0,
        filename: `${receipt.receipt_number}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 3,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(receiptRef.current)
      .save();
  };

  if (loading || !receipt) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center p-8">
      <div ref={receiptRef}>
        {receipt.bank === "OPay" && (
          <OpayReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "PalmPay" && (
          <PalmPayReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Moniepoint" && (
          <MoniepointReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Luxury" && (
          <LuxuryReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Emerald" && (
          <EmeraldReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Ocean" && (
          <OceanReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Corporate" && (
          <CorporateReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Minimal" && (
          <MinimalReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}

        {receipt.bank === "Dark" && (
          <DarkReceipt
            sender={receipt.sender}
            receiver={receipt.receiver}
            amount={receipt.amount.toString()}
            paymentMethod={receipt.payment_method}
            description={receipt.description}
            receiptNumber={receipt.receipt_number}
            transactionId={receipt.transaction_id}
            sessionId={receipt.session_id}
            transactionDate={receipt.transaction_date}
            transactionTime={receipt.transaction_time}
            status={receipt.status}
          />
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Download PDF
        </button>

        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Print
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 text-white px-6 py-3 rounded-xl"
        >
          Dashboard
        </button>
      </div>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen text-2xl">
          Loading preview...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}