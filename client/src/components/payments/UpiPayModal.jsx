import { useState, useEffect } from "react";
import { X } from "lucide-react";

const UPI_APPS = [
  { id: "ANY", label: "Any UPI App" },
  { id: "GPAY", label: "Google Pay" },
  { id: "PHONEPE", label: "PhonePe" },
  { id: "PAYTM", label: "Paytm" },
];

export default function UpiPayModal({ open, onClose, categories, onPay }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [upiApp, setUpiApp] = useState("ANY");
  const [error, setError] = useState("");

  // 🔁 Load last selected UPI app
  useEffect(() => {
    const lastUpi = localStorage.getItem("preferredUpiApp");
    if (lastUpi) setUpiApp(lastUpi);
  }, []);

  if (!open) return null;

  const handlePay = () => {
    if (!amount || !category) {
      setError("Amount and category are required");
      return;
    }

    setError("");

    // 💾 Save preferred UPI app
    localStorage.setItem("preferredUpiApp", upiApp);

    onPay({
      amount,
      category,
      description,
      upiApp, // 👈 important
    });

    // Optional reset
    setAmount("");
    setCategory("");
    setDescription("");
  };

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
          Pay & Track (UPI)
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        {/* Category */}
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

        {/* Description */}
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        {/* ✅ UPI App Selector */}
        <select
          value={upiApp}
          onChange={(e) => setUpiApp(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        >
          {UPI_APPS.map((app) => (
            <option key={app.id} value={app.id}>
              {app.label}
            </option>
          ))}
        </select>

        <button
          onClick={handlePay}
          className="w-full bg-purple-600 py-2 rounded font-semibold hover:bg-purple-700 transition"
        >
          Pay via UPI
        </button>
      </div>
    </div>
  );
}
