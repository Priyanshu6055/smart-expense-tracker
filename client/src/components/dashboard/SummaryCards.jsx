import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SummaryCards({ totalIncome, totalExpense }) {
  const balance = totalIncome - totalExpense;

  const [showAmounts, setShowAmount] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showTotalAmount, setShowTotalAmount] = useState(false);
  
  const toggleVisibility = () => {
    setShowAmount((prev) => !prev);
  };

  const toggleVisibilityExpense = () => {
    setShowExpense((prev) => !prev);
  };

  const toggleVisibilityTotalAmount = () => {
    setShowTotalAmount((prev) => !prev);
  };



  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-10">
      {/* Income */}
      <div className="bg-gray-800 p-6 rounded-xl border border-green-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Total Income (This Month)
        </h3>

        <div className="flex gap-2 items-center">
          <p className="text-sm md:text-3xl font-bold text-green-400">
            {showAmounts ? `₹ ${totalIncome}` : "₹ •••••"}
          </p>

          <button onClick={toggleVisibility} className="text-gray-400">
            {showAmounts ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Link
          to="/manage-income"
          className="inline-flex items-center mt-4 bg-blue-600 px-2 py-2 rounded-lg text-sm"
        >
          <PlusCircle size={16} className="mr-2" /> Customize Income
        </Link>
      </div>

      {/* Expense */}
      <div className="bg-gray-800 p-6 rounded-xl border border-red-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Total Expenses (This Month)
        </h3>


        <div className="flex gap-2 items-center">
          <p className="text-sm md:text-3xl font-bold text-red-400">
            {showExpense ? `₹ ${totalExpense}` : "₹ •••••"}
          </p>

          <button onClick={toggleVisibilityExpense} className="text-gray-400">
            {showExpense ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Link
          to="/manage-expense"
          className="inline-flex items-center mt-4 bg-blue-600 px-4 py-2 rounded-lg text-sm"
        >
          <PlusCircle size={16} className="mr-2" /> Add Expense
        </Link>
      </div>

      {/* Balance */}
      <div className="bg-gray-800 p-6 rounded-xl border border-blue-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Current Balance
        </h3>
                <div className="flex gap-2 items-center">
          <p className="text-sm md:text-3xl font-bold text-blue-400">
            {showTotalAmount ? `₹ ${balance}` : "₹ •••••"}
          </p>

          <button onClick={toggleVisibilityTotalAmount} className="text-gray-400">
            {showTotalAmount ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
