import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Change Email
  const handleEmailChange = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/profile/change-email`,
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  // Change Password
  const handlePasswordChange = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/profile/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter pt-20">
      <Navbar />
      <div
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md
                   transform scale-95 opacity-0 animate-fade-in-up border border-blue-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Profile Settings
        </h2>

        {/* Messages */}
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

        {/* Change Email */}
        <div className="space-y-3 mb-6">
          <label className="block text-gray-300 font-medium">New Email</label>
          <input
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out
                       hover:border-blue-500"
          />
          <button
            onClick={handleEmailChange}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                       hover:bg-blue-700 active:bg-blue-800
                       transition duration-300 ease-in-out
                       transform hover:-translate-y-1 hover:shadow-lg"
          >
            Change Email
          </button>
        </div>

        {/* Change Password */}
        <div className="space-y-3 mb-6">
          <label className="block text-gray-300 font-medium">Old Password</label>
          <input
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out
                       hover:border-blue-500"
          />
          <label className="block text-gray-300 font-medium">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg
                       bg-gray-700 text-white placeholder-gray-400
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       outline-none transition duration-200 ease-in-out
                       hover:border-blue-500"
          />
          <button
            onClick={handlePasswordChange}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold
                       hover:bg-green-700 active:bg-green-800
                       transition duration-300 ease-in-out
                       transform hover:-translate-y-1 hover:shadow-lg"
          >
            Change Password
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold
                     hover:bg-red-700 active:bg-red-800
                     transition duration-300 ease-in-out
                     transform hover:-translate-y-1 hover:shadow-lg"
        >
          Logout
        </button>
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
