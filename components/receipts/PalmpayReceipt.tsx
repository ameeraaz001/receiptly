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

export default function PalmPayReceipt({
  sender,
  receiver,
  amount,
  paymentMethod,
  description,
  receiptNumber,
}: Props) {
  return (
    <div className="w-[380px] bg-white rounded-2xl shadow-lg p-6 border">
      <h1 className="text-3xl font-bold text-purple-600 text-center">
        PalmPay
      </h1>

      <p className="text-center text-green-600 font-semibold mt-2">
        Payment Successful
      </p>

      <h2 className="text-center text-4xl font-bold mt-5">
        ₦{Number(amount).toLocaleString()}
      </h2>

      <div className="mt-8 space-y-3">
        <div className="flex justify-between">
          <span>Sender</span>
          <span>{sender}</span>
        </div>

        <div className="flex justify-between">
          <span>Receiver</span>
          <span>{receiver}</span>
        </div>

        <div className="flex justify-between">
          <span>Method</span>
          <span>{paymentMethod}</span>
        </div>

        <div className="flex justify-between">
          <span>Description</span>
          <span>{description}</span>
        </div>

        <div className="flex justify-between">
          <span>Receipt No.</span>
          <span>{receiptNumber}</span>
        </div>
      </div>
    </div>
  );
}