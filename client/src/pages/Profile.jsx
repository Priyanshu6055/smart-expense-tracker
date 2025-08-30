import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // OTP Flow
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const currentEmail = user?.email;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Validation helpers
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isStrongPassword = (password) =>
    password.length >= 6; // Simple length check, can be improved

  const isValidOtp = (code) => /^\d{6}$/.test(code.trim());

  // Change Email Handler
  const handleEmailChange = async () => {
    setMessage("");
    setError("");
    if (!isValidEmail(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/profile/change-email`,
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Change Password Handler (Old Password mode)
  const handlePasswordChange = async () => {
    setMessage("");
    setError("");
    if (!oldPassword) {
      setError("Please enter your old password.");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/profile/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP Handler
  const sendOtp = async () => {
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/profile/forgot-password`, {
        email: currentEmail,
      });
      setMessage("OTP sent to your email");
      setOtpSent(true);
      setTimer(600);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Reset password using OTP Handler
  const resetPasswordWithOtp = async () => {
    setMessage("");
    setError("");
    if (!isValidOtp(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/profile/reset-password`, {
        email: currentEmail,
        otp,
        newPassword,
      });
      setMessage("Password reset successful");
      setOtpMode(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter pt-20">
      <Navbar />
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up border border-blue-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Profile Settings
        </h2>

        {/* Messages */}
        {message && (
          <p className="text-green-400 text-sm text-center mb-4 select-none">{message}</p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4 select-none">{error}</p>
        )}

        {/* Hide Change Email and Logout when otpMode is true */}
        {!otpMode && (
          <>
            {/* Change Email */}
            <div className="space-y-3 mb-6">
              <label className="block text-gray-300 font-medium">New Email</label>
              <input
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleEmailChange}
                className={`w-full py-2 rounded-lg font-semibold transition-colors duration-300 
                  ${
                    !isValidEmail(newEmail) || loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                disabled={!isValidEmail(newEmail) || loading}
              >
                {loading ? "Processing..." : "Change Email"}
              </button>
            </div>
          </>
        )}

        {/* Change Password (two modes) */}
        {!otpMode ? (
          // OLD PASSWORD METHOD
          <div className="space-y-3 mb-6">
            <label className="block text-gray-300 font-medium">Old Password</label>
            <input
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <label className="block text-gray-300 font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handlePasswordChange}
              className={`w-full py-2 rounded-lg font-semibold transition-colors duration-300 
                ${
                  (!oldPassword || !isStrongPassword(newPassword) || loading)
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              disabled={!oldPassword || !isStrongPassword(newPassword) || loading}
            >
              {loading ? "Processing..." : "Change Password"}
            </button>

            <p className="text-sm text-gray-400 mt-3 text-center select-none">
              Forgot old password?{" "}
              <button
                onClick={() => {
                  setOtpMode(true);
                  setMessage("");
                  setError("");
                }}
                className="text-blue-500 underline"
                disabled={loading}
              >
                Use OTP instead
              </button>
            </p>
          </div>
        ) : (
          // OTP FLOW
          <div className="space-y-3 mb-6">
            {!otpSent ? (
              <>
                <p className="text-gray-300 text-sm text-center mb-2 select-none">
                  We will send OTP to: <span className="font-semibold">{currentEmail}</span>
                </p>
                <button
                  onClick={sendOtp}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors duration-300 ${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
                <p className="text-sm text-gray-400 mt-3 text-center select-none">
                  <button
                    onClick={() => {
                      setOtpMode(false);
                      setMessage("");
                      setError("");
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-blue-500 underline"
                    disabled={loading}
                  >
                    Back to Old Password Method
                  </button>
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={resetPasswordWithOtp}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors duration-300 ${
                    !/^\d{6}$/.test(otp) || !isStrongPassword(newPassword) || loading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                  disabled={!/^\d{6}$/.test(otp) || !isStrongPassword(newPassword) || loading}
                >
                  {loading ? "Processing..." : "Reset Password"}
                </button>
                <p className="text-gray-400 text-sm text-center mt-2 select-none">
                  Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </p>
              </>
            )}
          </div>
        )}

        {/* Logout button hidden in OTP mode */}
        {!otpMode && (
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
