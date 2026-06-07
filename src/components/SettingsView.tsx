import React, { useState } from "react";
import { Settings, Shield, KeyRound, Cpu, HelpCircle, Save, Check, X } from "lucide-react";
import { ToastMessage } from "./ToastPopup";

interface SettingsViewProps {
  addToast: (type: ToastMessage["type"], title: string, message: string) => void;
  onClose?: () => void;
}

export default function SettingsView({ addToast, onClose }: SettingsViewProps) {
  const [useLiveAI, setUseLiveAI] = useState(true);
  const [modelType, setModelType] = useState("gemini-3.5-flash");
  const [exportFormat, setExportFormat] = useState("PDF");
  const [mongoUri, setMongoUri] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate minor database save latency
    setTimeout(() => {
      setIsSaving(false);
      addToast(
        "success",
        "Settings Updated",
        "System preferences synchronized successfully."
      );
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="settings-view-box">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#F8FAFC]">System Preferences</h2>
          <p className="text-slate-400 text-sm mt-1">
            Configure backend models, database linkages, and export parameters.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-center text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-705 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-800/60"
            id="settings-header-close-btn"
          >
            <X className="w-4 h-4" />
            <span>Close view</span>
          </button>
        )}
      </div>

      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* Parser Engine Configurations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Cpu className="w-4 h-4 text-[#4169E1]" />
              <span>AI Evaluation Models</span>
            </h3>

            <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-200">Local Smart Semantic Processing</h4>
                <p className="text-[10px] text-slate-500">
                  Enable offline high-accuracy semantic and ATS scoring logic.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useLiveAI}
                  onChange={(e) => setUseLiveAI(e.target.checked)}
                  className="sr-only peer"
                  id="toggle-live-ai"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-[#F8FAFC] peer-checked:bg-[#4169E1]" />
              </label>
            </div>

            {useLiveAI && (
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
                  Semantic Engine Target Version
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:border-[#4169E1] focus:ring-1 focus:ring-[#4169E1]/30 transition-all"
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  id="select-gemini-model"
                >
                  <option value="offline-smart-v1">offline-smart-v1 (Offline High-Speed, Enterprise Recommended)</option>
                  <option value="offline-deep-v2">offline-deep-v2 (Local reasoning complex parsing)</option>
                </select>
              </div>
            )}
          </div>

          {/* Database link configuration guides */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Database Linkages</span>
            </h3>

            <div>
              <label htmlFor="mongouri" className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
                External MongoDB Atlas Connection URI
              </label>
              <input
                type="text"
                id="mongouri"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:border-[#4169E1] transition-all placeholder:text-slate-800"
                placeholder="mongodb+srv://user:pass@cluster.mongodb.net/resume_analyzer?retryWrites=true"
                value={mongoUri}
                onChange={(e) => setMongoUri(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                Applet is currently utilizing local sandboxed state files securely. Supplying an Atlas connection cluster automatically migrates users and analyzer histories to global databases.
              </p>
            </div>
          </div>

          {/* Report parameter configurations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
              <Settings className="w-4 h-4 text-amber-500" />
              <span>Reports Export Formats</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <label
                onClick={() => setExportFormat("PDF")}
                className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  exportFormat === "PDF"
                    ? "border-[#4169E1] bg-[#4169E1]/5 text-slate-100"
                    : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700/40"
                }`}
                id="export-pdf-setting-toggle"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">Portable PDF Layout</p>
                  <p className="text-[9px]">Generate high-relevance PDF layout files</p>
                </div>
                {exportFormat === "PDF" && <Check className="w-4 h-4 text-[#4169E1]" />}
              </label>

              <label
                onClick={() => setExportFormat("JSON")}
                className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer select-none transition-all ${
                  exportFormat === "JSON"
                    ? "border-[#4169E1] bg-[#4169E1]/5 text-slate-100"
                    : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700/40"
                }`}
                id="export-json-setting-toggle"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">Analytical JSON Raw data</p>
                  <p className="text-[9px]">Direct download metadata structures</p>
                </div>
                {exportFormat === "JSON" && <Check className="w-4 h-4 text-[#4169E1]" />}
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#4169E1] hover:bg-[#5B7FFF] border border-[#5B7FFF]/30 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              id="btn-save-system-settings"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-white animate-spin" />
                  Saving Preferences...
                </>
              ) : (
                <>Save Configurations</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
