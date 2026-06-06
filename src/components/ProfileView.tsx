import React, { useState, useRef } from "react";
import { User, Mail, ShieldAlert, Upload, FileImage, KeyRound, Check, RefreshCw, BadgeCheck } from "lucide-react";
import { ToastMessage } from "./ToastPopup";

interface ProfileViewProps {
  user: any;
  token: string | null;
  addToast: (type: ToastMessage["type"], title: string, message: string) => void;
  onProfileUpdate: (updatedUser: any) => void;
}

export default function ProfileView({ user, token, addToast, onProfileUpdate }: ProfileViewProps) {
  // General Profile State
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Fields State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar Image Upload
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submit Profile Changes
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast("warning", "Verification Missing", "Name and Email cannot be empty.");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast("success", "Profile Updated", "Name and email updated securely.");
        onProfileUpdate(data.user);
      } else {
        addToast("error", "Update Error", data.error || "Execution error.");
      }
    } catch (err) {
      addToast("error", "Server Error", "Could not synchronize profile changes.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      addToast("warning", "Required Fields", "Please populate all password parameters.");
      return;
    }

    if (newPassword.length < 6) {
      addToast("warning", "Insecure Password", "Passwords should occupy at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      addToast("warning", "Mismatch", "New password entries do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast("success", "Password Changed", "Security profile password updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        addToast("error", "Authentication Failed", data.error || "The current password entered was wrong.");
      }
    } catch (err) {
      addToast("error", "Update failed", "Server password change failed.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Avatar file input change handlers
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // File Validation
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const validExtensions = [".png", ".jpg", ".jpeg"];

      if (!validExtensions.includes(ext)) {
        addToast("error", "Graphic Format", "Avatar uploads are restricted to standard PNG / JPG.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        addToast("warning", "Image Oversized", "Please upload avatar images under 2MB.");
        return;
      }

      setIsUploadingAvatar(true);

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch("/api/profile/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          addToast("success", "Image Uploaded", "Your profile avatar updated successfully!");
          onProfileUpdate({ ...user, avatar: data.avatar });
        } else {
          addToast("error", "Upload Failed", data.error || "Image formatting issue.");
        }
      } catch (err) {
        addToast("error", "Network Failure", "Failed to connect to avatar pipeline.");
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const triggerAvatarSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-panel-box">
      <div>
        <h2 className="text-2xl font-extrabold text-[#F8FAFC]">Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Manage individual settings, upload avatars, and revise credential access keys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="profile-grids">
        {/* Avatar and Info summaries column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 text-center text-slate-350 shadow-md">
            <div className="relative inline-block mx-auto mb-4 group" id="profile-avatar-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
                accept="image/png, image/jpeg"
              />

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#4169E1]/60"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-extrabold text-[#5B7FFF] mx-auto">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </div>
              )}

              <button
                onClick={triggerAvatarSelect}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-2 bg-[#4169E1] hover:bg-[#5B7FFF] text-white rounded-full transition-transform border border-slate-100/10 shadow-lg cursor-pointer"
                id="btn-upload-avatar"
              >
                {isUploadingAvatar ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-2">
              <h3 className="font-bold text-slate-100 text-base leading-snug">{user.name}</h3>
              <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10 shrink-0" title="Verified Account" />
            </div>
            <p className="text-slate-500 text-xs mt-1 truncate">{user.email}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] uppercase font-bold tracking-wider text-blue-400">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified AI Analyst</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-center gap-1">
              <span>Account active since:</span>
              <span className="font-semibold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Change general details form & credentials forms col */}
        <div className="md:col-span-2 space-y-6">
          {/* General info updates */}
          <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#4169E1]" />
              <span>Modify general business information</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4" id="form-profile-info">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pname" className="block text-[10px] uppercase font-bold text-slate-500 mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="pname"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-[#4169E1] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isUpdatingProfile}
                  />
                </div>
                <div>
                  <label htmlFor="pemail" className="block text-[10px] uppercase font-bold text-slate-500 mb-2">
                    Your Email ID
                  </label>
                  <input
                    type="email"
                    id="pemail"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-[#4169E1] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isUpdatingProfile}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-[#4169E1] hover:bg-[#5B7FFF] border border-[#5B7FFF]/40 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  id="btn-save-meta-profile"
                >
                  {isUpdatingProfile ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Database...</span>
                    </>
                  ) : (
                    <>Update Profile</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Change password credentials updates */}
          <div className="bg-[#1E293B] border border-slate-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-sm uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2 mb-4">
              <KeyRound className="w-4 h-4 text-emerald-500" />
              <span>Change Password</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4" id="form-profile-password">
              <div>
                <label htmlFor="currpass" className="block text-[10px] uppercase font-bold text-slate-500 mb-2">
                  Active Security Password
                </label>
                <input
                  type="password"
                  id="currpass"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-[#4169E1] transition-all placeholder:text-slate-800"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newpass" className="block text-[10px] uppercase font-bold text-slate-500 mb-2">
                    New Security Password ({">= 6 chars"})
                  </label>
                  <input
                    type="password"
                    id="newpass"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-[#4169E1] transition-all placeholder:text-slate-800"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-newpass" className="block text-[10px] uppercase font-bold text-slate-500 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-newpass"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-[#4169E1] transition-all placeholder:text-slate-800"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#4169E1] hover:bg-[#5B7FFF] border border-[#5B7FFF]/40 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  id="btn-save-profile-password"
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Hashing and Saving...</span>
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
