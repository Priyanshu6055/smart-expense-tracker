import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_BACKEND_URL;

const BudgetStatus = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // ✅ store as 1-based
  const [year, setYear] = useState(today.getFullYear());
  const [status, setStatus] = useState([]);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    setError("");
    try {
      const res = await axios.get(
        `${API_URL}/api/budget/status?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        const data = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];
        setStatus(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching budget status. Please try again.");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [month, year]);

  // ✅ Chart Data
  const chartData = {
    labels: status.map((s) => s.category),
    datasets: [
      {
        label: "Budgeted Amount (₹)",
        data: status.map((s) => s.budget),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Spent Amount (₹)",
        data: status.map((s) => s.spent),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#e2e8f0" } },
      title: {
        display: true,
        text: "Budget vs. Spent",
        color: "#93c5fd",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter">
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Budget Status
        </h2>

        {/* Month & Year Selectors */}
        <div className="flex justify-center gap-4 mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-gray-700 text-gray-200 px-3 py-2 rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-gray-700 text-gray-200 px-3 py-2 rounded"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={today.getFullYear() - i}>
                {today.getFullYear() - i}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {status.length === 0 ? (
          <p className="text-gray-400 text-center">
            No budgets found for this period.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Chart */}
            <div className="h-64">
              <Bar data={chartData} options={options} />
            </div>

            {/* Detailed Breakdown */}
            <h3 className="text-2xl font-semibold text-blue-300 mt-6">
              Detailed Breakdown
            </h3>
            <ul className="space-y-4">
              {status.map((s, idx) => {
                const percent = s.budget
                  ? (s.spent / s.budget) * 100
                  : 0;
                const progressColor =
                  percent >= 100
                    ? "bg-red-500"
                    : percent >= 80
                    ? "bg-yellow-500"
                    : "bg-green-500";
                const alertText =
                  s.spent > s.budget
                    ? "Over Budget"
                    : percent >= 90
                    ? "Close to Limit"
                    : "On Track";
                const alertColor =
                  s.spent > s.budget
                    ? "bg-red-500"
                    : percent >= 90
                    ? "bg-yellow-500"
                    : "bg-green-500";

                return (
                  <li
                    key={idx}
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:scale-105 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-xl font-medium text-gray-200">
                        {s.category}
                      </strong>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${alertColor} text-white`}
                      >
                        {alertText}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Spent:{" "}
                      <span className="text-gray-300 font-semibold">
                        ₹{s.spent}
                      </span>{" "}
                      / Budget:{" "}
                      <span className="text-gray-300 font-semibold">
                        ₹{s.budget}
                      </span>
                    </p>
                    <div className="h-2 bg-gray-600 rounded-full mt-2">
                      <div
                        className={`h-full rounded-full ${progressColor}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetStatus;
