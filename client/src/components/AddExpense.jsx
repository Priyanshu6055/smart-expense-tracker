import { useState } from "react";
import axios from "axios";

const AddExpense = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("Expense added successfully!");
      setError("");
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
    } catch (err) {
      setError("Error adding expense");
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-red-700 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">Add Expense</h2>

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

      <form onSubmit={handleAddExpense} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-gray-300 font-medium text-sm mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="e.g., 1200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-300 font-medium text-sm mb-1">Category</label>
          <input
            type="text"
            id="category"
            placeholder="e.g., Food, Rent, Travel"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-300 font-medium text-sm mb-1">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Optional note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-300 font-medium text-sm mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
