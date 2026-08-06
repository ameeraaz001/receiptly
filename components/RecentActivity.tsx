"use client";

type Receipt = {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
};

export default function RecentActivity({
  receipts,
}: {
  receipts: Receipt[];
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">

      <h2 className="text-2xl font-bold mb-5">
        Recent Activity
      </h2>

      {receipts.length === 0 ? (
        <p className="text-gray-500">
          No activity yet.
        </p>
      ) : (
        <div className="space-y-5">

          {receipts.slice(0, 5).map((receipt) => (
            <div
              key={receipt.id}
              className="flex justify-between border-b pb-3"
            >
              <div>

                <p className="font-semibold">
                  {receipt.sender}
                </p>

                <p className="text-gray-500 text-sm">
                  → {receipt.receiver}
                </p>

              </div>

              <div className="font-bold text-green-600">
                ₦{receipt.amount.toLocaleString()}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}