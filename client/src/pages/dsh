import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0); // State for total income
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Function to fetch all transactions (expenses)
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data?.data || []);
    } catch (err) {
      console.error("Fetch expenses error:", err);
      setError(err.response?.data?.message || "Failed to fetch expenses");
    }
  };

  // Function to fetch total monthly income
  const fetchTotalMonthlyIncome = async () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    try {
      const res = await axios.get(`http://localhost:5000/api/income/monthly?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalIncomeAmount(res.data.totalIncome);
    } catch (err) {
      console.error("Fetch monthly income error:", err);
      // Don't set global error for this, as it's just one part of the dashboard
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      alert("Failed to delete expense."); // Using alert as per previous code, consider custom modal
    }
  };

  // This getTotal now only calculates total expenses from the 'transactions' state
  const getTotalExpenses = () =>
    (transactions || [])
      .filter((tx) => tx.type === "expense") // Assuming transactions only contain expenses now
      .reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    // Fetch both expenses and total income when component mounts
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchTotalMonthlyIncome()]);
      setLoading(false);
    };
    loadDashboardData();
  }, []);

  if (loading) return <p className="text-center mt-10 text-blue-300">Loading dashboard...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 font-inter
                    bg-gradient-to-br from-gray-900 to-blue-950 text-gray-100">
      <div className="max-w-6xl w-full mx-auto p-6
                      transform scale-95 opacity-0 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-8 text-center">Your Dashboard</h1>

        {error && <p className="text-red-400 text-center mb-6">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Income Card - Now with Customize Button */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-green-700
                          hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Income (This Month)</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">₹ {totalIncomeAmount}</p>
            <Link
              to="/manage-income" // Link to the new income management page
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm
                         hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Customize Income
            </Link>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-red-700
                          hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-300">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-400 mt-2">₹ {getTotalExpenses()}</p>
                        <Link
              to="/manage-expense" 
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm
                         hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Expense
            </Link>
          </div>
          {/* Current Balance Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-blue-700
                          hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-gray-300">Current Balance</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              ₹ {totalIncomeAmount - getTotalExpenses()}
            </p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700 mt-10">
          <table className="w-full table-auto">
            <thead className="bg-gray-700 text-gray-200 text-left">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(transactions || []).map((tx) => (
                <tr key={tx._id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
                  <td className="px-4 py-3 text-gray-300">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className={`px-4 py-3 capitalize font-medium ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{tx.category}</td>
                  <td className="px-4 py-3 text-gray-300">₹ {tx.amount}</td>
                  <td className="px-4 py-3 text-gray-300">{tx.description}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-semibold
                                 hover:bg-yellow-600 transition duration-200 hover:scale-105"
                      onClick={() => alert("Edit feature coming soon")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold
                                 hover:bg-red-700 transition duration-200 hover:scale-105"
                      onClick={() => handleDelete(tx._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-6">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
