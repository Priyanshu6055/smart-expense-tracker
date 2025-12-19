import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// helper to get today in YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const AddExpense = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(getTodayDate()); // ✅ AUTO TODAY
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/expenses`,
        { type: "expense", category, amount, date, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Expense added successfully!");
      setError("");
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(getTodayDate()); // ✅ reset back to today
    } catch (err) {
      setError(err.response?.data?.message || "Error adding expense");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-red-700 w-full max-w-md">

        {/* ⬅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-4 transition"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>

        <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">
          Add Expense
        </h2>

        {message && (
          <p className="text-green-400 text-sm text-center mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
