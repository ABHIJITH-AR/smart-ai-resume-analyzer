import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ToastMessage } from "./ToastPopup";
import { Analysis } from "../types";

interface UploadProps {
  token: string | null;
  addToast: (type: ToastMessage["type"], title: string, message: string) => void;
  onAnalysisComplete: (analysis: Analysis) => void;
}

export default function UploadView({ token, addToast, onAnalysisComplete }: UploadProps) {
  const [jobRole, setJobRole] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Progress states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedExtensions = [".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      addToast(
        "error",
        "Invalid Format",
        `Standard AI filters only allow: ${allowedExtensions.join(", ")}`
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast("warning", "File Too Large", "Uploaded assets should reside below 10MB sizes.");
      return;
    }

    setSelectedFile(file);
    addToast("info", "Resume Selected", `Loaded "${file.name}" to memory container.`);
  };

  const triggerSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      addToast("warning", "No Resume Loaded", "Please select or drop a valid file before submitting.");
      return;
    }

    setIsUploading(true);
    setUploadPercent(10);
    setStatusMessage("Uploading document to secure server filesystem...");

    // Simulated staggered progress to improve SaaS feel
    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 80) {
          clearInterval(interval);
          return 80;
        }
        if (prev >= 40) {
          setStatusMessage("Initializing Google Gemini deep resume parsing model...");
          return prev + 10;
        }
        return prev + 15;
      });
    }, 450);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobRole", jobRole.trim());

      const response = await fetch("/api/resumes/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      clearInterval(interval);
      setUploadPercent(95);
      setStatusMessage("Retrieving structured audit files...");

      const data = await response.json();

      if (response.ok) {
        setUploadPercent(100);
        setStatusMessage("Analysis successfully generated.");
        addToast("success", "Analysis Complete!", "Google Gemini has finalized your resume audits.");
        
        setTimeout(() => {
          onAnalysisComplete(data.analysis);
        }, 1000);
      } else {
        addToast("error", "AI Analysis Failed", data.error || "Execution timeout.");
        resetUploadStates();
      }
    } catch (err: any) {
      clearInterval(interval);
      addToast("error", "Execution Mismatch", "Failed to complete full processing loops.");
      resetUploadStates();
    }
  };

  const resetUploadStates = () => {
    setIsUploading(false);
    setSelectedFile(null);
    setUploadPercent(0);
    setStatusMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="upload-view-box">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-extrabold text-[#F8FAFC]">Upload Resume For AI Review</h2>
        <p className="text-slate-400 text-sm mt-1">
          Specify a target job role and parse your resume instantaneously using AI metrics.
        </p>
      </div>

      {/* Glassmorphic Upload Card */}
      <div
        className="bg-slate-900/60 border border-slate-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6"
        id="resume-upload-card"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Target Job Role Prompt */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span>Target Career / Job Role</span>
              <span className="text-slate-500 font-light text-[10px] uppercase">(Optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#111827]/80 border border-slate-800 rounded-xl px-4 py-3 text-[#F8FAFC] text-sm focus:border-[#4169E1] transition-all"
              placeholder="e.g. Senior Full Stack Engineer, UX UI Architect, Business Specialist"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={isUploading}
              id="upload-job-role-input"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Specifying a role provides high-relevance keyword matching audits. If omitted, Gemini detects your primary category.
            </p>
          </div>

          {/* Drag and Drop Zone */}
          {!isUploading && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerSelectFile}
              className={`border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                isDragging
                  ? "border-[#4169E1] bg-[#4169E1]/5 p-12 shadow-[0_0_15px_rgba(65,105,225,0.15)]"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-slate-800 hover:border-[#4169E1]/60 hover:bg-slate-800/20"
              }`}
              id="upload-dropzone"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
              />

              {selectedFile ? (
                <>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 animate-bounce">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-slate-200 text-sm font-semibold truncate max-w-[280px]">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Correctly Staged
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-xs text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
                    id="btn-remove-pended-file"
                  >
                    Select a Different Document
                  </button>
                </>
              ) : (
                <>
                  <div className={`p-4 rounded-2xl border transition-colors ${isDragging ? 'bg-[#4169E1]/20 border-[#5B7FFF]/40 text-[#4169E1]' : 'bg-slate-800/80 border-slate-700/60 text-slate-400 group-hover:text-slate-100'}`}>
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-slate-200 text-sm font-semibold">
                      Drag & drop your resume file here
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      PDF, DOCX, TXT or Graphic Images (Max 10MB)
                    </p>
                  </div>
                  <span className="text-xs text-[#5B7FFF] font-bold bg-[#4169E1]/10 px-3 py-1.5 rounded-lg border border-[#5B7FFF]/10">
                    Browse File Directories
                  </span>
                </>
              )}
            </div>
          )}

          {/* Progress Section */}
          {isUploading && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4" id="upload-progress-box">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium truncate max-w-[230px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4169E1] animate-ping" />
                  {statusMessage}
                </span>
                <span className="text-[#5B7FFF] font-bold">{uploadPercent}%</span>
              </div>

              {/* Glowing Linear Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadPercent}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-[#4169E1] to-[#5B7FFF]"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#4169E1]/5 border border-[#4169E1]/10 text-[11px] text-slate-400 rounded-xl leading-relaxed">
                <Sparkles className="w-5 h-5 text-[#5B7FFF] shrink-0" />
                <span>
                  Our engine utilizes a specialized Google Gemini configuration optimized with recruitment parameters to extract high-accuracy assessments. This may take up to 30 seconds.
                </span>
              </div>
            </div>
          )}

          {/* Submission and Control Elements */}
          {!isUploading && selectedFile && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-[#4169E1] hover:bg-[#5B7FFF] border border-[#5B7FFF]/50 text-[#F8FAFC] py-4 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              id="upload-button-submit"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Initiate AI Optimization Report</span>
            </motion.button>
          )}
        </form>
      </div>

      {/* Guide Elements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="upload-guide-grid">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <h5 className="text-xs font-bold text-slate-300">ATS Match Scoring</h5>
          <p className="text-[11px] text-slate-500 mt-1">
            Evaluates format structure, action verbs, and core contact parameters based on corporate algorithms.
          </p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <h5 className="text-xs font-bold text-slate-300">Semantic Alignments</h5>
          <p className="text-[11px] text-slate-500 mt-1">
            Validates if your project experiences and achievements use industry terms matching desired targets.
          </p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <h5 className="text-xs font-bold text-slate-300">PDF Report Exporter</h5>
          <p className="text-[11px] text-slate-500 mt-1">
            Automatically packages your scoring gauges, skill breakdowns, and suggestions into downloadable reports.
          </p>
        </div>
      </div>
    </div>
  );
}
