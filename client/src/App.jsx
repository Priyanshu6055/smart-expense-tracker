import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IncomeManager from "./components/IncomeManager";
import ExpenseManager from "./components/AddExpense";
import BudgetPage from "./pages/BudgetPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  // Only show nav on these routes
  const showNav = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 font-inter">
      {showNav && (
        <nav className="bg-gray-800 p-4 md:p-6 shadow-xl flex justify-center items-center space-x-6 md:space-x-12
                        transform -translate-y-full opacity-0 animate-slide-down-fade
                        border-b-4 border-blue-700">
          {/* Home Link */}
          <Link
            to="/"
            className="text-lg md:text-xl font-bold text-blue-400 hover:text-blue-200 
                       transition duration-300 ease-in-out transform hover:scale-110 hover:skew-x-1
                       relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>

          {/* Login Link */}
          <Link
            to="/login"
            className="text-lg md:text-xl font-bold text-blue-400 hover:text-blue-200 
                       transition duration-300 ease-in-out transform hover:scale-110 hover:skew-x-1
                       relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Login
          </Link>

          {/* Register Link */}
          <Link
            to="/register"
            className="text-lg md:text-xl font-bold text-blue-400 hover:text-blue-200 
                       transition duration-300 ease-in-out transform hover:scale-110 hover:skew-x-1
                       relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                       after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Register
          </Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-income" element={<IncomeManager />} />
        <Route path="/manage-expense" element={<ExpenseManager />} />
        <Route path="/budget-page" element={<BudgetPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>

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
    </div>
  );
}

export default App;
