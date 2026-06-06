import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, Cpu, KeyRound, Check } from "lucide-react";
import { motion } from "motion/react";
import { ToastMessage } from "./ToastPopup";

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onNavigateToRegister: () => void;
  addToast: (type: ToastMessage["type"], title: string, message: string) => void;
}

export default function LoginView({ onLoginSuccess, onNavigateToRegister, addToast }: LoginProps) {
  const [email, setEmail] = useState("abhijith90711@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem("remembered_email");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addToast("warning", "Missing Fields", "Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast("warning", "Invalid Format", "Please enter a valid email address (e.g., name@example.com).");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem("remembered_email", email);
        } else {
          localStorage.removeItem("remembered_email");
        }

        addToast(
          "success",
          "Login Successful.",
          "Welcome back.\nRedirecting to Dashboard..."
        );

        // Small delay to allow user to read successful welcome notification
        setTimeout(() => {
          onLoginSuccess(data.token, data.user);
        }, 1200);
      } else {
        // Evaluate specific error outcomes requested by user
        if (response.status === 404) {
          addToast(
            "error",
            "Account Not Found.",
            "No account exists with this email address.\nPlease create an account before signing in."
          );
        } else if (response.status === 401) {
          addToast(
            "error",
            "Invalid Password.",
            "The password you entered is incorrect.\nPlease try again."
          );
        } else {
          addToast("error", "Sign In Failed", data.error || "Incorrect credentials");
        }
      }
    } catch (err: any) {
      addToast("error", "Connection Error", "Failed to connect to the authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#0F172A] px-4 overflow-hidden">
      {/* Decorative ambient background spots */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#4169E1]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#5B7FFF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md" id="login-container">
        {/* Branding header area */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-slate-900/50 border border-slate-800 rounded-2xl mb-4 shadow-xl mx-auto"
            id="brand-logo"
          >
            <Sparkles className="h-8 w-8 text-[#5B7FFF]" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center justify-center gap-2">
            Smart AI Resume Analyzer
          </h1>
          <p className="text-[#94A3B8] text-sm mt-2 font-light">
            AI-powered resume optimization and ATS rating analysis
          </p>
        </div>

        {/* Soft Glassmorphism login card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/60 border border-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
          id="login-card"
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[#F8FAFC]">Sign In</h2>
            <p className="text-[#94A3B8] text-xs mt-1">Please sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" id="form-login">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-[#111827]/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-[#F8FAFC] text-sm transition-all focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 placeholder:text-slate-600"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => addToast("info", "Reset Password Mock", "A password reset link has been sent to your email address.")}
                  className="text-xs text-[#5B7FFF] hover:text-[#4169E1] transition-colors"
                  id="btn-forgot-password"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full bg-[#111827]/70 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-[#F8FAFC] text-sm transition-all focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 placeholder:text-slate-600"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  id="btn-toggle-eye"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-slate-400 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#111827] border-slate-800 text-[#4169E1] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  id="check-remember-me"
                />
                Remember Me
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#4169E1] text-[#F8FAFC] py-3.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-500/20 shadow-[#4169E1]/10 flex items-center justify-center gap-2 cursor-pointer border border-[#5B7FFF]"
              id="btn-submit-login"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-dashed border-white animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>Sign In</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[#94A3B8] text-xs">
              Don't have an account?{" "}
              <button
                onClick={onNavigateToRegister}
                className="text-[#5B7FFF] font-semibold hover:text-[#4169E1] transition-all cursor-pointer"
                id="btn-switch-to-register"
              >
                Create Account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
