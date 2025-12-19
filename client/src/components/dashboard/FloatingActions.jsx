import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import UpiPayButton from "../payments/UpiPayButton";

export default function FloatingActions({ onUpiPay }) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
      {/* UPI Pay */}
      <UpiPayButton onClick={onUpiPay} />

      {/* Add Income */}
      <Link
        to="/manage-income"
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700
                   transition duration-300 ease-in-out transform hover:scale-110
                   focus:outline-none focus:ring-4 focus:ring-green-300
                   flex items-center justify-center"
        title="Add Income"
      >
        <PlusCircle size={24} />
      </Link>

      {/* Add Expense */}
      <Link
        to="/manage-expense"
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700
                   transition duration-300 ease-in-out transform hover:scale-110
                   focus:outline-none focus:ring-4 focus:ring-red-300
                   flex items-center justify-center"
        title="Add Expense"
      >
        <PlusCircle size={24} />
      </Link>
    </div>
  );
}
