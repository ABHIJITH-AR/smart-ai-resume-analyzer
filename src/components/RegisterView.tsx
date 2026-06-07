import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Cpu, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { ToastMessage } from "./ToastPopup";

interface RegisterProps {
  onNavigateToLogin: () => void;
  addToast: (type: ToastMessage["type"], title: string, message: string) => void;
}

export default function RegisterView({ onNavigateToLogin, addToast }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation and feedback helper
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      addToast("warning", "Required Fields", "Please populate all fields in this workspace.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast("warning", "Invalid Format", "Please enter a valid email address (e.g., name@example.com).");
      return;
    }

    if (password.length < 6) {
      addToast("warning", "Password Weakness", "Security requirements suggest passwords of at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      addToast("warning", "Validation Mismatch", "Passwords entered do not match each other.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast(
          "success",
          "Registration Successful!",
          "Your account has been created successfully.\nPlease sign in to continue."
        );

        // Auto redirect user to Sign In page after 1.5s
        setTimeout(() => {
          onNavigateToLogin();
        }, 1500);
      } else {
        addToast("error", "Registration Attempt Invalid", data.error || "Email already present.");
      }
    } catch (err) {
      addToast("error", "Network Failed", "Database registration pipeline unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#0F172A] px-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#4169E1]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#5B7FFF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md" id="register-container">
        {/* Branding Title */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-slate-900/50 border border-slate-800 rounded-2xl mb-4 shadow-xl mx-auto"
            id="register-brand-logo"
          >
            <Sparkles className="h-8 w-8 text-[#5B7FFF]" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Smart AI Resume Analyzer</h1>
          <p className="text-[#94A3B8] text-sm mt-2">Create an account to track and optimize your resume's impact</p>
        </div>

        {/* Soft Glassmorphism register card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
          id="register-card"
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[#F8FAFC]">Sign Up</h2>
            <p className="text-[#94A3B8] text-xs mt-1">Get detailed ATS alignment ratings instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="form-register">
            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  id="fullname"
                  className="w-full bg-[#111827]/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-[#F8FAFC] text-sm transition-all focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 placeholder:text-slate-600"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
                {name && (
                  <button
                    type="button"
                    onClick={() => setName("")}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300"
                    title="Clear name field"
                    id="btn-clear-register-name"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  id="register-email"
                  className="w-full bg-[#111827]/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-[#F8FAFC] text-sm transition-all focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 placeholder:text-slate-600"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail("")}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300"
                    title="Clear email field"
                    id="btn-clear-register-email"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  className="w-full bg-[#111827]/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-[#F8FAFC] text-sm transition-all focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 placeholder:text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  id="reg-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-password"
                  className="w-full bg-[#111827]/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-[#F8FAFC] text-sm transition-all focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 placeholder:text-slate-700"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#4169E1] text-[#F8FAFC] py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-500/20 shadow-[#4169E1]/10 flex items-center justify-center gap-2 cursor-pointer border border-[#5B7FFF]"
              id="btn-submit-register"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-dashed border-white animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Sign Up</>
              )}
            </motion.button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[#94A3B8] text-xs">
              Already have an active account?{" "}
              <button
                onClick={onNavigateToLogin}
                className="text-[#5B7FFF] font-semibold hover:text-[#4169E1] transition-all cursor-pointer"
                id="btn-switch-to-login"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
