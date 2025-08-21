import React, { useState } from "react";
import BudgetForm from "../components/BudgetForm";
import BudgetStatus from "../components/BudgetStatus";
import Navbar from "../components/Navbar";

const BudgetPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false); // popup state
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter pt-20">
      <Navbar />
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Budget Management
        </h2>

        {/* Add Budget Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            + Add Budget
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Budget Status */}
        <BudgetStatus month={month} year={year} />
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg relative border border-blue-700">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center text-blue-400 mb-4">
              Add New Budget
            </h3>

            <BudgetForm
              onBudgetAdded={() => {
                setRefresh(!refresh);
                setShowModal(false); // close popup after submit
              }}
            />
          </div>
        </div>
      )}

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

export default BudgetPage;
