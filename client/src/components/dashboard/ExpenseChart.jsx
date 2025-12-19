import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00bcd4",
  "#f44336", "#9c27b0", "#673ab7",
];

function ExpenseChart({ transactions }) {
  const data = {};

  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      data[tx.category] = (data[tx.category] || 0) + tx.amount;
    });

  const chartData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-10">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
        Expense Breakdown by Category
      </h2>

      {chartData.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={100}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-400">
          No expense data available
        </p>
      )}
    </div>
  );
}

export default ExpenseChart;
