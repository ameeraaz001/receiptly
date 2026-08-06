"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function MonthlyChart() {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
    ],

    datasets: [
      {
        label: "Receipts",
        data: [2, 5, 8, 12, 18, 25, 30],
        borderColor: "#2563eb",
        backgroundColor: "#2563eb33",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-5">
        Monthly Receipts
      </h2>

      <Line data={data} />
    </div>
  );
}