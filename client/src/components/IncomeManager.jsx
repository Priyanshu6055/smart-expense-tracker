import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Trash2,
  X,
  PlusCircle,
  IndianRupee,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

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

  /* NEW */
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleAmounts, setVisibleAmounts] = useState({});

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
      setError('Failed to load incomes.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlyIncome = async () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    try {
      const res = await axios.get(
        `${API_URL}/api/income/monthly?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMonthlyIncome(res.data.totalIncome);
    } catch (err) {}
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
      await axios.post(`${API_URL}/api/income`, incomeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmount('');
      setSource('');
      setDate('');
      setType('one-time');
      setFrequency('');
      setMessage('Income added successfully!');
      fetchIncomes();
      fetchMonthlyIncome();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income.');
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
      setIsModalOpen(false);
      fetchIncomes();
      fetchMonthlyIncome();
    } catch (err) {
      setError('Failed to delete income.');
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchMonthlyIncome();
  }, [token]);

  /* PAGINATION */
  const totalPages = Math.ceil(incomes.length / ITEMS_PER_PAGE);
  const paginatedIncomes = incomes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleAmountVisibility = (id) => {
    setVisibleAmounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-green-400 mb-4 hover:text-green-300"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-4xl font-bold text-green-400 text-center mb-8">
          Manage Your Income
        </h1>

        {/* MONTHLY INCOME */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="flex items-center text-xl font-semibold">
            <IndianRupee className="mr-2" /> Total Income
          </h2>
          <p className="text-4xl font-bold text-green-400">₹{monthlyIncome}</p>
        </div>

        {/* ADD INCOME FORM (RESTORED FULLY) */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Income</h2>

          {message && <p className="text-green-400 mb-3">{message}</p>}
          {error && <p className="text-red-400 mb-3">{error}</p>}

          <form onSubmit={handleAddIncome} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 rounded bg-gray-700"
            />

            <input
              type="text"
              placeholder="Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="p-3 rounded bg-gray-700"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 rounded bg-gray-700"
            />

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === 'one-time') setFrequency('');
              }}
              className="p-3 rounded bg-gray-700"
            >
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>

            {type === 'recurring' && (
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="p-3 rounded bg-gray-700 md:col-span-2"
              >
                <option value="">Select Frequency</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}

            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 p-3 rounded flex items-center justify-center"
            >
              <PlusCircle className="mr-2" /> Add Income
            </button>
          </form>
        </div>

        {/* INCOME LIST */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">All Income Entries</h2>

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <ul className="space-y-4">
                {paginatedIncomes.map((income) => (
                  <li
                    key={income._id}
                    className="bg-gray-700 p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <IndianRupee />
                        <span className="text-xl font-bold">
                          {visibleAmounts[income._id] ? income.amount : '•••••'}
                        </span>
                        <button onClick={() => toggleAmountVisibility(income._id)}>
                          {visibleAmounts[income._id] ? <EyeOff /> : <Eye />}
                        </button>
                      </div>

                      <p className="text-sm text-gray-400">
                        {income.source} • {income.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(income.date).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => confirmDelete(income)}
                      className="bg-red-600 px-3 py-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1 ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl mb-4">Confirm Deletion?</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeManager;
