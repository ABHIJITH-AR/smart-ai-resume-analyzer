import React, { useState, useEffect } from "react";
import { SidebarTab, Analysis, User } from "./types.js";
import ToastPopup, { ToastMessage } from "./components/ToastPopup.tsx";
import LoginView from "./components/LoginView.tsx";
import RegisterView from "./components/RegisterView.tsx";
import Sidebar from "./components/Sidebar.tsx";
import DashboardView from "./components/DashboardView.tsx";
import UploadView from "./components/UploadView.tsx";
import AnalysisView from "./components/AnalysisView.tsx";
import ReportsView from "./components/ReportsView.tsx";
import ProfileView from "./components/ProfileView.tsx";
import SettingsView from "./components/SettingsView.tsx";

import { motion, AnimatePresence } from "motion/react";
import { LogOut, RefreshCw, Cpu } from "lucide-react";

export default function App() {
  // Session Access States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Applet Flow States
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<SidebarTab>("Dashboard");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  
  // App system states
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Core visual theme color constants based on matching instructions
  const visualThemeColors = {
    background: "#0F172A",
    sidebar: "#111827",
    cardBg: "#1E293B",
    primaryAccent: "#4169E1",
    secondaryAccent: "#5B7FFF",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8"
  };

  // Toast Trigger Helper
  const addToast = (type: ToastMessage["type"], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev]);

    // Self cleaning alert after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Restore authenticated session from memory parameters
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token2026");
    const storedUser = localStorage.getItem("auth_user2026");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("auth_token2026");
        localStorage.removeItem("auth_user2026");
      }
    }
    
    // Simulate short loader
    setTimeout(() => {
      setIsInitializing(false);
    }, 600);
  }, []);

  // Fetch all resume audits created by current user
  const fetchAnalyses = async (authToken: string) => {
    try {
      const response = await fetch("/api/resumes", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses || []);
      }
    } catch (err) {
      console.error("Failed to connect with audit history endpoints:", err);
    }
  };

  // Trigger fetches once authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAnalyses(token);
    }
  }, [isAuthenticated, token]);

  const handleLoginSuccess = (authToken: string, loggedInUser: any) => {
    localStorage.setItem("auth_token2026", authToken);
    localStorage.setItem("auth_user2026", JSON.stringify(loggedInUser));

    setToken(authToken);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setActiveTab("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token2026");
    localStorage.removeItem("auth_user2026");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAnalyses([]);
    setSelectedAnalysis(null);
    setActiveTab("Dashboard");

    addToast(
      "success",
      "Sign Out Completed",
      "You have been securely signed out."
    );
  };

  // Profile data update syncer
  const handleProfileUpdate = (updatedUserInfo: any) => {
    setUser(updatedUserInfo);
    localStorage.setItem("auth_user2026", JSON.stringify(updatedUserInfo));
  };

  // Custom analysis selection redirector
  const handleSelectAnalysis = (analysisRecord: Analysis) => {
    setSelectedAnalysis(analysisRecord);
    setActiveTab("AI Analysis");
  };

  // Delete evaluation record
  const handleDeleteAnalysis = async (id: string) => {
    if (!token) return;

    const confirmPurge = window.confirm("Are you sure you want to permanently delete this resume analysis record?");
    if (!confirmPurge) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.ok) {
        addToast("success", "Record Deleted", "Resume analysis record purged from active logs.");
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
        if (selectedAnalysis && selectedAnalysis.id === id) {
          setSelectedAnalysis(null);
        }
      } else {
        addToast("error", "Failed To Delete", "Could not complete deletion request.");
      }
    } catch (err) {
      addToast("error", "Connection Timeout", "Failed to connect to backend history.");
    }
  };

  // Custom simulation for downloading PDF records
  const handleDownloadReport = (analysisRecord: Analysis) => {
    addToast(
      "info",
      "Compiling PDF Report...",
      `Assembling parameters for "${analysisRecord.fileName}"...`
    );

    setTimeout(() => {
      // Create printable document on window
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        addToast("error", "Popup Blocked", "Please allow popups to download formatting layouts.");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Smart AI Resume Optimization Report - ${analysisRecord.fileName}</title>
            <style>
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #0F172A;
                padding: 40px;
                line-height: 1.6;
              }
              .border-box {
                border: 2px solid #4169E1;
                padding: 30px;
                border-radius: 12px;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-b: 1px solid #E2E8F0;
                padding-bottom: 20px;
                margin-bottom: 20px;
              }
              .brand {
                font-weight: bold;
                color: #4169E1;
                font-size: 20px;
              }
              .meta {
                font-size: 12px;
                color: #64748B;
              }
              .grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin: 25px 0;
              }
              .score-card {
                background: #F8FAFC;
                border: 1px solid #E2E8F0;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
              }
              .score-val {
                font-size: 26px;
                font-weight: 900;
                color: #4169E1;
                margin-top: 5px;
              }
              .section-title {
                font-size: 13px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #64748B;
                margin-top: 30px;
                border-bottom: 2px solid #F1F5F9;
                padding-bottom: 5px;
              }
              .skills {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
              }
              .skill-tag {
                background: #E0E7FF;
                color: #4169E1;
                font-size: 11px;
                font-weight: 600;
                padding: 5px 10px;
                border-radius: 4px;
              }
              .missing-tag {
                background: #FFE4E6;
                color: #E11D48;
                font-size: 11px;
                font-weight: 600;
                padding: 5px 10px;
                border-radius: 4px;
              }
              .suggestion-list {
                margin-top: 10px;
                padding-left: 20px;
              }
              .suggestion-item {
                margin-bottom: 10px;
                font-size: 13px;
              }
            </style>
          </head>
          <body>
            <div class="border-box">
              <div class="header">
                <div>
                  <div class="brand">Smart AI Resume Analyzer</div>
                  <div class="meta">Automated ATS Optimization Audit</div>
                </div>
                <div style="text-align: right; font-size: 12px;">
                  <strong>Report ID:</strong> ${analysisRecord.id}<br/>
                  <strong>Date:</strong> ${new Date(analysisRecord.uploadedAt).toLocaleDateString()}
                </div>
              </div>

              <h3>Resume File: "${analysisRecord.fileName}"</h3>
              <p>Target Career Path Segment: <strong>${analysisRecord.targetJobRole}</strong></p>

              <div class="grid">
                <div class="score-card">
                  <div style="font-size: 10px; text-transform: uppercase; font-weight: bold;">ATS Score</div>
                  <div class="score-val">${analysisRecord.atsScore}/100</div>
                </div>
                <div class="score-card">
                  <div style="font-size: 10px; text-transform: uppercase; font-weight: bold;">Job Match %</div>
                  <div class="score-val">${analysisRecord.jobMatchPercentage}%</div>
                </div>
                <div class="score-card">
                  <div style="font-size: 10px; text-transform: uppercase; font-weight: bold;">Readiness Score</div>
                  <div class="score-val" style="color: #4338CA;">${analysisRecord.industryReadinessScore}%</div>
                </div>
                <div class="score-card">
                  <div style="font-size: 10px; text-transform: uppercase; font-weight: bold;">Resume Strength</div>
                  <div class="score-val" style="color: #B45309;">${analysisRecord.resumeStrength}%</div>
                </div>
              </div>

              <div class="section-title">Google Gemini Executive Appraisal</div>
              <p style="font-size: 13px; leading-height: 1.7;">${analysisRecord.aiSummary}</p>

              <div class="section-title">Mapped Skills Inventory</div>
              <div class="skills">
                ${analysisRecord.skillsExtracted.map(s => `<span class="skill-tag">${s}</span>`).join("")}
              </div>

              <div class="section-title">Identified Critical Missing Skills</div>
              <div class="skills">
                ${analysisRecord.skillsMissing.map(s => `<span class="missing-tag">${s}</span>`).join("")}
              </div>

              <div class="section-title">Step-by-Step Optimization Guidelines</div>
              <ol class="suggestion-list">
                ${analysisRecord.improvementSuggestions.map(s => `<li class="suggestion-item">${s}</li>`).join("")}
              </ol>

              <div style="margin-top: 50px; font-size: 10px; color: #94A3B8; text-align: center; border-top: 1px solid #F1F5F9; padding-top: 15px;">
                Generated by Smart AI Resume Analyzer. Confidential Recruitment Document export.
              </div>
            </div>
            <script>
              window.print();
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      addToast("success", "Document Compiled", "Audit packet opened in print queue successfully.");
    }, 1500);
  };

  // Tab router layouts rendering selector
  const renderTabContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardView
            user={user}
            analyses={analyses}
            onNavigateToTab={(tab) => {
              if (tab === "AI Analysis" && analyses.length > 0) {
                // Default to last analyzed item
                setSelectedAnalysis(analyses[analyses.length - 1]);
              }
              setActiveTab(tab);
            }}
            onSelectAnalysis={handleSelectAnalysis}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        );
      case "Upload Resume":
        return (
          <UploadView
            token={token}
            addToast={addToast}
            onAnalysisComplete={(completedAnalysis) => {
              // Append analysis and switch focus
              setAnalyses((prev) => [...prev, completedAnalysis]);
              setSelectedAnalysis(completedAnalysis);
              setActiveTab("AI Analysis");
            }}
          />
        );
      case "AI Analysis":
        const currentActiveAnalysis = selectedAnalysis || (analyses.length > 0 ? analyses[analyses.length - 1] : null);
        return (
          <AnalysisView
            analysis={currentActiveAnalysis}
            onBack={() => setActiveTab("Dashboard")}
            onDownloadPdf={handleDownloadReport}
          />
        );
      case "Reports":
      case "History":
        return (
          <ReportsView
            analyses={analyses}
            onSelectAnalysis={handleSelectAnalysis}
            onDeleteAnalysis={handleDeleteAnalysis}
            onDownloadReport={handleDownloadReport}
          />
        );
      case "Profile":
        return (
          <ProfileView
            user={user}
            token={token}
            addToast={addToast}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case "Settings":
        return <SettingsView addToast={addToast} />;
      default:
        return (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="text-[#F8FAFC]">Module Workspace Under Construction</h3>
          </div>
        );
    }
  };

  // Standard Initialized System State Loader Screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-slate-300">
        <Cpu className="w-10 h-10 text-[#4169E1] animate-spin mb-4" />
        <p className="text-xs tracking-wider font-light uppercase text-slate-500">
          Syncing Smart AI workspace environments...
        </p>
      </div>
    );
  }

  // Not Verified - Show Authentication Screens (Login/Registration with Glassmorphism)
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-[#0F172A] min-h-screen overflow-hidden relative" id="auth-workflow-canvas">
        <ToastPopup toasts={toasts} onClose={removeToast} />
        <AnimatePresence mode="wait">
          {authView === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <LoginView
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setAuthView("register")}
                addToast={addToast}
              />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <RegisterView
                onNavigateToLogin={() => setAuthView("login")}
                addToast={addToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Active Session Layout - Render solid app margins
  return (
    <div className="flex bg-[#0F172A] min-h-screen text-[#F8FAFC]" id="enterprise-portal-shell">
      {/* Popups Notifications portal */}
      <ToastPopup toasts={toasts} onClose={removeToast} />

      {/* Solid Sidebar View (No Glassmorphism) */}
      <Sidebar
        activeTab={activeTab === "History" ? "Reports" : activeTab}
        onTabChange={(tab) => {
          if (tab === "Logout") {
            const confirmOut = window.confirm("Are you sure you want to log out of your current session?");
            if (confirmOut) {
              handleLogout();
            }
          } else {
            setActiveTab(tab);
          }
        }}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace viewport */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden bg-[#0F172A]" id="workspace-viewport">
        {/* Workspace dynamic navigation bar header - conforming to Professional Polish theme */}
        <header className="h-16 px-8 border-b border-slate-800/50 bg-[#0F172A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8] text-sm">Pages</span>
            <span className="text-[#94A3B8] text-sm">/</span>
            <span className="text-white text-sm font-medium">
              {activeTab === "History" ? "Reports History" : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200">{user?.name || "Alex Robinson"}</p>
                <p className="text-[10px] text-[#94A3B8]">Premium Account</p>
              </div>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover border border-[#4169E1]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4169E1] to-[#5B7FFF] flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic content viewport */}
        <div className="flex-grow p-8 overflow-y-auto bg-slate-950/40" id="main-scrolling-view">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
