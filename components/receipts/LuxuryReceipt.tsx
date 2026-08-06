type Props = {
  sender: string;
  receiver: string;
  amount: string;
  paymentMethod: string;
  description: string;
  receiptNumber: string;

  transactionId: string;
  sessionId: string;
  transactionDate: string;
  transactionTime: string;
  status: string;
};
export default function LuxuryReceipt({
  sender,
  receiver,
  amount,
  paymentMethod,
  description,
  receiptNumber,
}: Props) {
  return (
    <div className="w-[420px] mx-auto rounded-2xl bg-black text-white p-8 shadow-2xl">
      <h1 className="text-3xl font-bold text-yellow-400">
        👑 Luxury Receipt
      </h1>

      <div className="mt-8">
        <h2 className="text-5xl font-bold">
          ₦{Number(amount).toLocaleString()}
        </h2>

        <p className="text-green-400 mt-2">
          Transaction Successful
        </p>
      </div>

      <div className="space-y-4 mt-8">
        <p><strong>Sender:</strong> {sender}</p>
        <p><strong>Receiver:</strong> {receiver}</p>
        <p><strong>Method:</strong> {paymentMethod}</p>
        <p><strong>Note:</strong> {description}</p>
        <p><strong>Receipt No:</strong> {receiptNumber}</p>
      </div>
    </div>
  );
}