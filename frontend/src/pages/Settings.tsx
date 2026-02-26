import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("General");

  const tabs = ["General", "Chess Identity", "Notifications", "Security"];

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

      {/* Tab Content */}
      <div className="max-w-4xl">
        {/* general */}
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
                      src={`https://ui-avatars.com/api/?name=${user?.fname}+${user?.lname}&background=1E293B&color=C5A059&size=150`}
                    />
                    <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-accent">
                        photo_camera
                      </span>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                      className="w-full bg-background border border-border text-foreground rounded-md py-2.5 px-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors"
                      type="text"
                      defaultValue={user?.fname || "Magnus"}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                      Last Name
                    </label>
                    <input
                      className="w-full bg-background border border-border text-foreground rounded-md py-2.5 px-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors"
                      type="text"
                      defaultValue={user?.lname || "Carlsen"}
                    />
                  </div>
                  <div className="group md:col-span-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Account Email
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-background/50 border border-border text-muted-foreground rounded-md py-2.5 pl-4 pr-10 cursor-not-allowed"
                        type="email"
                        defaultValue={user?.email || "magnus@example.com"}
                        disabled
                      />
                      <span className="absolute right-3 top-2.5 material-symbols-outlined text-muted-foreground text-lg">
                        lock
                      </span>
                    </div>
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      Email addresses cannot be changed directly. Contact
                      support if you lose access.
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
                    <input
                      className="w-full bg-background border border-border text-foreground rounded-md py-2.5 pl-10 pr-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors placeholder-muted-foreground/50"
                      placeholder="e.g. Oslo, Norway"
                      type="text"
                    />
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-accent transition-colors">
                      Public Bio
                    </label>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      142/500
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full bg-background border border-border text-foreground rounded-md p-4 h-32 focus:outline-none focus:ring-1 focus:border-accent focus:ring-accent transition-colors resize-none placeholder-muted-foreground/50 leading-relaxed text-sm"
                      placeholder="Write a short bio about your chess career, playing style, or achievements..."
                      defaultValue="Five-time World Chess Champion. Highest rated player in history. I enjoy playing the Ruy Lopez and endgames where I can squeeze water from a stone."
                    ></textarea>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    This bio will be displayed on your public profile and
                    tournament registrations.
                  </p>
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
                  <select className="w-full bg-background border border-border text-foreground rounded-md py-2.5 pl-10 pr-8 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors appearance-none">
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
              <button className="text-muted-foreground hover:text-foreground text-sm font-medium px-4 py-2 transition-colors">
                Discard Changes
              </button>
              <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-8 rounded-md shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-lg">save</span>
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* chess id tab */}
        {activeTab === "Chess Identity" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Official Credentials Card */}
            <div className="bg-card border border-border rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <span className="material-symbols-outlined text-9xl">
                  fingerprint
                </span>
              </div>

              <div className="p-6 md:p-8 border-b border-border/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-1">
                    Official Credentials
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Verify your identity across federations to participate in
                    official tournaments.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-xs font-mono font-bold uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      verified
                    </span>{" "}
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* FIDE ID */}
                <div className="group">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                    FIDE ID
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                      language
                    </span>
                    <input
                      className="w-full bg-background border border-border text-foreground font-mono rounded-md py-2.5 pl-10 pr-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors placeholder-muted-foreground/50"
                      placeholder="e.g. 15000000"
                      type="text"
                      defaultValue="5000017"
                    />
                    <div className="absolute right-3 top-3.5">
                      <span className="block h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]"></span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground font-mono flex items-center justify-between">
                    <span>
                      Rating: <span className="text-foreground">2882</span>{" "}
                      (Standard)
                    </span>
                    <span className="text-[#10B981]">Connected</span>
                  </p>
                </div>

                {/* AICF ID */}
                <div className="group">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                    AICF ID (India)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                      flag
                    </span>
                    <input
                      className="w-full bg-background border border-border text-foreground font-mono rounded-md py-2.5 pl-10 pr-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors placeholder-muted-foreground/50"
                      placeholder="e.g. 12345678"
                      type="text"
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground font-mono">
                    Not Connected
                  </p>
                </div>

                {/* National ID */}
                <div className="group">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                    Other National ID
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground material-symbols-outlined text-lg group-focus-within:text-accent transition-colors">
                      account_balance
                    </span>
                    <input
                      className="w-full bg-background border border-border text-foreground font-mono rounded-md py-2.5 pl-10 pr-4 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors placeholder-muted-foreground/50"
                      placeholder="e.g. USCF / ECF Code"
                      type="text"
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground font-mono">
                    Not Connected
                  </p>
                </div>

                {/* Official Title */}
                <div className="group">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 group-focus-within:text-accent transition-colors">
                    Official Title
                  </label>
                  <div className="relative">
                    <select className="w-full bg-background border border-border text-foreground font-mono rounded-md py-2.5 pl-3 pr-8 focus:ring-1 focus:outline-none focus:border-accent focus:ring-accent transition-colors appearance-none">
                      <option value="GM">GM - Grandmaster</option>
                      <option value="IM">IM - International Master</option>
                      <option value="FM">FM - FIDE Master</option>
                      <option value="CM">CM - Candidate Master</option>
                      <option value="none">None</option>
                    </select>
                    <span className="absolute right-3 top-2.5 text-muted-foreground material-symbols-outlined pointer-events-none group-focus-within:text-accent">
                      arrow_drop_down
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10px] text-accent font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      info
                    </span>{" "}
                    Verification required for title display
                  </p>
                </div>
              </div>
            </div>

            {/* Online Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Chess.com */}
              <div className="bg-card border border-border rounded-md p-6 relative group hover:border-accent/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#7FA650] rounded-md flex items-center justify-center text-white shadow-lg">
                      <span className="material-symbols-outlined">
                        chess_pawn
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">
                        Chess.com
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Status: <span className="text-[#10B981]">LINKED</span>
                      </p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <span className="material-symbols-outlined">link_off</span>
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Username
                  </label>
                  <input
                    className="w-full bg-background border border-border text-foreground font-mono text-sm rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:border-[#7FA650] focus:ring-[#7FA650] transition-colors"
                    readOnly
                    type="text"
                    value="MagnusCarlsen"
                  />
                  <div className="absolute right-3 top-7">
                    <span className="material-symbols-outlined text-[#10B981] text-sm">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>

              {/* Lichess */}
              <div className="bg-card border border-border rounded-md p-6 relative group hover:border-accent/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-foreground rounded-md flex items-center justify-center text-background shadow-lg">
                      <span className="material-symbols-outlined text-2xl">
                        swords
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">
                        Lichess.org
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Status: <span>NOT LINKED</span>
                      </p>
                    </div>
                  </div>
                  <button className="text-accent hover:text-accent/80 transition-colors">
                    <span className="material-symbols-outlined">link</span>
                  </button>
                </div>
                <div className="relative group/input">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1 group-focus-within/input:text-foreground transition-colors">
                    Username
                  </label>
                  <input
                    className="w-full bg-background border border-border text-foreground font-mono text-sm rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:border-foreground focus:ring-foreground transition-colors placeholder-muted-foreground/50"
                    placeholder="Enter username..."
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4 pb-8">
              <button className="text-muted-foreground hover:text-foreground text-sm font-medium px-4 py-2 transition-colors">
                Discard Changes
              </button>
              <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-8 rounded-md shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-lg">save</span>
                Save Identity
              </button>
            </div>
          </div>
        )}

        {/*other tabs */}
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
