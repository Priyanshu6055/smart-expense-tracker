import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Forgot Password Flow
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1); // 1=email, 2=otp+new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(0);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** ============== LOGIN SUBMIT ============== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.data.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  /** ============== FORGOT PASSWORD ============== */
  const sendOtp = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/profile/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP sent to your email");
        setStep(2);
        setTimer(600); // 5 minutes
      } else {
        setError(data.message);
      }
    } catch {
      setError("Error sending OTP");
    }
  };

  const resetPassword = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/profile/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password reset successful! Please login.");
        setShowForgot(false);
        setStep(1);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-950 p-4 font-inter">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up border border-blue-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          {showForgot ? "Forgot Password" : "Login to Your Account"}
        </h2>

        {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        {!showForgot ? (
          // ================= LOGIN FORM =================
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                required className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white" />
            </div>

            <div>
              <label className="block text-gray-300 font-medium">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                required className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white" />
            </div>

            <button type="submit" className="w-full bg-blue-600 py-3 rounded-lg text-white">Login</button>
          </form>
        ) : (
          // ================= FORGOT PASSWORD FORM =================
          <div className="space-y-4">
            {step === 1 && (
              <>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white"
                />
                <button onClick={sendOtp} className="w-full bg-blue-600 py-3 rounded-lg text-white">
                  Send OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white"
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white"
                />
                <button onClick={resetPassword} className="w-full bg-green-600 py-3 rounded-lg text-white">
                  Reset Password
                </button>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                </p>
              </>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          {!showForgot ? (
            <button className="text-blue-500 underline" onClick={() => setShowForgot(true)}>
              Forgot Password?
            </button>
          ) : (
            <button className="text-blue-500 underline" onClick={() => setShowForgot(false)}>
              Back to Login
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
