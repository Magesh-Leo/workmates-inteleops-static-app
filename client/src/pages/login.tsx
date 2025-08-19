import { loginAPI } from "@/api/auth/login";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { login, token } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (token) setLocation("/dashboard");
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginAPI(username, password);
      if (data.success) {
        setLocation("/dashboard");
        login(data.token);
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-gradient-to-br from-blue-900 via-blue-800 to-black"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[url('/assets/bg-pattern.svg')] opacity-20 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl space-y-3">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo.png" alt="IntelliOps" className="w-24 h-24" />
          {/* <h1 className="text-3xl font-extrabold text-white tracking-wide">
            IntelliOps
          </h1> */}
        </div>

        <h2 className="text-xl font-semibold text-gray-100 text-center">
          Welcome Back
        </h2>
        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/30 rounded-md p-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900/60 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900/60 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-3 rounded-lg font-semibold tracking-wide shadow-lg transition">
            Sign In
          </button>

          {/* <p className="text-center text-sm text-gray-400">
            Use <strong>admin / password123</strong> to login
          </p> */}
        </form>
      </div>
    </div>
  );
}
