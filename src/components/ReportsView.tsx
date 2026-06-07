import React, { useState } from "react";
import { FileText, Download, Trash2, Calendar, Search, Sparkles, Filter, X } from "lucide-react";
import { Analysis } from "../types";

interface ReportsViewProps {
  analyses: Analysis[];
  onSelectAnalysis: (analysis: Analysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onDownloadReport: (analysis: Analysis) => void;
  onClose?: () => void;
}

export default function ReportsView({
  analyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  onDownloadReport,
  onClose,
}: ReportsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Get unique job roles for robust filtering
  const uniqueRoles = ["All", ...Array.from(new Set(analyses.map((a) => a.targetJobRole)))];

  // Filtering Logic
  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetJobRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || item.targetJobRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-450 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-6" id="reports-view-box">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#F8FAFC]">Analytical Archives</h2>
          <p className="text-slate-400 text-sm mt-1">Review historic uploads and download PDF appraisals.</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-center text-xs font-semibold text-[#94A3B8] hover:text-white px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-705 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-800/60"
            id="reports-header-close-btn"
          >
            <X className="w-4 h-4" />
            <span>Close view</span>
          </button>
        )}
      </div>

      {/* Solid Search and Filter Module (No glassmorphism) */}
      <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-800 py-2.5 pl-10 pr-4 text-xs rounded-xl focus:border-[#4169E1] text-slate-300 transition-all placeholder:text-slate-600"
            placeholder="Search filenames or job roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="reports-search-input"
          />
        </div>

        <div className="flex gap-2.5 w-full md:w-auto shrink-0 items-center">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            className="bg-slate-900 border border-slate-800 py-2.5 px-4 text-xs rounded-xl text-slate-300 focus:border-[#4169E1] transition-all w-full md:w-auto"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            id="reports-filter-select"
          >
            {uniqueRoles.map((role, idx) => (
              <option key={idx} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid display of Records */}
      {filteredAnalyses.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] border border-slate-800 rounded-2xl max-w-md mx-auto" id="reports-empty-state">
          <div className="p-4 bg-slate-800/80 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-slate-500" />
          </div>
          <h4 className="text-slate-200 font-bold text-sm">No report archives found</h4>
          <p className="text-xs text-slate-500 mt-2">
            Change your filters or upload a resume to create persistent evaluation log entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="reports-record-grid">
          {filteredAnalyses.map((item) => (
            <div
              key={item.id}
              className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 hover:border-slate-700/60 transition-all flex flex-col justify-between shadow-md"
              id={`report-card-${item.id}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-800 rounded-xl text-blue-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 truncate max-w-[190px]">
                        {item.fileName}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                        {item.targetJobRole}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-block text-xs font-black px-2 py-1 rounded-lg border shrink-0 ${getScoreColor(item.atsScore)}`}>
                    ATS: {item.atsScore}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl space-y-1.5 mb-5 text-xs text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>Job match readiness:</span>
                    <span className="font-bold text-emerald-400">{item.jobMatchPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resume strength metric:</span>
                    <span className="font-bold text-amber-500">{item.resumeStrength}%</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-1.5 mt-1.5 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-650" />
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </span>
                    <span>Size: {(item.fileSize / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 border-t border-slate-800/80 pt-4">
                <button
                  onClick={() => onSelectAnalysis(item)}
                  className="flex-grow bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 py-2.5 px-3 rounded-lg text-xs font-bold border border-slate-700/60 cursor-pointer"
                  id={`archive-btn-view-${item.id}`}
                >
                  View Details
                </button>
                <button
                  onClick={() => onDownloadReport(item)}
                  className="flex-shrink-0 bg-[#4169E1] hover:bg-[#5B7FFF] text-white p-2.5 rounded-lg border border-[#5B7FFF]/30 cursor-pointer"
                  title="Export PDF Document"
                  id={`archive-btn-dl-${item.id}`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteAnalysis(item.id)}
                  className="flex-shrink-0 bg-slate-900 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 p-2.5 rounded-lg cursor-pointer"
                  title="Delete Log"
                  id={`archive-btn-del-${item.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
