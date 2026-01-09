import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditTransactionModal({
  transaction,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (transaction) {
      setForm(transaction);
    }
  }, [transaction]);

  if (!form) return null;

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleClose = () => {
    setForm(null);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    handleClose(); // ✅ close after save
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          Edit Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          <input
            type="number"
            value={form.amount}
            onChange={(e) => handleChange("amount", Number(e.target.value))}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          <input
            type="text"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-600 rounded text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 rounded text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
