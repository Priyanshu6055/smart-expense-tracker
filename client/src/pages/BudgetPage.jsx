import React, { useState } from "react";
import BudgetForm from "../components/BudgetForm";
import BudgetStatus from "../components/BudgetStatus";
import Navbar from "../components/Navbar";

const BudgetPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const year = new Date().getFullYear();

  // Parses AI suggestion text into JSX with headings, lists, and highlights
const parseSuggestions = (text) => {
  if (!text) return null;

  // Clean the input text by removing all asterisks (*)
  const cleanText = text.replace(/\*/g, "");

  // Split cleaned text by new lines and parse sections
  const lines = cleanText.split("\n").filter(line => line.trim() !== "");
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("###")) {
      elements.push(
        <h3 key={key++} className="text-xl font-semibold text-blue-400 my-3">
          {line.replace(/^###\s*/, "")}
        </h3>
      );
      continue;
    }
    if (/^\d+\./.test(line)) {
      const items = [];
      // Gather all numbered list items
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ""));
        i++;
      }
      i--;
      elements.push(
        <ol key={key++} className="list-decimal list-inside mb-4 text-gray-300">
          {items.map((item, idx) => (
            <li key={idx} className="mb-1">{item}</li>
          ))}
        </ol>
      );
      continue;
    }
    if (/^- /.test(line)) {
      const items = [];
      // Gather all bullet list items
      while (i < lines.length && /^- /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^- /, ""));
        i++;
      }
      i--;
      elements.push(
        <ul key={key++} className="list-disc list-inside ml-6 mb-4 text-gray-400">
          {items.map((item, idx) => (
            <li key={idx} className="mb-1">{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Highlight key phrases like "Overspending", "Action", "Budget", "Spent"
    let formattedLine = line.replace(
      /(Overspending|Action|Budget|Spent|unused|critical issue)/gi,
      (match) => `<span class="font-semibold text-yellow-300">${match}</span>`
    );

    elements.push(
      <p
        key={key++}
        className="text-gray-300 mb-2"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    );
  }

  return elements;
};


  const fetchSuggestion = async () => {
    setSuggestions(null);
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const res = await fetch(
        `${API_URL}/api/budget/suggestion?month=${month}&year=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestion:", err);
      setError("Failed to fetch suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter pt-20">
      <Navbar />
      <div
        className="bg-gray-800 p-2 rounded-xl shadow-2xl w-full max-w-2xl
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Budget Management
        </h2>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            + Add Budget
          </button>
          <button
            onClick={fetchSuggestion}
            disabled={loading}
            className={`px-6 py-2 rounded-lg shadow-md transition duration-200 ${
              loading
                ? "bg-green-800 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {loading ? "Getting AI Suggestions..." : "Get AI Suggestions"}
          </button>
        </div>

        <div className="border-t border-gray-700 my-6"></div>

        <BudgetStatus month={month} year={year} refresh={refresh} />

        <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-blue-700 shadow-lg min-h-[100px] flex flex-col">
          {loading ? (
            <p className="text-blue-400 animate-pulse text-center">
              <span className="text-xl">...</span> Fetching suggestions...
            </p>
          ) : error ? (
            <p className="text-red-400 font-semibold text-center">{error}</p>
          ) : suggestions?.data?.suggestion ? (
            <div className="overflow-y-auto max-h-96 px-2">
              {parseSuggestions(suggestions.data.suggestion.content || suggestions.data.suggestion)}
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              Click 'Get Suggestions' to see AI-powered tips based on your spending.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg relative border border-blue-700 animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl p-2 rounded-full hover:bg-gray-700 transition"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-center text-blue-400 mb-4">
              Add New Budget
            </h3>
            <BudgetForm
              onBudgetAdded={() => {
                setRefresh(!refresh);
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default BudgetPage;
