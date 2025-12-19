import { useState } from "react";
import { X } from "lucide-react";

export default function UpiPayModal({ open, onClose, categories, onPay }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm relative">

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl text-purple-400 font-bold mb-4 text-center">
          Pay & Track
        </h2>

        <input
          type="number"
          placeholder="Amount ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        >
          <option value="">Select Category</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        <button
          onClick={() => onPay({ amount, category, description })}
          className="w-full bg-purple-600 py-2 rounded font-semibold hover:bg-purple-700 transition"
        >
          Pay via UPI
        </button>
      </div>
    </div>
  );
}
