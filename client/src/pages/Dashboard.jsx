import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"; // For charting
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  Calendar,
  Filter,
  FileText,
  PlusCircle,
  Download,
  X, // For closing modals
} from "lucide-react"; // Icons

const CATEGORY_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00bcd4",
  "#f44336",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bbd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);
  const [categories, setCategories] = useState([]); // State for available categories
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // New state for handling editing and custom modals
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5); // Show 5 recent transactions per page

  const token = localStorage.getItem("token");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
      // Not critical enough to block dashboard, but log
    }
  };

  // Fetch transactions with filters
  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${API_URL}/api/expenses`;
      const params = new URLSearchParams();

      if (selectedCategory) params.append("category", selectedCategory);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data?.data || []);
    } catch (err) {
      console.error("Fetch expenses error:", err);
      setError(err.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };


  // Fetch total monthly income
  const fetchTotalMonthlyIncome = async () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    try {
      const res = await axios.get(
        `${API_URL}/api/income/monthly?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalIncomeAmount(res.data.totalIncome);
    } catch (err) {
      console.error("Fetch monthly income error:", err);
    }
  };

  // Function to handle the deletion of a transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions(); // Re-fetch to update the list
      setIsDeleteModalOpen(false); // Close the modal on success
      setTransactionToDelete(null);
    } catch (err) {
      console.error("Delete expense error:", err);
      setError("Failed to delete expense.");
    }
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  // Function to handle opening the edit modal
  const handleEdit = (transaction) => {
    setEditingTransaction({
      ...transaction,
      date: transaction.date.split('T')[0], // Format date for input field
    });
  };

  // Function to handle updating the transaction
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/expenses/${editingTransaction._id}`,
        editingTransaction,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTransactions(); // Re-fetch to update the list
      setEditingTransaction(null); // Close the edit form
    } catch (err) {
      console.error("Update expense error:", err);
      setError("Failed to update expense.");
    }
  };

  const getTotalExpenses = () =>
    (transactions || [])
      .filter((tx) => tx.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

  // Data for Pie Chart
  const getChartData = () => {
    const expenseCategories = {};
    transactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        expenseCategories[tx.category] =
          (expenseCategories[tx.category] || 0) + tx.amount;
      });

    return Object.keys(expenseCategories).map((category) => ({
      name: category,
      value: expenseCategories[category],
    }));
  };

  // Filter and search transactions locally
  const getFilteredAndSearchedTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredAndSearchedTransactions = getFilteredAndSearchedTransactions();

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSearchedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    fetchTotalMonthlyIncome();
  }, [token, selectedCategory, startDate, endDate]); // Re-fetch when filters change

  if (loading)
    return (
      <p className="text-center mt-10 text-blue-300">Loading dashboard...</p>
    );

  const exportToExcel = () => {
    // Requires xlsx library.
    // Make sure you add this script tag in your index.html:
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    if (typeof XLSX === "undefined") {
      alert("XLSX library not loaded. Please ensure it's installed or linked.");
      return;
    }

    const dataToExport = filteredAndSearchedTransactions.map((tx) => ({
      Date: new Date(tx.date).toLocaleDateString(),
      Type: tx.type,
      Category: tx.category,
      Amount: tx.amount,
      Description: tx.description,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-12 font-inter
                 bg-gradient-to-br from-gray-900 to-blue-950 text-gray-100"
    >
      <Navbar />
      <div
        className="max-w-6xl w-full mx-auto p-6
                   transform scale-95 opacity-0 animate-fade-in-up"
      >
        <h1 className="text-4xl font-extrabold text-blue-400 mb-8 text-center">
          Your Dashboard
        </h1>

        {error && <p className="text-red-400 text-center mb-6">{error}</p>}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="bg-gray-800 p-6 rounded-xl shadow-xl border border-green-700
                         hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Income (This Month)
            </h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              ₹ {totalIncomeAmount}
            </p>
            <Link
              to="/manage-income"
              className="inline-flex items-center mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm
                         hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <PlusCircle size={16} className="mr-2" /> Customize Income
            </Link>
          </div>

          <div
            className="bg-gray-800 p-6 rounded-xl shadow-xl border border-red-700
                         hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-300">
              Total Expenses
            </h3>
            <p className="text-3xl font-bold text-red-400 mt-2">
              ₹ {getTotalExpenses()}
            </p>
            <Link
              to="/manage-expense"
              className="inline-flex items-center mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm
                         hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <PlusCircle size={16} className="mr-2" /> Add Expense
            </Link>
          </div>

          <div
            className="bg-gray-800 p-6 rounded-xl shadow-xl border border-blue-700
                         hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-300">
              Current Balance
            </h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              ₹ {totalIncomeAmount - getTotalExpenses()}
            </p>
          </div>
        </div>

        {/* Expense Categories Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-10">
          <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
            Expense Breakdown by Category
          </h2>
          {getChartData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getChartData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {getChartData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#374151",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#E5E7EB" }}
                />
                <Legend
                  wrapperStyle={{ color: "#E5E7EB" }}
                  formatter={(value, entry, index) => (
                    <span
                      style={{
                        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-6">
              No expense data to display chart.
            </p>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="category-filter"
              className="block text-gray-300 font-medium text-sm mb-1"
            >
              <Filter size={16} className="inline mr-1" /> Filter by Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white
             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="start-date"
              className="block text-gray-300 font-medium text-sm mb-1"
            >
              <Calendar size={16} className="inline mr-1" /> Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="block text-gray-300 font-medium text-sm mb-1"
            >
              <Calendar size={16} className="inline mr-1" /> End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="search-term"
              className="block text-gray-300 font-medium text-sm mb-1"
            >
              <Search size={16} className="inline mr-1" /> Search
            </label>
            <input
              type="text"
              id="search-term"
              placeholder="Search by description or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700 mt-10">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-700 border-b border-gray-600">
            <h2 className="text-xl font-bold text-gray-200">
              Recent Transactions
            </h2>
            <button
              onClick={exportToExcel}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm
                          hover:bg-blue-700 transition duration-300 ease-in-out flex items-center"
            >
              <Download size={16} className="mr-2" /> Export to Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            {" "}
            {/* Ensures responsiveness for tables */}
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
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition duration-200"
                    >
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td
                        className={`px-4 py-3 capitalize font-medium flex items-center ${tx.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                          }`}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpCircle size={16} className="mr-1" />
                        ) : (
                          <ArrowDownCircle size={16} className="mr-1" />
                        )}
                        {tx.type}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{tx.category}</td>
                      <td className="px-4 py-3 text-gray-300">₹ {tx.amount}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {tx.description}
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-semibold text-xs
                                       hover:bg-yellow-600 transition duration-200 hover:scale-105"
                          onClick={() => handleEdit(tx)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs
                                       hover:bg-red-700 transition duration-200 hover:scale-105"
                          onClick={() => openDeleteModal(tx)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 py-6">
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredAndSearchedTransactions.length > transactionsPerPage && (
            <div className="flex justify-center items-center space-x-2 py-4 bg-gray-700 border-t border-gray-600">
              {[
                ...Array(
                  Math.ceil(
                    filteredAndSearchedTransactions.length / transactionsPerPage
                  )
                ).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 py-1 rounded-lg font-semibold text-sm
                                 ${currentPage === number + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }
                                 transition duration-200`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
        <Link
          to="/manage-income"
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700
                         transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300
                         flex items-center justify-center"
          title="Add Income"
        >
          <PlusCircle size={24} />
        </Link>
        <Link
          to="/manage-expense"
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700
                         transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300
                         flex items-center justify-center"
          title="Add Expense"
        >
          <PlusCircle size={24} />
        </Link>
      </div>

      {/* Custom Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-lg relative">
            <button
              onClick={() => setEditingTransaction(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
              Edit Transaction
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      date: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      amount: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={editingTransaction.description}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      description: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingTransaction.category}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      category: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="px-6 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && transactionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-sm relative text-center">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-red-400 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this transaction?
            </p>
            <p className="text-gray-400 text-sm mb-6">
              **{transactionToDelete.description}**
              <br />
              Amount: ₹ {transactionToDelete.amount}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(transactionToDelete._id)}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
}

export default Dashboard;
