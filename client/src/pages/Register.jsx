import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || "Registration successful!");
        setFormData({ name: "", email: "", password: "" });

        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
          console.log("Saved Token:", data.data.token);
        }
      } else {
        setError(data.message || "Something went wrong during registration.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-950 p-4 font-inter">
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md
                   transform scale-95 opacity-0 animate-fade-in-up border border-purple-700"
      >
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Create Your Account</h2>

        {message && (
          <p className="text-green-400 text-sm text-center mb-4 transition-opacity duration-500">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4 transition-opacity duration-500">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg
                         bg-gray-700 text-white placeholder-gray-400
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         outline-none transition duration-200 ease-in-out
                         hover:border-purple-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg
                         bg-gray-700 text-white placeholder-gray-400
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         outline-none transition duration-200 ease-in-out
                         hover:border-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 font-medium">Create Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg
                         bg-gray-700 text-white placeholder-gray-400
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         outline-none transition duration-200 ease-in-out
                         hover:border-purple-500"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-purple-700 active:bg-purple-800
                       transition duration-300 ease-in-out
                       transform hover:-translate-y-1 hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-500 hover:underline
                       transition duration-200 ease-in-out"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Custom CSS for animations and font import */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        `}
      </style>
    </div>
  );
}

export default Register;
