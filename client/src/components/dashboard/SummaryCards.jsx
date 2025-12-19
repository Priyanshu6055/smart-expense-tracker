import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function SummaryCards({ totalIncome, totalExpense }) {
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Income */}
      <div className="bg-gray-800 p-6 rounded-xl border border-green-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Total Income (This Month)
        </h3>
        <p className="text-3xl font-bold text-green-400">₹ {totalIncome}</p>
        <Link
          to="/manage-income"
          className="inline-flex items-center mt-4 bg-blue-600 px-4 py-2 rounded-lg text-sm"
        >
          <PlusCircle size={16} className="mr-2" /> Customize Income
        </Link>
      </div>

      {/* Expense */}
      <div className="bg-gray-800 p-6 rounded-xl border border-red-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Total Expenses (This Month)
        </h3>
        <p className="text-3xl font-bold text-red-400">₹ {totalExpense}</p>
        <Link
          to="/manage-expense"
          className="inline-flex items-center mt-4 bg-blue-600 px-4 py-2 rounded-lg text-sm"
        >
          <PlusCircle size={16} className="mr-2" /> Add Expense
        </Link>
      </div>

      {/* Balance */}
      <div className="bg-gray-800 p-6 rounded-xl border border-blue-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Current Balance
        </h3>
        <p className="text-3xl font-bold text-blue-400">₹ {balance}</p>
      </div>
    </div>
  );
}
