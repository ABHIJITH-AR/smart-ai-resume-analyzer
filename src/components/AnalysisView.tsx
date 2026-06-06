import React from "react";
import {
  Sparkles,
  FileText,
  Clock,
  ArrowLeft,
  Download,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  BookOpen,
  PieChart,
  Target
} from "lucide-react";
import { motion } from "motion/react";
import { Analysis } from "../types";

interface AnalysisViewProps {
  analysis: Analysis | null;
  onBack: () => void;
  onDownloadPdf?: (analysis: Analysis) => void;
}

export default function AnalysisView({ analysis, onBack, onDownloadPdf }: AnalysisViewProps) {
  if (!analysis) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-lg mx-auto" id="analysis-not-found">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-slate-100 font-extrabold text-base">No active analysis report selected</h3>
        <p className="text-slate-400 text-xs mt-2">
          Please select an evaluated record from your history or upload an initial document in the upload workspace.
        </p>
        <button
          onClick={onBack}
          className="mt-6 bg-[#4169E1] text-[#F8FAFC] text-xs font-bold px-4 py-2 rounded-xl border border-[#5B7FFF]/40 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Ring meter percentage calculation helper
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const scoreColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-400 text-emerald-400";
    if (score >= 60) return "stroke-amber-400 text-amber-400";
    return "stroke-rose-450 text-rose-450";
  };

  const getRelevanceBadge = (relevance: string) => {
    const r = relevance.toLowerCase();
    if (r === "high") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (r === "medium") {
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
    return "bg-slate-800 text-slate-400 border border-slate-700/60";
  };

  const handlePrintExport = () => {
    if (onDownloadPdf) {
      onDownloadPdf(analysis);
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="analysis-report-box">
      {/* Action Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1E293B] border border-slate-800 rounded-2xl shadow-xl">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#94A3B8] hover:text-slate-100 flex items-center gap-1.5 transition-all self-start cursor-pointer"
          id="btn-back-to-list"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Report View</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintExport}
            className="bg-[#4169E1] hover:bg-[#5B7FFF] border border-[#5B7FFF]/40 text-[#F8FAFC] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            id="btn-export-pdf"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download & Save PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Metadata Display */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 truncate max-w-[280px] md:max-w-md">
              {analysis.fileName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-2">
              <span className="bg-[#1E293B] text-slate-300 px-2.5 py-1 rounded-lg font-semibold border border-slate-800">
                Target Role: {analysis.targetJobRole}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                Analyzed at: {new Date(analysis.uploadedAt).toLocaleString()}
              </span>
              <span>Size: {(analysis.fileSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Row (Solid Cards, no glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="numerical-meters-row">
        {/* ATS Metric */}
        <div className="bg-[#1E293B] border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              ATS Score Rank
            </span>
            <p className="text-3xl font-black text-[#4169E1]">{analysis.atsScore}/100</p>
            <p className="text-[11px] text-slate-400">Match compatibility threshold</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full rotate-270" viewBox="0 0 100 100">
              <circle
                className="stroke-slate-800 fill-transparent"
                strokeWidth="10"
                r={radius}
                cx="50"
                cy="50"
              />
              <circle
                className={scoreColor(analysis.atsScore) + " fill-transparent"}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (analysis.atsScore / 100) * circumference}
                strokeLinecap="round"
                r={radius}
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-300">
              {analysis.atsScore}%
            </div>
          </div>
        </div>

        {/* Job Match Percentage */}
        <div className="bg-[#1E293B] border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Career Job Match
            </span>
            <p className="text-3xl font-black text-emerald-400">{analysis.jobMatchPercentage}%</p>
            <p className="text-[11px] text-slate-400">Key requirement coverage</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full rotate-270" viewBox="0 0 100 100">
              <circle
                className="stroke-slate-800 fill-transparent"
                strokeWidth="10"
                r={radius}
                cx="50"
                cy="50"
              />
              <circle
                className="stroke-emerald-400 fill-transparent"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (analysis.jobMatchPercentage / 100) * circumference}
                strokeLinecap="round"
                r={radius}
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-300">
              {analysis.jobMatchPercentage}%
            </div>
          </div>
        </div>

        {/* Industry Readiness */}
        <div className="bg-[#1E293B] border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Industry Readiness
            </span>
            <p className="text-3xl font-black text-indigo-400">{analysis.industryReadinessScore}/100</p>
            <p className="text-[11px] text-slate-400">Stack technology depth</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full rotate-270" viewBox="0 0 100 100">
              <circle
                className="stroke-slate-800 fill-transparent"
                strokeWidth="10"
                r={radius}
                cx="50"
                cy="50"
              />
              <circle
                className="stroke-indigo-400 fill-transparent"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (analysis.industryReadinessScore / 100) * circumference}
                strokeLinecap="round"
                r={radius}
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-300">
              {analysis.industryReadinessScore}%
            </div>
          </div>
        </div>

        {/* Strength Meter Slider */}
        <div className="bg-[#1E293B] border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Resume Strength Meter
            </span>
            <p className="text-3xl font-black text-amber-500">{analysis.resumeStrength}/100</p>
            <p className="text-[11px] text-slate-400">Active verbs & ROI metrics</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full rotate-270" viewBox="0 0 100 100">
              <circle
                className="stroke-slate-800 fill-transparent"
                strokeWidth="10"
                r={radius}
                cx="50"
                cy="50"
              />
              <circle
                className="stroke-amber-500 fill-transparent"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (analysis.resumeStrength / 100) * circumference}
                strokeLinecap="round"
                r={radius}
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-300">
              {analysis.resumeStrength}%
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Block */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md" id="summary-section">
        <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#4169E1]" />
          <span>Executive AI Summary</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
          {analysis.aiSummary}
        </p>
      </div>

      {/* Skill Gaps Grid (Side by side parsed/missing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="skill-breakdown-grid">
        {/* Technical & Soft Skills Extracted */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Extracted Skills & Competencies</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.skillsExtracted?.map((skill, index) => (
              <span
                key={index}
                className="text-xs font-semibold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-3.5 py-1.5 rounded-lg"
              >
                {skill}
              </span>
            ))}
            {(!analysis.skillsExtracted || analysis.skillsExtracted.length === 0) && (
              <p className="text-xs text-slate-500 italic">No skills successfully mapped.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-450" />
            <span>Critical Missing Requirements</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.skillsMissing?.map((skill, index) => (
              <span
                key={index}
                className="text-xs font-semibold bg-rose-500/10 border border-thin border-rose-500/20 text-rose-400 px-3.5 py-1.5 rounded-lg"
              >
                {skill}
              </span>
            ))}
            {(!analysis.skillsMissing || analysis.skillsMissing.length === 0) && (
              <p className="text-xs text-emerald-400 font-medium">All criteria parameters matched! Outstanding effort.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations & Action Points */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md" id="suggestions-section">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Action-Backed Optimization Guidelines</span>
        </h3>
        <div className="space-y-3.5">
          {analysis.improvementSuggestions?.map((suggestion, index) => (
            <div key={index} className="flex gap-3.5 items-start p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-[#4169E1]/15 border border-[#4169E1]/20 flex items-center justify-center text-[10px] font-bold text-[#5B7FFF] mt-0.5 shrink-0">
                {index + 1}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{suggestion}</p>
            </div>
          ))}
          {(!analysis.improvementSuggestions || analysis.improvementSuggestions.length === 0) && (
            <p className="text-xs text-emerald-400 italic">No recommendations required. This matches target criteria.</p>
          )}
        </div>
      </div>

      {/* Keyword Analysis matrices */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md" id="word-keywords-section">
        <div className="mb-4">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#5B7FFF]" />
            <span>Keyword Density & Relevance Metrics</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Ensure key terms occur natively. Exceeding density values over 4% risks blacklisting under modern spam algorithms.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-light text-slate-300" id="keyword-grid-table">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-xs uppercase text-left">
                <th className="py-2.5 px-3">Keyword Signature</th>
                <th className="py-2.5 px-3 text-center">Frequency</th>
                <th className="py-2.5 px-3 text-center">Density</th>
                <th className="py-2.5 px-3 text-right">ATS Relevance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {analysis.keywordAnalysis?.map((kw, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 text-xs">
                  <td className="py-3 px-3 font-semibold text-slate-200">{kw.keyword}</td>
                  <td className="py-3 px-3 text-center text-slate-400 font-mono">{kw.count}</td>
                  <td className="py-3 px-3 text-center text-[#5B7FFF] font-mono">{kw.density}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRelevanceBadge(kw.relevance)}`}>
                      {kw.relevance}
                    </span>
                  </td>
                </tr>
              ))}
              {(!analysis.keywordAnalysis || analysis.keywordAnalysis.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                    No keyword densities compiled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
