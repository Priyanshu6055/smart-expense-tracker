import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiCalendar } from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BudgetList = ({ refresh }) => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBudgets = async () => {
    setError("");
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

  // Filtering logic based on user input for category, month, and year.
  const filteredBudgets = budgets.filter(b => {
    const matchesCategory = b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = searchMonth === "" || b.month.toString() === searchMonth;
    const matchesYear = searchYear === "" || b.year.toString() === searchYear;
    return matchesCategory && matchesMonth && matchesYear;
  });

  // Pagination logic to display only a subset of the filtered data.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBudgets = filteredBudgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900"> 
    <div
      className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md
                 transform scale-95 opacity-0 animate-fade-in-up border border-purple-700"
    >
      <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">
        Your Budgets
      </h2>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4 transition-opacity duration-500">
          {error}
        </p>
      )}

      {/* Search and Filter Section with updated colors */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by category..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <select
            value={searchMonth}
            onChange={(e) => { setSearchMonth(e.target.value); setCurrentPage(1); }}
            className="w-1/2 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">All Months</option>
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Year"
            value={searchYear}
            onChange={(e) => { setSearchYear(e.target.value); setCurrentPage(1); }}
            className="w-1/2 px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      {/* Budget List Display */}
      {paginatedBudgets.length === 0 ? (
        <p className="text-gray-400 text-center">No budgets found matching your search criteria.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {paginatedBudgets.map((b) => (
              <li
                key={b._id}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600
                           transition duration-300 ease-in-out hover:scale-105"
              >
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-xl font-medium text-gray-200">
                    {b.category}
                  </strong>
                  <span className="text-xl font-semibold text-purple-300">
                    ₹{b.amount}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {months[b.month]} {b.year}
                </p>
              </li>
            ))}
          </ul>
          
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
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
    </div>
  );
};

export default BudgetList;
