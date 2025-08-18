import React, { useState } from "react";
import BudgetForm from "../components/BudgetForm";
import BudgetList from "../components/BudgetList";
import BudgetStatus from "../components/BudgetStatus";

const BudgetPage = () => {
  const [refresh, setRefresh] = useState(false);
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter">
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Budget Management
        </h2>

        {/* Budget Form */}
        <BudgetForm onBudgetAdded={() => setRefresh(!refresh)} />

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Budget List */}
        <BudgetList key={refresh} />

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Budget Status */}
        <BudgetStatus month={month} year={year} />
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

export default BudgetPage;
