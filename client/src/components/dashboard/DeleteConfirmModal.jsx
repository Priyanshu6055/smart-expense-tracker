import { X } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  transaction,
  onCancel,
  onConfirm,
}) {
  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-sm relative text-center">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-red-400 mb-4">
          Confirm Deletion
        </h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this transaction?
        </p>

        <p className="text-gray-400 text-sm mb-6">
          <strong>{transaction.description}</strong>
          <br />
          Amount: ₹ {transaction.amount}
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
