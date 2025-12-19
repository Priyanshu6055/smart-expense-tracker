import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// -------- Payments --------
import UpiPayButton from "../components/payments/UpiPayButton";
import UpiPayModal from "../components/payments/UpiPayModal";
import PaymentConfirmModal from "../components/payments/PaymentConfirmModal";
import useUpiPayment from "../components/payments/useUpiPayment";

// -------- Dashboard Components --------
import SummaryCards from "../components/dashboard/SummaryCards";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import FiltersBar from "../components/dashboard/FiltersBar";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import FloatingActions from "../components/dashboard/FloatingActions";
import EditTransactionModal from "../components/dashboard/EditTransactionModal";
import DeleteConfirmModal from "../components/dashboard/DeleteConfirmModal";

function Dashboard() {
  // ---------------- STATE ----------------
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Modals
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // ---------------- GUARD ----------------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Authentication required. Please login again.
      </div>
    );
  }

  // ---------------- FETCH FUNCTIONS ----------------
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const safeError = (err, fallback) => {
    console.error(err);
    return err?.response?.data?.message || fallback;
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`, authHeader);
      setCategories(res.data?.data || []);
    } catch (err) {
      setError(safeError(err, "Failed to load categories"));
    }
  };

  const fetchTransactions = async () => {
    try {
      let url = `${API_URL}/api/expenses`;
      const params = new URLSearchParams();

      if (selectedCategory) params.append("category", selectedCategory);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url, authHeader);
      setTransactions(res.data?.data || []);
    } catch (err) {
      setError(safeError(err, "Failed to fetch transactions"));
    }
  };

  const fetchTotalMonthlyIncome = async () => {
    try {
      const d = new Date();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();

      const res = await axios.get(
        `${API_URL}/api/income/monthly?month=${month}&year=${year}`,
        authHeader
      );

      setTotalIncomeAmount(res.data?.totalIncome || 0);
    } catch (err) {
      setError(safeError(err, "Failed to load income summary"));
    }
  };

  const fetchMonthlyExpense = async () => {
    try {
      const d = new Date();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();

      const res = await axios.get(
        `${API_URL}/api/expenses/summary?month=${month}&year=${year}`,
        authHeader
      );

      setMonthlyExpense(res.data?.expense || 0);
    } catch (err) {
      setError(safeError(err, "Failed to load expense summary"));
    }
  };

  // ---------------- CRUD HANDLERS ----------------
  const handleEdit = (tx) => {
    if (!tx) return;
    setEditingTransaction({ ...tx, date: tx.date?.split("T")[0] });
  };

  const handleUpdate = async (updatedTx) => {
    try {
      await axios.put(
        `${API_URL}/api/expenses/${updatedTx._id}`,
        updatedTx,
        authHeader
      );
      setEditingTransaction(null);
      fetchTransactions();
      fetchMonthlyExpense();
    } catch (err) {
      setError(safeError(err, "Failed to update transaction"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`, authHeader);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      fetchTransactions();
      fetchMonthlyExpense();
    } catch (err) {
      setError(safeError(err, "Failed to delete transaction"));
    }
  };

  // ---------------- FILTER + PAGINATION ----------------
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirst,
    indexOfLast
  );

  // ---------------- UPI PAYMENT ----------------
  const upi = useUpiPayment(API_URL, token, () => {
    fetchTransactions();
    fetchMonthlyExpense();
  });

  // ---------------- EFFECT ----------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchCategories(),
        fetchTransactions(),
        fetchTotalMonthlyIncome(),
        fetchMonthlyExpense(),
      ]);
      setLoading(false);
    })();
  }, [selectedCategory, startDate, endDate]);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-300">
        Loading dashboard…
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 text-gray-100 px-4 py-12">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
          Dashboard
        </h1>

        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-300 p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <SummaryCards
          totalIncome={totalIncomeAmount}
          totalExpense={monthlyExpense}
        />

        <ExpenseChart transactions={transactions || []} />

        <FiltersBar
          categories={categories || []}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <TransactionsTable
          transactions={currentTransactions || []}
          currentPage={currentPage}
          totalItems={filteredTransactions.length}
          itemsPerPage={transactionsPerPage}
          paginate={setCurrentPage}
          onEdit={handleEdit}
          onDelete={(tx) => {
            setTransactionToDelete(tx);
            setIsDeleteModalOpen(true);
          }}
        />
      </div>

      <FloatingActions onUpiPay={() => setIsPayModalOpen(true)} />

      <UpiPayModal
        open={isPayModalOpen}
        categories={categories}
        onClose={() => setIsPayModalOpen(false)}
        onPay={(payload) => {
          setIsPayModalOpen(false);
          upi.initiatePayment(payload);
        }}
      />

      <PaymentConfirmModal
        open={upi.showConfirm}
        onConfirm={upi.confirmPayment}
      />

      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleUpdate}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        transaction={transactionToDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(transactionToDelete?._id)}
      />
    </div>
  );
}

export default Dashboard;
