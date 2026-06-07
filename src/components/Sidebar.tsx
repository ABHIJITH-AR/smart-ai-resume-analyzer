import React, { useState } from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Sparkles,
  BarChart3,
  History,
  User,
  Settings2,
  LogOut,
  X
} from "lucide-react";
import { SidebarTab } from "../types";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  user: any;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activeTab, onTabChange, user, onLogout, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Elegant sidebar menu array
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Upload Resume", icon: UploadCloud },
    { name: "AI Analysis", icon: Sparkles },
    { name: "Reports", icon: BarChart3 },
    { name: "History", icon: History },
    { name: "Profile", icon: User },
    { name: "Settings", icon: Settings2 },
  ] as const;

  return (
    <aside
      className={`bg-[#111827] border-r border-slate-800/50 flex flex-col h-screen overflow-hidden shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-0 border-r-0 opacity-0 pointer-events-none" : "w-64"
      }`}
      id="application-sidebar"
    >
      {/* Branding Header Area conforming to Design instruction & theme */}
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between" id="sidebar-logo-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center shadow-lg shrink-0">
            <Sparkles className="h-5 w-5 text-[#5B7FFF]" />
          </div>
          <h1 className="text-sm font-bold leading-tight tracking-tight text-white whitespace-nowrap">
            Smart AI<br />Resume Analyzer
          </h1>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800/85 rounded-lg transition-all ml-1 shrink-0"
          title="Collapse Sidebar"
          id="btn-sidebar-collapse"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar Navigation Items */}
      <nav className="flex-grow py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => onTabChange(item.name)}
              className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium transition-all text-left ${
                isActive
                  ? "bg-[#4169E1]/10 border-l-4 border-[#4169E1] text-white"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/20"
              }`}
              id={`nav-item-${item.name.toLowerCase().replace(" ", "-")}`}
            >
              <Icon
                className={`w-[18px] h-[18px] transition-colors shrink-0 ${
                  isActive ? "text-[#4169E1]" : "text-slate-400 group-hover:text-white"
                }`}
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Information Panel & direct action options */}
      <div className="p-4 border-t border-slate-800 bg-[#0F172A]/40" id="sidebar-user-panel">
        <div className="flex items-center gap-3 p-1 mb-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border border-[#4169E1]/40"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-xs text-[#5B7FFF] font-bold shrink-0">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </div>
          )}

          <div className="flex-grow overflow-hidden">
            <h4 className="text-xs font-semibold text-slate-200 truncate">{user.name}</h4>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onTabChange("Profile")}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium text-slate-300 bg-slate-805 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-center border border-slate-800"
            id="sidebar-direct-profile"
            title="Go to Profile Settings"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Profile</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 hover:text-rose-300 rounded-lg transition-colors text-center border border-rose-500/10"
            id="sidebar-direct-logout"
            title="Close Session / Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
