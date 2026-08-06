"use client";

type Props = {
  title: string;
  value: string | number;
  icon: string;
  color: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow hover:shadow-2xl transition-all">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-4 ${color}`}>
            {value}
          </h2>

        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>

    </div>
  );
}