export default function PaymentConfirmModal({ open, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl text-center w-full max-w-sm">
        <h2 className="text-green-400 text-lg font-bold mb-4">
          Payment Confirmation
        </h2>
        <p className="text-gray-300 mb-6">
          Was your UPI payment successful?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onConfirm("confirmed")}
            className="bg-green-600 px-6 py-2 rounded text-white"
          >
            Yes
          </button>
          <button
            onClick={() => onConfirm("failed")}
            className="bg-red-600 px-6 py-2 rounded text-white"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
