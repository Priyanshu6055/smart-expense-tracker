export default function UpiPayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-purple-600 text-white p-4 rounded-full shadow-lg
                 hover:bg-purple-700 transition hover:scale-110"
      title="Pay & Track (UPI)"
    >
      ₹
    </button>
  );
}
