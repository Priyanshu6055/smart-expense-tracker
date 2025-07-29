import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, Lock } from 'lucide-react'; // Importing icons

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 font-inter
                    bg-gradient-to-br from-gray-900 to-blue-950"> {/* Changed background to blue tone */}
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-400 mb-6 leading-tight {/* Changed text color to blue-400 */}
                       transform translate-y-4 opacity-0 animate-fade-in-up-1">
          Smart Expense Tracker
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8
                      transform translate-y-4 opacity-0 animate-fade-in-up-2">
          Track your spending, manage your budget, and achieve financial freedom with ease.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg {/* Changed button colors to blue */}
                     hover:bg-blue-700 hover:shadow-xl transition duration-300 ease-in-out
                     transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 {/* Changed focus ring to blue */}
                     opacity-0 animate-fade-in-up-3"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-center px-4">
        {/* Feature Card 1 */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-700 {/* Changed border to blue-700 */}
                        hover:shadow-2xl transition-all duration-300 ease-in-out
                        transform hover:-translate-y-2 hover:scale-102
                        opacity-0 animate-fade-in-up-4">
          <div className="text-blue-500 mb-4 flex justify-center"> {/* Changed icon color to blue-500 */}
            <TrendingUp size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-blue-400 mb-3">Real-Time Insights</h3> {/* Changed text color to blue-400 */}
          <p className="text-gray-300 leading-relaxed">
            Monitor your daily expenses with detailed analytics and visual charts, helping you make informed decisions.
          </p>
        </div>

        {/* Feature Card 2 */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-700 {/* Changed border to blue-700 */}
                        hover:shadow-2xl transition-all duration-300 ease-in-out
                        transform hover:-translate-y-2 hover:scale-102
                        opacity-0 animate-fade-in-up-5">
          <div className="text-blue-500 mb-4 flex justify-center"> {/* Changed icon color to blue-500 */}
            <DollarSign size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-blue-400 mb-3">Custom Budgets</h3> {/* Changed text color to blue-400 */}
          <p className="text-gray-300 leading-relaxed">
            Set your own spending limits for various categories and let the app intelligently guide your finances.
          </p>
        </div>

        {/* Feature Card 3 */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-700 {/* Changed border to blue-700 */}
                        hover:shadow-2xl transition-all duration-300 ease-in-out
                        transform hover:-translate-y-2 hover:scale-102
                        opacity-0 animate-fade-in-up-6">
          <div className="text-blue-500 mb-4 flex justify-center"> {/* Changed icon color to blue-500 */}
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-blue-400 mb-3">Secure & Private</h3> {/* Changed text color to blue-400 */}
          <p className="text-gray-300 leading-relaxed">
            Your financial data is encrypted and protected with industry-leading security. Privacy is our top priority.
          </p>
        </div>
      </div>

      {/* Custom CSS for animations (since we can't use tailwind.config.js) */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up-1 {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.1s;
        }
        .animate-fade-in-up-2 {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
        .animate-fade-in-up-3 {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.5s;
        }
        .animate-fade-in-up-4 {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.7s;
        }
        .animate-fade-in-up-5 {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.9s;
        }
        .animate-fade-in-up-6 {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 1.1s;
        }
        `}
      </style>
    </div>
  );
}

export default Home;
