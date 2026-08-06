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
export default function MinimalReceipt(props: Props) {
  return (
    <div className="w-[420px] mx-auto bg-white p-10 shadow rounded-xl">
      <h1 className="text-2xl font-semibold">
        Minimal Receipt
      </h1>

      <h2 className="text-4xl font-bold mt-6">
        ₦{Number(props.amount).toLocaleString()}
      </h2>

      <div className="mt-8 space-y-3">
        <p>{props.sender}</p>
        <p>{props.receiver}</p>
        <p>{props.paymentMethod}</p>
        <p>{props.description}</p>
        <p>{props.receiptNumber}</p>
      </div>
    </div>
  );
}