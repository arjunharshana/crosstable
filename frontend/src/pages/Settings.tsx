import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";
import api from "../services/api";

export default function Settings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const tabs = ["General", "Chess Identity", "Notifications", "Security"];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    bio: "",
    fideId: "",
    chesscomUsername: "",
    timezone: "Asia/Kolkata",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        country: user.country || "",
        bio: user.bio || "",
        fideId: user.fideId || "",
        chesscomUsername: user.chesscomUsername || "",
        timezone: user.timezone || "Asia/Kolkata",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put("/users/profile", formData);
      login(response.data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      setMessage({
        type: "error",
        text: axiosError.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground">
          Settings
        </h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Manage your profile, identity, and preferences
        </p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-8 border-b border-border/50 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-accent text-accent flex items-center gap-2"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab === "Chess Identity" && (
              <span className="material-symbols-outlined text-lg">badge</span>
            )}
            {tab === "General" && (
              <span className="material-symbols-outlined text-lg">person</span>
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Status Message Display */}
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md border text-sm max-w-4xl ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab Content */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit}>
          {/* GENERAL TAB */}
          {activeTab === "General" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Basic Info & Avatar Card */}
              <div className="bg-card border border-border rounded-md p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] mb-8">
                <h2 className="text-lg font-serif font-bold text-foreground mb-6">
                  Basic Information
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group cursor-pointer">
                      <img
                        alt="Profile"
                        className="h-24 w-24 rounded-full ring-4 ring-background shadow-md object-cover"
                        src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1E293B&color=C5A059&size=150`}
                      />
                      <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-accent">
                          photo_camera
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Change Picture
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-background border border-border text-foreground rounded-md py-2.5 px-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors"
                        type="text"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-background border border-border text-foreground rounded-md py-2.5 px-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors"
                        type="text"
                        required
                      />
                    </div>
                    {/* Username (Read-Only) */}
                    <div className="group">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground font-mono text-lg">
                          @
                        </span>
                        <input
                          className="w-full bg-background/50 border border-border text-foreground font-mono rounded-md py-2.5 pl-8 pr-4 cursor-not-allowed opacity-80"
                          type="text"
                          value={user?.username || ""}
                          disabled
                        />
                      </div>
                    </div>

                    {/* Account Email (Read-Only) */}
                    <div className="group">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Account Email
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-background/50 border border-border text-muted-foreground rounded-md py-2.5 pl-4 pr-10 cursor-not-allowed opacity-80"
                          type="email"
                          value={user?.email || ""}
                          disabled
                        />
                        <span className="absolute right-3 top-2.5 material-symbols-outlined text-muted-foreground text-lg">
                          lock
                        </span>
                      </div>
                      <p className="mt-1.5 text-[10px] text-muted-foreground">
                        Email addresses cannot be changed directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Profile & Bio Card */}
              <div className="bg-card border border-border rounded-md p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] mb-8">
                <h2 className="text-lg font-serif font-bold text-foreground mb-6">
                  Public Profile
                </h2>

                <div className="flex flex-col gap-6">
                  <div className="group">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                      Location / Country
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                        location_on
                      </span>
                      <div className="group">
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                            flag
                          </span>

                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-background border border-border text-foreground font-mono rounded-md py-2.5 pl-10 pr-8 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors appearance-none"
                          >
                            <option value="" disabled>
                              Select Federation...
                            </option>
                            <option value="IND">IND - India</option>
                            <option value="USA">
                              USA - United States of America
                            </option>
                            <option value="NOR">NOR - Norway</option>
                            <option value="ENG">ENG - England</option>
                            <option value="GER">GER - Germany</option>
                            <option value="FRA">FRA - France</option>
                            <option value="CHN">CHN - China</option>
                            <option value="UZB">UZB - Uzbekistan</option>
                            <option value="NED">NED - Netherlands</option>
                            <option value="ESP">ESP - Spain</option>
                          </select>

                          {/* Dropdown arrow icon */}
                          <span className="absolute right-3 top-2.5 text-muted-foreground material-symbols-outlined pointer-events-none group-focus-within:text-accent">
                            arrow_drop_down
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-accent transition-colors">
                        Public Bio
                      </label>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {formData.bio.length}/500
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength={500}
                        className="w-full bg-background border border-border text-foreground rounded-md p-4 h-32 focus:outline-none focus:ring-1 focus:border-accent focus:ring-accent transition-colors resize-none placeholder-muted-foreground/50 leading-relaxed text-sm"
                        placeholder="Write a short bio about your chess career, playing style, or achievements..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              {/* Regional Settings */}
              <div className="bg-card border border-border rounded-md p-6 md:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] mb-8">
                <h2 className="text-lg font-serif font-bold text-foreground mb-6">
                  Regional Settings
                </h2>

                <div className="group">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                    Display Timezone
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                      schedule
                    </span>
                    <select
                      name="timezone"
                      value={formData.timezone || "Asia/Kolkata"}
                      onChange={handleChange}
                      className="w-full bg-background border border-border text-foreground rounded-md py-2.5 pl-10 pr-8 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors appearance-none"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Europe/Oslo">Europe/Oslo (CET)</option>
                      <option value="America/New_York">
                        America/New_York (EST)
                      </option>
                      <option value="UTC">
                        UTC (Coordinated Universal Time)
                      </option>
                    </select>
                    <span className="absolute right-3 top-2.5 text-muted-foreground material-symbols-outlined pointer-events-none group-focus-within:text-accent">
                      arrow_drop_down
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    This sets how match countdowns and tournament schedules are
                    displayed on your dashboard.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-4 pb-8">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-sm font-medium px-4 py-2 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-8 rounded-md shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-[#0B1120] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">
                      save
                    </span>
                  )}
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {/* CHESS IDENTITY TAB */}
          {activeTab === "Chess Identity" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* FIDE ID Block */}
              <div className="bg-card border border-border rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <span className="material-symbols-outlined text-9xl">
                    fingerprint
                  </span>
                </div>
                <div className="p-6 md:p-8 border-b border-border/50">
                  <h2 className="text-xl font-serif font-bold text-foreground mb-1">
                    Official FIDE Identity
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your FIDE ID. Verification will be handled manually by
                    admins.
                  </p>
                </div>
                <div className="p-6 md:p-8 relative z-10 max-w-md">
                  <div className="group">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                      FIDE ID
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                        language
                      </span>
                      <input
                        name="fideId"
                        value={formData.fideId}
                        onChange={handleChange}
                        className="w-full bg-background border border-border text-foreground font-mono rounded-md py-2.5 pl-10 pr-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors"
                        placeholder="e.g. 15000000"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chess.com API Verification Block */}
              <div className="bg-card border border-border rounded-md p-6 md:p-8 relative group hover:border-accent/30 transition-all mb-8 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-[#7FA650] rounded-md flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined">
                      chess_pawn
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      Chess.com Verification
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Real-time API check
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                      Username
                    </label>
                    <input
                      name="chesscomUsername"
                      value={formData.chesscomUsername}
                      onChange={handleChange}
                      className="w-full bg-background border border-border text-foreground font-mono text-sm rounded-md py-2.5 px-3 focus:outline-none focus:ring-1 focus:border-[#7FA650] focus:ring-[#7FA650] transition-colors"
                      type="text"
                      placeholder="Enter username"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full bg-[#7FA650] hover:bg-[#6D8E45] text-white font-bold py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    Verify & Link Account
                  </button>
                </div>
              </div>

              {/* Save Button for FIDE ID */}
              <div className="flex items-center justify-end gap-4 pb-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-8 rounded-md shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    save
                  </span>
                  Save Identity
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Other Tabs */}
        {["Notifications", "Security"].includes(activeTab) && (
          <div className="py-12 text-center border border-dashed border-border rounded-md animate-in fade-in">
            <span className="material-symbols-outlined text-muted-foreground text-4xl mb-3">
              construction
            </span>
            <h3 className="text-lg font-medium text-foreground">
              {activeTab} Settings
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This section is currently under development.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
