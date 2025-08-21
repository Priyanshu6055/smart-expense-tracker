import React from "react";
import { Link } from "react-router-dom";

// The Navbar component using Link for routing
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-60 backdrop-blur-sm p-4 shadow-lg border-b border-blue-700">
    <div className="flex justify-center space-x-6 text-xl">
      {/* Dashboard link */}
      <Link
        to="/dashboard"
        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        Dashboard
      </Link>
      
      {/* Budget page link */}
      <Link
        to="/budget-page"
        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        Budget
      </Link>
      
      {/* Profile link */}
      <Link
        to="/profile"
        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
      >
        Profile
      </Link>
    </div>
  </nav>
);

export default Navbar;
