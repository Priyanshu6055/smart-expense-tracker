import { useState } from "react";
import { X } from "lucide-react";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";
import { FaRupeeSign } from "react-icons/fa";

import QrScanner from "./QrScanner";
import { extractUpiFromQr } from "./upi.utils";

const UPI_APPS = [
  { id: "PHONEPE", label: "PhonePe", icon: <SiPhonepe size={28} /> },
  { id: "GPAY", label: "Google Pay", icon: <SiGooglepay size={28} /> },
  { id: "PAYTM", label: "Paytm", icon: <SiPaytm size={28} /> },
];

export default function UpiPayModal({ open, onClose, categories, onPay }) {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedApp, setSelectedApp] = useState("PHONEPE");
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  if (!open) return null;

  const handlePay = async () => {
    if (!upiId || !amount || !category) {
      setError("UPI ID, amount and category are required");
      return;
    }

    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
      setError("Invalid UPI ID format");
      return;
    }

    setError("");

    // 1️⃣ Create pending expense
    await onPay({ amount, category, description });

    // 2️⃣ Build UPI intent (FULL CONTROL)
    const upiUrl = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&am=${encodeURIComponent(amount)}&cu=INR`;

    // 3️⃣ Redirect to UPI app
    window.location.href = upiUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm relative">

        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl text-purple-400 font-bold mb-4 text-center">
          Pay via UPI
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        {/* 🔍 Scan QR */}
        <button
          onClick={() => setShowScanner(true)}
          className="w-full mb-3 bg-gray-700 py-2 rounded text-white hover:bg-gray-600 transition"
        >
          Scan QR to auto-fill UPI ID
        </button>

        {/* 📷 QR Scanner */}
        {showScanner && (
          <QrScanner
            onScan={(text) => {
              const extractedUpi = extractUpiFromQr(text);

              if (extractedUpi) {
                setUpiId(extractedUpi);
                setShowScanner(false);
              } else {
                setError("Invalid UPI QR code");
              }
            }}
            onError={() => setError("Camera error or permission denied")}
          />
        )}

        {/* 🔹 UPI ID */}
        <input
          placeholder="UPI ID (e.g. name@upi)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        {/* 💰 Amount */}
        <div className="flex items-center gap-2 mb-3 bg-gray-700 p-2 rounded">
          <FaRupeeSign />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent outline-none text-white"
          />
        </div>

        {/* 📂 Category */}
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

        {/* 📝 Description */}
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        {/* 🔥 UPI App Selection */}
        <div className="flex justify-between gap-3 mb-4">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border
                ${selectedApp === app.id
                  ? "border-purple-500 bg-gray-700"
                  : "border-gray-600 bg-gray-800"}
              `}
            >
              {app.icon}
              <span className="text-xs">{app.label}</span>
            </button>
          ))}
        </div>

        {/* 🚀 PAY */}
        <button
          onClick={handlePay}
          className="w-full bg-purple-600 py-2 rounded font-semibold hover:bg-purple-700 transition"
        >
          Pay & Open UPI App
        </button>
      </div>
    </div>
  );
}
