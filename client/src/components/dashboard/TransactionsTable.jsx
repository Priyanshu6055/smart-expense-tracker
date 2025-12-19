import { ArrowUpCircle, ArrowDownCircle, Download } from "lucide-react";

export default function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
  currentPage,
  totalItems,
  itemsPerPage,
  paginate,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="bg-gray-800 shadow-xl rounded-xl border border-gray-700 mt-10">
      <div className="flex justify-between px-6 py-4 bg-gray-700">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-gray-700">
                  <td className="px-4 py-3">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center">
                    {tx.type === "income" ? (
                      <ArrowUpCircle size={16} className="mr-1 text-green-400" />
                    ) : (
                      <ArrowDownCircle size={16} className="mr-1 text-red-400" />
                    )}
                    {tx.type}
                  </td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3">₹ {tx.amount}</td>
                  <td className="px-4 py-3">{tx.description}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="bg-yellow-500 px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="bg-red-600 px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4 bg-gray-700">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
