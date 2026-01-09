import { Link } from "react-router-dom";
import { PlusCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SummaryCards({ totalIncome, totalExpense }) {
  const balance = totalIncome - totalExpense;

  const [showAmounts, setShowAmount] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showTotalAmount, setShowTotalAmount] = useState(false);

  const toggleVisibility = () => setShowAmount(prev => !prev);
  const toggleVisibilityExpense = () => setShowExpense(prev => !prev);
  const toggleVisibilityTotalAmount = () => setShowTotalAmount(prev => !prev);

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-10">

      {/* Income */}
      <div className="bg-gray-800 p-3 md:p-6 rounded-lg md:rounded-xl border border-green-700">
        <h3 className="text-[10px] md:text-sm font-semibold text-gray-300 mb-1 md:mb-2">
          Total Income
        </h3>

        <div className="flex gap-1 md:gap-2 items-center">
          <p className="text-xs md:text-3xl font-bold text-green-400">
            {showAmounts ? `₹ ${totalIncome}` : "₹ •••••"}
          </p>

          <button onClick={toggleVisibility} className="text-gray-400">
            {showAmounts ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <Link
          to="/manage-income"
          className="inline-flex items-center mt-2 md:mt-4 bg-blue-600 px-1.5 py-1 md:px-3 md:py-2 rounded text-[9px] md:text-sm"
        >
          <PlusCircle size={12} className="mr-1" />
          Add
        </Link>
      </div>

      {/* Expense */}
      <div className="bg-gray-800 p-3 md:p-6 rounded-lg md:rounded-xl border border-red-700">
        <h3 className="text-[10px] md:text-sm font-semibold text-gray-300 mb-1 md:mb-2">
          Expenses
        </h3>

        <div className="flex gap-1 md:gap-2 items-center">
          <p className="text-xs md:text-3xl font-bold text-red-400">
            {showExpense ? `₹ ${totalExpense}` : "₹ •••••"}
          </p>

          <button onClick={toggleVisibilityExpense} className="text-gray-400">
            {showExpense ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <Link
          to="/manage-expense"
          className="inline-flex items-center mt-2 md:mt-4 bg-blue-600 px-1.5 py-1 md:px-3 md:py-2 rounded text-[9px] md:text-sm"
        >
          <PlusCircle size={12} className="mr-1" />
          Add
        </Link>
      </div>

      {/* Balance */}
      <div className="bg-gray-800 p-3 md:p-6 rounded-lg md:rounded-xl border border-blue-700">
        <h3 className="text-[10px] md:text-sm font-semibold text-gray-300 mb-1 md:mb-2">
          Balance
        </h3>

        <div className="flex gap-1 md:gap-2 items-center">
          <p className="text-xs md:text-3xl font-bold text-blue-400">
            {showTotalAmount ? `₹ ${balance}` : "₹ •••••"}
          </p>

          <button
            onClick={toggleVisibilityTotalAmount}
            className="text-gray-400"
          >
            {showTotalAmount ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

    </div>
  );
}
