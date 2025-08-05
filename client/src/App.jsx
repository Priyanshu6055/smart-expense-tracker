import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"; // Assuming Home.jsx is in src/pages
import Register from "./pages/Register"; // Assuming Register.jsx is in src/pages
import Login from "./pages/Login"; // Assuming Login.jsx is in src/pages
import Dashboard from "./pages/Dashboard"; // ✅ add this at the top
import IncomeManager from "./components/IncomeManager";
import ExpenseManager from "./components/AddExpense";


function App() {
  return (
    <Router>
      {/* Main container with a dark blue gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 font-inter">
        {/* Navigation bar with dark background, shadow, rounded corners, and a blue bottom border */}
        <nav className="bg-gray-800 p-4 md:p-6 shadow-xl rounded-b-3xl flex justify-center items-center space-x-6 md:space-x-12
                        transform -translate-y-full opacity-0 animate-slide-down-fade
                        border-b-4 border-blue-700">
          {/* Home Link */}
          <Link
            to="/"
            className="text-lg md:text-xl font-bold text-blue-400 hover:text-blue-200 {/* Changed link colors to blue tones */}
                       transition duration-300 ease-in-out transform hover:scale-110 hover:skew-x-1
                       relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          {/* Login Link */}
          <Link
            to="/login"
            className="text-lg md:text-xl font-bold text-blue-400 hover:text-blue-200 {/* Changed link colors to blue tones */}
                       transition duration-300 ease-in-out transform hover:scale-110 hover:skew-x-1
                       relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Login
          </Link>
          {/* Register Link */}
          <Link
            to="/register"
            className="text-lg md:text-xl font-bold text-blue-400 hover:text-blue-200 {/* Changed link colors to blue tones */}
                       transition duration-300 ease-in-out transform hover:scale-110 hover:skew-x-1
                       relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Register
          </Link>
        </nav>

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-income" element={<IncomeManager />} />
          <Route path="/manage-expense" element={<ExpenseManager />} />

        </Routes>
      </div>

      {/* Custom CSS for animations and font import */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down-fade {
          animation: slideDownFade 0.7s ease-out forwards;
          animation-delay: 0.2s;
        }
        `}
      </style>
    </Router>
  );
}

export default App;
