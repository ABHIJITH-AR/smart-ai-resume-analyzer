import React from "react";
import {
  Sparkles,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  UploadCloud,
  BadgeCheck
} from "lucide-react";
import { motion } from "motion/react";
import { Analysis } from "../types";

interface DashboardProps {
  user: any;
  analyses: Analysis[];
  onNavigateToTab: (tab: any) => void;
  onSelectAnalysis: (analysis: Analysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

export default function DashboardView({
  user,
  analyses,
  onNavigateToTab,
  onSelectAnalysis,
  onDeleteAnalysis,
}: DashboardProps) {
  // Aggregate Stats
  const totalUploaded = analyses.length;
  
  const avgAtsScore = totalUploaded
    ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalUploaded)
    : 0;

  const avgMatchPct = totalUploaded
    ? Math.round(analyses.reduce((sum, a) => sum + a.jobMatchPercentage, 0) / totalUploaded)
    : 0;

  const avgStrength = totalUploaded
    ? Math.round(analyses.reduce((sum, a) => sum + a.resumeStrength, 0) / totalUploaded)
    : 0;

  // Last 3 analyses
  const recentAnalyses = [...analyses]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 3);

  // Score badge coloring helper
  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-450 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-8" id="dashboard-view-box">
      {/* Welcome banner styled for Professional Polish */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4" id="dashboard-welcome-banner">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-[#F8FAFC] flex items-center gap-1.5 flex-wrap">
            <span>Welcome back, {user.name || "Alex"}!</span>
            <BadgeCheck className="w-5.5 h-5.5 text-blue-500 fill-blue-500/10 shrink-0" title="Verified AI Professional" />
          </h2>
          <p className="text-[#94A3B8] text-sm font-light">Your AI Resume Analysis overview for the last 30 days.</p>
        </div>
        <button
          onClick={() => onNavigateToTab("Upload Resume")}
          className="bg-[#4169E1] hover:bg-[#5B7FFF] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          id="dashboard-upload-trigger"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Stats Overview row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-grid">
        <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-800">
          <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2">Avg ATS Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#4169E1]" id="stat-avg-ats">{totalUploaded ? `${avgAtsScore}%` : "0%"}</span>
            {totalUploaded > 0 && <span className="text-green-500 text-xs font-medium mb-1">+4.2%</span>}
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-800">
          <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2">Job Match Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#4169E1]" id="stat-avg-match">{totalUploaded ? `${avgMatchPct}%` : "0%"}</span>
            {totalUploaded > 0 && <span className="text-green-500 text-xs font-medium mb-1">+1.1%</span>}
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-800">
          <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2">Analyzed</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white" id="stat-total-docs">{totalUploaded}</span>
            <span className="text-[#94A3B8] text-xs font-medium mb-1">Resumes</span>
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-800">
          <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2">Resume Strength</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-amber-500" id="stat-avg-strength">{totalUploaded ? `${avgStrength}%` : "0%"}</span>
            <span className="text-[#94A3B8] text-xs font-medium mb-1">Impact</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid bottom part */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-lower-grid">
        {/* Left column: Recent Analyses (occupies 2 columns on lg screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B] rounded-xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-150">Recent Analysis</h3>
              {totalUploaded > 3 && (
                <button
                  onClick={() => onNavigateToTab("Reports")}
                  className="text-[#4169E1] text-xs font-medium hover:underline flex items-center gap-1"
                  id="dashboard-view-all-link"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {totalUploaded === 0 ? (
              <div className="py-12 text-center max-w-sm mx-auto" id="dashboard-empty-state">
                <div className="w-14 h-14 bg-slate-800/80 border border-slate-755/60 rounded-xl mx-auto flex items-center justify-center mb-4 text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-[#F8FAFC] font-semibold text-sm">No analysis history</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Start by scanning your resume for custom keyword recommendations and ATS scores.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnalyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectAnalysis(item)}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-[#0F172A]/50 border border-slate-800/50 hover:bg-[#0F172A] hover:border-slate-800 hover:shadow-md transition-all cursor-pointer group"
                    id={`row-${item.id}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded bg-slate-800/80 border border-slate-755/60 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate pr-2">{item.fileName}</p>
                        <p className="text-[10px] text-[#94A3B8] font-light mt-0.5">
                          {new Date(item.uploadedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })} • {item.targetJobRole}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          {item.atsScore} <span className="text-[10px] text-[#94A3B8] font-normal">ATS Score</span>
                        </p>
                        <p className={`text-[10px] font-medium ${item.atsScore >= 80 ? 'text-green-500' : 'text-amber-500'}`}>
                          {item.atsScore >= 80 ? 'Optimized' : 'Needs Work'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAnalysis(item.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Scan prompt card (Glassmorphism as requested) */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-full flex flex-col items-center justify-center text-center shadow-2xl min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#4169E1]/20 flex items-center justify-center mb-6 ring-8 ring-[#4169E1]/5 text-[#4169E1]">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold mb-2 text-[#F8FAFC]">Scan New Resume</h4>
            <p className="text-[#94A3B8] text-xs mb-8 leading-relaxed max-w-[240px]">
              Drag and drop your PDF or DOCX file here to receive an instant AI-powered ATS analysis.
            </p>
            <div className="w-full space-y-3">
              <button
                onClick={() => onNavigateToTab("Upload Resume")}
                className="w-full bg-[#4169E1] hover:bg-[#5B7FFF] text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                Browse Files
              </button>
              <p className="text-[10px] text-[#94A3B8]">Max file size: 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
