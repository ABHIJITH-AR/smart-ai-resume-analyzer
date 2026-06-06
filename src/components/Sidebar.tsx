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
  Cpu,
  ChevronDown,
  UserCheck,
  BadgeCheck
} from "lucide-react";
import { SidebarTab } from "../types";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  user: any;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, user, onLogout }: SidebarProps) {
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
      className="w-64 bg-[#111827] border-r border-slate-800/50 flex flex-col h-screen overflow-hidden shrink-0"
      id="application-sidebar"
    >
      {/* Branding Header Area conforming to Design instruction & theme */}
      <div className="p-6 border-b border-slate-800/50" id="sidebar-logo-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center shadow-lg shrink-0">
            <Sparkles className="h-5 w-5 text-[#5B7FFF]" />
          </div>
          <h1 className="text-sm font-bold leading-tight tracking-tight text-white">
            Smart AI<br />Resume Analyzer
          </h1>
        </div>
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

      {/* User Information Panel & Dropdown */}
      <div className="p-4 border-t border-slate-800 bg-[#0F172A]/40 relative">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors text-left"
          id="sidebar-profile-toggle"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border border-[#4169E1]/40"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-[#5B7FFF] font-bold">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </div>
          )}

          <div className="flex-grow overflow-hidden">
            <div className="flex items-center gap-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-200 truncate">{user.name}</h4>
              <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10 shrink-0" title="Verified Account" />
            </div>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>

          <ChevronDown className={`w-[15px] h-[15px] text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {profileDropdownOpen && (
          <div
            className="absolute bottom-16 left-4 right-4 bg-[#1E293B] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
            id="sidebar-profile-dropdown"
          >
            <button
              onClick={() => {
                onTabChange("Profile");
                setProfileDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg transition-colors text-left"
              id="sidebar-dropdown-profile"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => {
                onTabChange("Settings");
                setProfileDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg transition-colors text-left"
              id="sidebar-dropdown-settings"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Setting</span>
            </button>
            <div className="h-px bg-slate-800 my-1" />
            <button
              onClick={() => {
                setProfileDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
              id="sidebar-dropdown-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
