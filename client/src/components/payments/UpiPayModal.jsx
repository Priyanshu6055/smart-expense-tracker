import { useState } from "react";
import { X } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

import QrScanner from "./QrScanner";
import { extractUpiFromQr } from "./upi.utils";

export default function UpiPayModal({ open, onClose, categories, onPay }) {
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState(""); // ✅ dynamic pn
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [paying, setPaying] = useState(false);

  if (!open) return null;

  const handlePay = async () => {
    if (paying) return;

    if (!upiId || !amount || !category) {
      setError("UPI ID, amount and category are required");
      return;
    }

    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
      setError("Invalid UPI ID format");
      return;
    }

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Invalid amount");
      return;
    }

    const finalAmount = amt.toFixed(2);

    // ✅ SAFE fallback if pn missing
    const finalPayeeName =
      payeeName ||
      upiId.split("@")[0].replace(/[^a-zA-Z ]/g, "") ||
      "UPI Payment";

    const txnNote = `Expense_${Date.now()}`;

    setError("");
    setPaying(true);

    // 1️⃣ Create pending expense
    await onPay({
      amount: finalAmount,
      category,
      description,
    });

    // 2️⃣ SAFE UPI URL (ANTI-FRAUD COMPLIANT)
    const upiUrl =
      `upi://pay` +
      `?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(finalPayeeName)}` +
      `&am=${finalAmount}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(txnNote)}`;

    // 3️⃣ Redirect ONCE
    window.location.href = upiUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl text-purple-400 font-bold mb-2 text-center">
          Pay via UPI
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-2">{error}</p>
        )}

        <button
          onClick={() => setShowScanner(true)}
          className="w-full mb-2 bg-gray-700 py-2 rounded text-white"
        >
          Scan QR to auto-fill UPI
        </button>

        {showScanner && (
          <QrScanner
            onScan={(text) => {
              const data = extractUpiFromQr(text);
              if (data?.pa) {
                setUpiId(data.pa);
                setPayeeName(data.pn || "");
                setShowScanner(false);
              } else {
                setError("Invalid UPI QR code");
              }
            }}
          />
        )}

        <input
          placeholder="UPI ID (name@upi)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        />

        <div className="flex items-center gap-2 mb-2 bg-gray-700 p-2 rounded">
          <FaRupeeSign />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent outline-none text-white"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
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
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        <button
          disabled={paying}
          onClick={handlePay}
          className={`w-full py-2 rounded font-semibold ${
            paying ? "bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {paying ? "Opening UPI…" : "Pay & Open UPI App"}
        </button>
      </div>
    </div>
  );
}
