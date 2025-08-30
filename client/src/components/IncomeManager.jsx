import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpCircle, Trash2, X, PlusCircle, IndianRupee } from 'lucide-react';

const IncomeManager = () => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('one-time');
  const [frequency, setFrequency] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem('token');

  const fetchIncomes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/income`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data.data);
      setError('');
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError("Failed to load incomes. Please ensure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyIncome = async () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    try {
      const res = await axios.get(`${API_URL}/api/income/monthly?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyIncome(res.data.totalIncome);
      setError('');
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
      ...(type === 'recurring' && frequency && { frequency }),
    };

    try {
      await axios.post(
        `${API_URL}/api/income`,
        incomeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount('');
      setSource('');
      setDate('');
      setType('one-time');
      setFrequency('');
      setMessage('Income added successfully!');
      fetchIncomes();
      fetchMonthlyIncome();
    } catch (err) {
      console.error("Error adding income:", err);
      setError(err.response?.data?.message || "Failed to add income. Check server logs.");
    }
  };

  const confirmDelete = (income) => {
    setIncomeToDelete(income);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!incomeToDelete) return;
    try {
      await axios.delete(`${API_URL}/api/income/${incomeToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Income deleted successfully!');
      setIsModalOpen(false);
      fetchIncomes();
      fetchMonthlyIncome();
    } catch (err) {
      console.error("Error deleting income:", err);
      setError(err.response?.data?.message || "Failed to delete income.");
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchMonthlyIncome();
  }, [token]);

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-8 text-center">Manage Your Income</h1>

        {/* Current Monthly Income Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <IndianRupee className="h-6 w-6 mr-2 text-green-400" />
            Total Income
          </h2>
          <p className="text-4xl font-bold text-green-400">₹{monthlyIncome}</p>
        </div>

        {/* Add New Income Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Income</h2>
          {message && (
            <div className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4">{message}</div>
          )}
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>
          )}
          <form onSubmit={handleAddIncome} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 50000"
                  required
                  className="block w-full rounded-md bg-gray-700 border-gray-600 text-white p-3 pl-8 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-400">Source</label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Salary, Freelance"
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-3 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-3 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-400">Income Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (e.target.value === 'one-time') {
                    setFrequency('');
                  }
                }}
                required
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-3 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            {type === 'recurring' && (
              <div className="md:col-span-2">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-400">Frequency</label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white p-3 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
                >
                  <option value="">Select Frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:-translate-y-0.5"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add Income
              </button>
            </div>
          </form>
        </div>

        {/* All Income Entries List */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">All Income Entries</h2>
          {isLoading ? (
            <p className="text-center text-gray-400 py-4">Loading incomes...</p>
          ) : incomes.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No income entries found. Add a new one above! 📝</p>
          ) : (
            <ul className="space-y-4">
              {incomes.map((income) => (
                <li key={income._id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-transform transform hover:scale-[1.01] hover:shadow-xl">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <p className="font-semibold text-xl text-green-400 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {income.amount}
                    </p>
                    <p className="text-sm text-gray-400">
                      from <span className="text-gray-100 font-medium">{income.source}</span>
                      <span className="mx-1">•</span>
                      <span className="text-green-300">{income.type.charAt(0).toUpperCase() + income.type.slice(1)}</span> {income.frequency && `(${income.frequency.charAt(0).toUpperCase() + income.frequency.slice(1)})`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      on {new Date(income.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => confirmDelete(income)} className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center hover:bg-red-700 transition-colors">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex justify-center items-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative border border-gray-700">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
            <div className="text-center">
              <Trash2 className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-100 mb-2">Confirm Deletion</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete this income entry?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-md font-medium text-gray-100 bg-gray-600 hover:bg-gray-700 transition">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-6 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 transition">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeManager;