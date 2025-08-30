import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Reusable components for better structure
const BudgetSummaryCard = ({ title, amount, icon, color }) => (
  <div className={`p-4 rounded-xl shadow-lg border ${color} bg-gray-900 bg-opacity-50 backdrop-blur-md`}>
    <div className="flex items-center space-x-3 mb-2">
      <div className={`p-2 rounded-full ${color.replace('border-', 'bg-').replace('from-', '')} bg-opacity-20`}>
        <span className="text-xl">{icon}</span>
      </div>
      <h4 className="text-lg font-semibold text-gray-200">{title}</h4>
    </div>
    <p className="text-2xl font-bold text-gray-100">
      ₹{new Intl.NumberFormat("en-IN").format(amount)}
    </p>
  </div>
);

const BudgetProgressCard = ({ s }) => {
  const percent = s.budget ? (s.spent / s.budget) * 100 : 0;
  let progressColor = "bg-green-500";
  let statusText = "On Track";
  let statusColor = "bg-green-600";
  if (percent >= 100) {
    progressColor = "bg-red-500";
    statusText = "Over Budget";
    statusColor = "bg-red-600";
  } else if (percent >= 80) {
    progressColor = "bg-yellow-500";
    statusText = "Close to Limit";
    statusColor = "bg-yellow-600";
  }

  const getIcon = (category) => {
    const icons = {
      'Groceries': '🛒', 'Rent': '🏠', 'Utilities': '💡', 'Transport': '🚗',
      'Food': '🍔', 'Entertainment': '🎬', 'Shopping': '🛍️', 'Health': '💊',
    };
    return icons[category] || '💰';
  };

  return (
    <div className="bg-gray-700 p-6 rounded-xl border border-gray-600 hover:scale-[1.02] transition-transform duration-300 transform-gpu shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getIcon(s.category)}</div>
          <strong className="text-xl font-medium text-gray-200">{s.category}</strong>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor} text-white`}>
          {statusText}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-2">
        Spent: <span className="text-gray-300 font-semibold">₹{s.spent}</span> / Budget:{" "}
        <span className="text-gray-300 font-semibold">₹{s.budget}</span>
      </p>
      <div className="h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
};


const BudgetStatus = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [status, setStatus] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination state and constants
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetching logic remains the same
  const fetchStatus = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_URL}/api/budget/status?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        setStatus(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
        setCurrentPage(1); // Reset to first page when new data loads
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching budget status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [month, year]);

  // Pagination controls
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = status.slice(startIndex, startIndex + itemsPerPage);

  const totalBudget = useMemo(() => status.reduce((acc, curr) => acc + curr.budget, 0), [status]);
  const totalSpent = useMemo(() => status.reduce((acc, curr) => acc + curr.spent, 0), [status]);
  const remainingBudget = totalBudget - totalSpent;

  const chartData = {
    labels: status.map((s) => s.category),
    datasets: [{
      label: "Budget",
      data: status.map((s) => s.budget),
      backgroundColor: status.map((s) => {
        const percent = s.budget ? (s.spent / s.budget) * 100 : 0;
        return percent >= 100 ? "rgba(239, 68, 68, 0.7)" : percent >= 80 ? "rgba(251, 191, 36, 0.7)" : "rgba(52, 211, 153, 0.7)";
      }),
      borderColor: status.map((s) => {
        const percent = s.budget ? (s.spent / s.budget) * 100 : 0;
        return percent >= 100 ? "rgba(239, 68, 68, 1)" : percent >= 80 ? "rgba(251, 191, 36, 1)" : "rgba(52, 211, 153, 1)";
      }),
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right", labels: { color: "#e2e8f0" } },
      title: {
        display: true,
        text: "Budget Allocation by Category",
        color: "#93c5fd",
        font: { size: 16, weight: "bold" },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full transform scale-95 opacity-0 animate-fade-in-up border border-blue-700 max-w-5xl">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        Budget Dashboard
      </h2>

      {/* Month & Year Selectors */}
      <div className="flex justify-center gap-4 mb-8">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg"
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
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={today.getFullYear() - i}>
              {today.getFullYear() - i}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading budget data...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : status.length === 0 ? (
        <p className="text-gray-400 text-center">No budgets found for this period. Add a new budget to get started!</p>
      ) : (
        <div className="space-y-8">
          {/* Summary and Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <BudgetSummaryCard title="Total Budget" amount={totalBudget} icon="💸" color="border-blue-500" />
              <BudgetSummaryCard title="Total Spent" amount={totalSpent} icon="💳" color="border-purple-500" />
              <BudgetSummaryCard title="Remaining" amount={remainingBudget} icon="💰" color="border-green-500" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-xl p-4 border border-blue-700">
              <Doughnut data={chartData} options={options} />
            </div>
          </div>

          <div className="border-t border-gray-700 my-6"></div>

          {/* Detailed Breakdown Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Detailed Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {paginatedItems.map((s, idx) => (
                <BudgetProgressCard key={idx + startIndex} s={s} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => (p * itemsPerPage < status.length ? p + 1 : p))}
                disabled={currentPage * itemsPerPage >= status.length}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetStatus;
