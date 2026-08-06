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

export default function CorporateReceipt(props: Props) {
  return (
    <div className="w-[420px] mx-auto rounded bg-white border-2 border-gray-700 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        🏢 Corporate Receipt
      </h1>

      <h2 className="text-5xl font-bold mt-6">
        ₦{Number(props.amount).toLocaleString()}
      </h2>

      <div className="mt-8 space-y-4">
        <p>Sender: {props.sender}</p>
        <p>Receiver: {props.receiver}</p>
        <p>Method: {props.paymentMethod}</p>
        <p>Note: {props.description}</p>
        <p>Receipt: {props.receiptNumber}</p>
      </div>
    </div>
  );
}