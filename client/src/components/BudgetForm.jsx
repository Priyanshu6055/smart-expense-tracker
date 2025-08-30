import React, { useState } from "react";
import axios from "axios";
import { FiDollarSign, FiCalendar, FiEdit3 } from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const iconClass = "text-blue-400 text-xl";

const BudgetForm = ({ onBudgetAdded }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setError("");   

    try {
      const res = await axios.post(
        `${API_URL}/api/budget`,
        { category, amount: Number(amount), month, year },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      if (res.data.success) {
        setMessage("Budget set successfully!");
        onBudgetAdded();
        setCategory("");
        setAmount("");
      }
    } catch (err) {
      console.error(err);
      setError("Error setting budget. Please try again.");
    }
  };

  return (
    // Outer container matching the design pattern's background
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter">
      {/* Main form card with dark theme styling */}
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Set Your Budget
        </h2>

        {/* Dynamic message and error display */}
        {message && (
          <p className="text-green-400 text-sm text-center mb-4 transition-opacity duration-500">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4 transition-opacity duration-500">
            {error}
          </p>
        )}

        {/* Form elements with new, consistent dark styling */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-gray-300 font-medium">
              <FiEdit3 className="inline-block mr-2" />
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg
                         bg-gray-700 text-white placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         outline-none transition duration-200 ease-in-out
                         hover:border-blue-500"
              placeholder="e.g. Food"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-gray-300 font-medium">
              <FiDollarSign className="inline-block mr-2" />
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg
                         bg-gray-700 text-white placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         outline-none transition duration-200 ease-in-out
                         hover:border-blue-500"
              placeholder="Enter budget amount"
            />
          </div>
          
          <div className="flex gap-2 mb-2">
            <div className="w-1/2">
              <label htmlFor="month" className="block text-gray-300 font-medium">
                <FiCalendar className="inline-block mr-2" />
                Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg
                           bg-gray-700 text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition duration-200 ease-in-out
                           hover:border-blue-500"
              >
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="year" className="block text-gray-300 font-medium">
                Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg
                           bg-gray-700 text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           outline-none transition duration-200 ease-in-out
                           hover:border-blue-500"
                placeholder="Enter year"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-blue-700 active:bg-blue-800
                       transition duration-300 ease-in-out
                       transform hover:-translate-y-1 hover:shadow-lg"
          >
            Save Budget
          </button>
        </form>
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

export default BudgetForm;
