"use client";

type Props = {
  plan: string;
};

export default function WelcomeBanner({ plan }: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">

      <div className="flex flex-col md:flex-row justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Welcome back 👋
          </h1>

          <p className="mt-3 text-blue-100">
            Create professional payment receipts in seconds.
          </p>
        </div>

        <div className="mt-6 md:mt-0">

          {plan === "premium" ? (
            <div className="bg-green-500 px-5 py-3 rounded-full font-bold shadow-lg">
              ⭐ Premium User
            </div>
          ) : (
            <div className="bg-white text-blue-700 px-5 py-3 rounded-full font-bold shadow-lg">
              Free Plan
            </div>
          )}

        </div>

      </div>

    </div>
  );
}