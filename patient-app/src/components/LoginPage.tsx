// src/components/LoginPage.tsx
import React, { useState } from "react";
import axios from "./lib/axios";
import { Stethoscope } from "lucide-react";

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", data.access_token);
      onLoginSuccess();
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-fade-in">
        
        <div className="flex flex-col items-center mb-6">
          <Stethoscope className="w-14 h-14 text-blue-600 mb-2" />
          <h1 className="text-blue-700 mb-1">Patient Login</h1>
          <p className="text-slate-600 text-center text-sm">
            Access your AI triage assistant
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-4">
          AI Emergency Triage Assistant
        </p>
      </div>
    </div>
  );
}
