import { useState } from "react";

export default function MyTournaments() {
  const [activeTab, setActiveTab] = useState<
    "organizing" | "playing" | "history"
  >("organizing");

  const organizingEvents = [
    {
      id: 1,
      status: "Live • Round 4",
      statusColor: "text-[#10B981]",
      statusBg: "bg-[#10B981]/10",
      statusBorder: "border-[#10B981]/20",
      title: "Tata Steel 2026",
      subtitle: "Masters Section",
      dateMonth: "JAN",
      dateDay: "12",
      icon: "king_bed",
      progressLabel: "Tournament Progress",
      progressValue: "4/13 Rounds",
      progressPercent: "w-[30%]",
      progressColor: "bg-accent",
      stat1Label: "Players",
      stat1Value: "14",
      stat1Sub: "All Present",
      stat1SubColor: "text-[#10B981]",
      stat2Label: "Avg Rating",
      stat2Value: "2756",
      stat2Sub: "+4",
      stat2SubColor: "text-accent",
      footerTags: ["FIDE Standard", "Wijk aan Zee", "Official"],
      primaryAction: "Arbiter Panel",
      secondaryAction: "Pairings",
    },
    {
      id: 2,
      status: "Registration Open",
      statusColor: "text-accent",
      statusBg: "bg-accent/10",
      statusBorder: "border-accent/20",
      title: "Candidates 2026",
      subtitle: "Open Section",
      dateMonth: "APR",
      dateDay: "02",
      icon: "crown",
      progressLabel: "Setup Status",
      progressValue: "Ready for Draw",
      progressPercent: "w-[90%]",
      progressColor: "bg-accent",
      stat1Label: "Registered",
      stat1Value: "8",
      stat1Sub: "8/8 Full",
      stat1SubColor: "text-[#10B981]",
      stat2Label: "Venue",
      stat2Value: "Great Hall",
      stat2Sub: "CA",
      stat2SubColor: "text-muted-foreground",
      footerTags: ["FIDE Standard", "Double RR", "Toronto"],
      primaryAction: "Manage Players",
      secondaryAction: "Edit Details",
    },
  ];

  const playingEvents = [
    {
      id: 101,
      status: "Upcoming",
      statusColor: "text-accent",
      statusBg: "bg-accent/10",
      statusBorder: "border-accent/20",
      title: "Titled Tuesday",
      subtitle: "Online Blitz",
      dateMonth: "FEB",
      dateDay: "28",
      icon: "bolt",
      progressLabel: "Round 1 Starts In",
      progressValue: "2 Days",
      progressPercent: "w-[0%]",
      progressColor: "bg-muted",
      stat1Label: "My Seed",
      stat1Value: "42",
      stat1Sub: "of 500",
      stat1SubColor: "text-muted-foreground",
      stat2Label: "Time Control",
      stat2Value: "3+1",
      stat2Sub: "Blitz",
      stat2SubColor: "text-accent",
      footerTags: ["Online", "11 Rounds", "Swiss"],
      primaryAction: "View Lobby",
      secondaryAction: "Withdraw",
    },
  ];

  const historyEvents = [
    {
      id: 201,
      status: "Completed",
      statusColor: "text-muted-foreground",
      statusBg: "bg-muted/50",
      statusBorder: "border-border",
      title: "Winter Open 2025",
      subtitle: "Classical Format",
      dateMonth: "DEC",
      dateDay: "15",
      icon: "emoji_events",
      progressLabel: "Final Placement",
      progressValue: "3rd Place",
      progressPercent: "w-[100%]",
      progressColor: "bg-[#10B981]",
      stat1Label: "Points",
      stat1Value: "7.5",
      stat1Sub: "/ 9",
      stat1SubColor: "text-muted-foreground",
      stat2Label: "Rating Change",
      stat2Value: "+12",
      stat2Sub: "Elo",
      stat2SubColor: "text-[#10B981]",
      footerTags: ["FIDE Standard", "9 Rounds", "Swiss"],
      primaryAction: "View Standings",
      secondaryAction: "Download PGN",
    },
  ];

  // Helper to determine which array to map over
  const currentEvents =
    activeTab === "organizing"
      ? organizingEvents
      : activeTab === "playing"
        ? playingEvents
        : historyEvents;

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            My Tournaments
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Manage your events and participations
          </p>
        </div>
        <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-6 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)] group w-full sm:w-auto transform hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">
            add
          </span>
          <span>Create New</span>
        </button>
      </header>

      {/* Tabs / Segmented Control */}
      <div className="flex border-b border-border/60 mb-8 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab("organizing")}
          className={`px-6 py-4 text-sm font-medium relative whitespace-nowrap transition-colors ${activeTab === "organizing" ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}
        >
          Organizing
          <span
            className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${activeTab === "organizing" ? "bg-accent/20 text-accent" : "bg-card text-muted-foreground"}`}
          >
            {organizingEvents.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("playing")}
          className={`px-6 py-4 text-sm font-medium relative whitespace-nowrap transition-colors ${activeTab === "playing" ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}
        >
          Participating
          <span
            className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${activeTab === "playing" ? "bg-accent/20 text-accent" : "bg-card text-muted-foreground"}`}
          >
            {playingEvents.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-4 text-sm font-medium relative whitespace-nowrap transition-colors ${activeTab === "history" ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}
        >
          History
          <span
            className={`ml-2 text-xs px-1.5 py-0.5 rounded-sm ${activeTab === "history" ? "bg-accent/20 text-accent" : "bg-card text-muted-foreground"}`}
          >
            {historyEvents.length}
          </span>
        </button>
      </div>

      {/* Stats Row (Only show if Organizing) - Switched to grid-cols-3 and removed Disputes */}
      {activeTab === "organizing" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-card/50 border border-border p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                Total Active
              </p>
              <p className="text-2xl font-mono text-foreground">03</p>
            </div>
            <div className="h-10 w-10 rounded bg-accent/10 flex items-center justify-center text-accent">
              <span className="material-symbols-outlined">event_available</span>
            </div>
          </div>
          <div className="bg-card/50 border border-border p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                Pending Requests
              </p>
              <p className="text-2xl font-mono text-foreground">12</p>
            </div>
            <div className="h-10 w-10 rounded bg-accent/10 flex items-center justify-center text-accent">
              <span className="material-symbols-outlined">person_add</span>
            </div>
          </div>
          <div className="bg-card/50 border border-border p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                Drafts
              </p>
              <p className="text-2xl font-mono text-foreground">02</p>
            </div>
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
              <span className="material-symbols-outlined">edit_document</span>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {currentEvents.map((event) => (
          <div
            key={event.id}
            className={`relative group hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full drop-shadow-md ${activeTab === "history" ? "opacity-80 hover:opacity-100" : ""}`}
          >
            {/* The Ticket Container */}
            <div className="flex-1 flex flex-col rounded-md overflow-hidden bg-gradient-to-br from-card to-background border border-border relative z-10 before:absolute before:content-[''] before:h-5 before:w-5 before:bg-background before:rounded-full before:top-1/2 before:-translate-y-1/2 before:-left-2.5 before:shadow-[inset_-2px_0_3px_rgba(0,0,0,0.1)] before:border-r before:border-border before:z-20 after:absolute after:content-[''] after:h-5 after:w-5 after:bg-background after:rounded-full after:top-1/2 after:-translate-y-1/2 after:-right-2.5 after:shadow-[inset_2px_0_3px_rgba(0,0,0,0.1)] after:border-l after:border-border after:z-20">
              {/* Top Half of Ticket */}
              <div className="p-6 pb-5 border-b-2 border-dashed border-border/60 relative">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
                  <span className="material-symbols-outlined text-8xl text-foreground">
                    {event.icon}
                  </span>
                </div>

                <div className="flex justify-between items-start z-10 relative">
                  <div className="space-y-1">
                    <span
                      className={`px-2 py-0.5 ${event.statusBg} ${event.statusColor} text-[10px] font-bold uppercase rounded border ${event.statusBorder} font-mono tracking-wider`}
                    >
                      {event.status}
                    </span>
                    <h3 className="font-bold text-foreground text-xl font-serif tracking-wide mt-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-accent font-mono uppercase tracking-wider">
                      {event.subtitle}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-background border border-border flex items-center justify-center rounded-md shrink-0 shadow-inner">
                    <span className="font-mono text-xs font-bold text-foreground text-center leading-tight">
                      {event.dateMonth}
                      <br />
                      <span className="text-xl">{event.dateDay}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Half of Ticket */}
              <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-background/50">
                {/* Progress / Placement Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-[10px] mb-2 font-mono uppercase tracking-wider text-muted-foreground">
                    <span>{event.progressLabel}</span>
                    <span className="text-foreground">
                      {event.progressValue}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
                    <div
                      className={`h-full ${event.progressColor} ${event.progressPercent} relative ${event.status.includes("Live") ? "bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]" : ""}`}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="border-l-2 border-border pl-3">
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5 font-mono">
                      {event.stat1Label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-mono text-foreground">
                        {event.stat1Value}
                      </span>
                      <span className={`text-[10px] ${event.stat1SubColor}`}>
                        {event.stat1Sub}
                      </span>
                    </div>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="text-[10px] text-muted-foreground uppercase mb-0.5 font-mono">
                      {event.stat2Label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-mono text-foreground">
                        {event.stat2Value}
                      </span>
                      <span className={`text-[10px] ${event.stat2SubColor}`}>
                        {event.stat2Sub}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-background/80 border border-border/50 p-2.5 rounded-md mb-5">
                  <div className="flex justify-center gap-2 items-center text-[10px] font-mono text-muted-foreground truncate">
                    {event.footerTags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <span>{tag}</span>
                        {i < event.footerTags.length - 1 && <span>•</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-2 flex gap-3">
                  <button
                    className={`flex-1 ${activeTab === "organizing" && event.status.includes("Live") ? "bg-accent hover:bg-accent/90 text-[#0B1120] shadow-[0_0_15px_rgba(197,160,89,0.15)] border-transparent" : "bg-transparent text-foreground border-border hover:border-accent hover:text-accent"} text-xs font-bold uppercase tracking-wider py-2.5 rounded-md border transition-colors`}
                  >
                    {event.primaryAction}
                  </button>
                  <button className="flex-1 bg-transparent text-foreground text-xs font-bold uppercase tracking-wider py-2.5 rounded-md border border-border hover:bg-card hover:border-muted-foreground transition-colors">
                    {event.secondaryAction}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Ticket Card (Only in Organizing View) */}
        {activeTab === "organizing" && (
          <button className="relative group text-left min-h-[340px] drop-shadow-sm hover:drop-shadow-md transition-all">
            <div className="h-full flex flex-col rounded-md overflow-hidden bg-card/20 hover:bg-card/40 border-2 border-dashed border-border hover:border-accent/50 transition-all duration-300">
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)] group-hover:border-accent">
                  <span className="material-symbols-outlined text-3xl text-accent">
                    add
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-2 font-serif">
                    Create Tournament
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono max-w-[200px] mx-auto leading-relaxed">
                    Initialize a new event ticket. Configure format, rounds, and
                    invite players.
                  </p>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Empty State Handler */}
        {currentEvents.length === 0 && (
          <div className="col-span-full py-16 text-center bg-card/20 border border-dashed border-border rounded-md">
            <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">
              confirmation_number
            </span>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Active Tickets
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Nothing to see here right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
