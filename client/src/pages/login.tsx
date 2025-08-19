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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Welcome Back
          </h2>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors">
            Login
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Use <strong>admin / password123</strong> to login
          </p>
        </form>
      </div>
    </div>
  );
}
