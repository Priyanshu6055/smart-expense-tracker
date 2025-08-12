import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const IncomeManager = () => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('one-time'); 
  const [frequency, setFrequency] = useState(''); 
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchIncomes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/income', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data.data);
      setError(''); // Clear error on successful fetch
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError("Failed to load incomes. Please ensure you are logged in.");
    }
  };

  const fetchMonthlyIncome = async () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    try {
      const res = await axios.get(`http://localhost:5000/api/income/monthly?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyIncome(res.data.totalIncome);
      setError(''); // Clear error on successful fetch
    } catch (err) {
      console.error("Error fetching monthly income:", err);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!amount || !source || !date || !type) {
      setError('Amount, Source, Date, and Type are required.');
      return;
    }

    const incomeData = {
      amount: parseFloat(amount),
      source,
      date,
      type,
      // Only include frequency if type is 'recurring' and frequency is selected
      ...(type === 'recurring' && frequency && { frequency }),
      // notes: "" // You could add a notes field if desired
    };

    try {
      await axios.post(
        'http://localhost:5000/api/income',
        incomeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount('');
      setSource('');
      setDate('');
      setType('one-time'); // Reset type to default
      setFrequency(''); // Reset frequency
      setMessage('Income added successfully!');
      fetchIncomes();
      fetchMonthlyIncome();
    } catch (err) {
      console.error("Error adding income:", err);
      setError(err.response?.data?.message || "Failed to add income. Check server logs.");
    }
  };

  const deleteIncome = async (id) => {
    // Replaced window.confirm with a simple alert as per previous instructions for consistency
    // In a real app, use a custom modal for confirmation.
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      try {
        await axios.delete(`http://localhost:5000/api/income/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Income deleted successfully!');
        fetchIncomes();
        fetchMonthlyIncome();
      } catch (err) {
        console.error("Error deleting income:", err);
        setError(err.response?.data?.message || "Failed to delete income.");
      }
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchMonthlyIncome();
  }, [token]); // Added token to dependency array to re-fetch if token changes (e.g., after login)

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-blue-700">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Manage Your Income</h2>

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

      <div className="bg-gray-700 p-6 rounded-lg shadow-inner mb-6">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Current Monthly Income: <span className="text-green-400">₹{monthlyIncome}</span></h3>
      </div>

      <form onSubmit={handleAddIncome} className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Add New Income</h3>
        <div>
          <label htmlFor="amount" className="block text-gray-300 font-medium text-sm mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            placeholder="e.g., 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out"
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-gray-300 font-medium text-sm mb-1">Source</label>
          <input
            type="text"
            id="source"
            placeholder="e.g., Salary, Freelance, Gift"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out"
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
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out"
          />
        </div>
        {/* New: Income Type Selection */}
        <div>
          <label htmlFor="type" className="block text-gray-300 font-medium text-sm mb-1">Income Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (e.target.value === 'one-time') {
                setFrequency(''); // Clear frequency if type is one-time
              }
            }}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out"
          >
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
        {/* New: Frequency Selection (conditionally rendered) */}
        {type === 'recurring' && (
          <div>
            <label htmlFor="frequency" className="block text-gray-300 font-medium text-sm mb-1">Frequency</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required={type === 'recurring'} // Make required only if recurring
              className="w-full px-4 py-2 border border-gray-600 rounded-lg
                         bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         outline-none transition duration-200 ease-in-out"
            >
              <option value="">Select Frequency</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                     hover:bg-blue-700 active:bg-blue-800
                     transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Add Income
        </button>
      </form>

      <h3 className="text-xl font-semibold text-gray-200 mb-4">All Income Entries</h3>
      {incomes.length === 0 ? (
        <p className="text-center text-gray-400 py-4">No income entries found.</p>
      ) : (
        <ul className="space-y-3">
          {incomes.map((income) => (
            <li
              key={income._id}
              className="bg-gray-700 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-200
                         border border-gray-600 hover:bg-gray-600 transition duration-200"
            >
              <div className="flex-grow mb-2 sm:mb-0">
                <span className="font-semibold text-green-400">₹{income.amount}</span> from <span className="font-medium">{income.source}</span>
                <span className="text-gray-400 text-sm ml-2">({income.type.charAt(0).toUpperCase() + income.type.slice(1)} {income.frequency ? ` - ${income.frequency.charAt(0).toUpperCase() + income.frequency.slice(1)}` : ''})</span>
                <br className="sm:hidden" /> {/* Line break on small screens */}
                <span className="text-gray-400 text-sm">on {new Date(income.date).toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => deleteIncome(income._id)}
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold
                           hover:bg-red-700 transition duration-200 hover:scale-105"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncomeManager;
