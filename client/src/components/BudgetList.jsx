import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BudgetList = ({ refresh }) => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");

  const fetchBudgets = async () => {
    setError(""); // Clear previous errors
    try {
      const res = await axios.get(`${API_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setBudgets(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching budget list. Please try again.");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refresh]);

  return (
    // Outer container matching the design pattern's background
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter">
      {/* Main content card with dark theme styling */}
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Your Budgets
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 transition-opacity duration-500">
            {error}
          </p>
        )}

        {budgets.length === 0 ? (
          <p className="text-gray-400 text-center">No budgets have been set yet.</p>
        ) : (
          <ul className="space-y-4">
            {budgets.map((b) => (
              <li
                key={b._id}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600
                           transition duration-300 ease-in-out hover:scale-105"
              >
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-xl font-medium text-gray-200">
                    {b.category}
                  </strong>
                  <span className="text-xl font-semibold text-blue-300">
                    ₹{b.amount}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {months[b.month]} {b.year}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Custom CSS for animations and font import */}
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

export default BudgetList;
