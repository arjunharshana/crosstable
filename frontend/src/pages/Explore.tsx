import { useState } from "react";

// dummy data for testing
const dummyTournaments = [
  {
    id: 1,
    title: "London Chess Classic",
    subtitle: "Open Section & IM Norm",
    status: "Registration Open",
    statusColor: "text-[#10B981]",
    statusBg: "bg-[#10B981]",
    date: "Dec 01-10",
    timeControl: "90+30 Clsc",
    format: "9-Rd Swiss",
    players: "88/120",
    orgName: "ECF Org.",
    orgAbbr: "EC",
    actionText: "Join Lobby",
  },
  {
    id: 2,
    title: "Titled Tuesday (Early)",
    subtitle: "Online Blitz Event",
    status: "Registration Open",
    statusColor: "text-[#10B981]",
    statusBg: "bg-[#10B981]",
    date: "Tomorrow",
    timeControl: "3+1 Blitz",
    format: "11-Rd Swiss",
    players: "412/Unlim",
    orgName: "Official",
    orgAbbr: "ver",
    actionText: "Join Lobby",
  },
  {
    id: 3,
    title: "Reykjavik Open 2026",
    subtitle: "Harpa Concert Hall",
    status: "Registration Open",
    statusColor: "text-[#10B981]",
    statusBg: "bg-[#10B981]",
    date: "Mar 12-18",
    timeControl: "90+30 Clsc",
    format: "10-Rd Swiss",
    players: "156/300",
    orgName: "ICE Fed.",
    orgAbbr: "IS",
    actionText: "Join Lobby",
  },
  {
    id: 4,
    title: "Magnus Academy U16",
    subtitle: "Junior Rapid Championship",
    status: "Waitlist Only",
    statusColor: "text-accent",
    statusBg: "bg-accent",
    date: "Nov 05",
    timeControl: "10+5 Rapid",
    format: "7-Rd Swiss",
    players: "64/64",
    orgName: "Academy",
    orgAbbr: "MA",
    actionText: "Join Waitlist",
  },
  {
    id: 5,
    title: "Corporate Chess League",
    subtitle: "Team Rapid Event",
    status: "Registration Open",
    statusColor: "text-[#10B981]",
    statusBg: "bg-[#10B981]",
    date: "Nov 22",
    timeControl: "10+2 Rapid",
    format: "Team RR",
    players: "12/20",
    orgName: "Corp. Lea.",
    orgAbbr: "CC",
    actionText: "Join Lobby",
  },
  {
    id: 6,
    title: "Wijk aan Zee Amateurs",
    subtitle: "Daily Open Group",
    status: "Registration Open",
    statusColor: "text-[#10B981]",
    statusBg: "bg-[#10B981]",
    date: "Jan 14-25",
    timeControl: "100+50 Clsc",
    format: "9-Rd Swiss",
    players: "1880/2000",
    orgName: "Tata Steel",
    orgAbbr: "TS",
    actionText: "Join Lobby",
  },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Sticky Search & Filter Bar */}
      <div className="sticky -top-6 lg:-top-8 -mt-6 lg:-mt-8 pt-6 lg:pt-8 -mx-6 lg:-mx-8 px-6 lg:px-8 pb-3 mb-6 bg-background/80 backdrop-blur-xl z-40 border-b border-border shadow-sm flex flex-col md:flex-row items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-[18px]">
            search
          </span>
          <input
            className="w-full bg-card border border-border rounded-md py-2 pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all focus:outline-none"
            placeholder="Search tournaments, players, or organizers..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* divider */}
        <div className="hidden md:block h-6 w-px bg-border mx-1"></div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <select className="bg-card border border-border text-sm text-muted-foreground rounded-md px-2 py-2 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none min-w-[100px]">
            <option>Format: All</option>
            <option>Classical</option>
            <option>Rapid</option>
            <option>Blitz</option>
          </select>
          <select className="bg-card border border-border text-sm text-muted-foreground rounded-md px-2 py-2 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none min-w-[100px]">
            <option>Status: Open</option>
            <option>Live</option>
            <option>Completed</option>
          </select>
          <select className="bg-card border border-border text-sm text-muted-foreground rounded-md px-2 py-2 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none min-w-[100px]">
            <option>Region: Global</option>
            <option>Europe</option>
            <option>Americas</option>
            <option>Asia</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end mt-2 md:mt-0">
          <button
            className="p-2 text-muted-foreground hover:text-accent transition-colors border border-transparent hover:border-border rounded-md hidden sm:block"
            title="Advanced Filters"
          >
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
          </button>
          <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all shadow-sm w-full md:w-auto whitespace-nowrap text-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Host Event</span>
          </button>
        </div>
      </div>

      {/* Featured Hero Card */}
      <div className="mb-12 w-full relative group">
        <div className="absolute inset-0 bg-accent/5 rounded-md blur-xl group-hover:bg-accent/10 transition-all duration-500"></div>
        <div className="relative bg-card border border-accent/30 rounded-md shadow-[0_0_20px_rgba(197,160,89,0.1)] overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8 flex flex-col justify-between z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-accent text-[#0B1120] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                  Featured
                </span>
                <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>{" "}
                  Registration Open
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3 leading-tight">
                AICF National Rapid Qualifiers 2026
              </h2>
              <p className="text-muted-foreground max-w-xl mb-6 text-sm leading-relaxed">
                Join the most prestigious rapid chess event of the year. Qualify
                for the candidates cycle with a prize fund of ₹500,000. Open to
                all federations.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-mono text-muted-foreground border-t border-border/50 pt-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">
                  calendar_month
                </span>
                <span>Oct 15 - 20, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">
                  location_on
                </span>
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">
                  timer
                </span>
                <span>15+10 Rapid</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">
                  groups
                </span>
                <span className="text-foreground font-medium">
                  245/500 Registered
                </span>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 bg-background/50 border-t md:border-t-0 md:border-l border-border/50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="text-center relative z-10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Entry Fee
              </p>
              <p className="text-3xl font-mono text-foreground font-bold mb-6">
                ₹1000.0
              </p>
              <button className="w-full bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-3 px-8 rounded-md transition-all shadow-md uppercase tracking-wider text-sm flex items-center justify-center gap-2 group transform hover:-translate-y-0.5">
                Register Now
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest">
                Registration closes in 4 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
          <span className="material-symbols-outlined text-accent">
            confirmation_number
          </span>
          Discover Tournaments
        </h3>
        <div className="text-xs font-mono text-muted-foreground">
          Showing 1-{dummyTournaments.length} of 42 events
        </div>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="bg-card border border-border rounded-md shadow-sm hover:transition-transform hover:scale-[1.02] hover:shadow-md transition-all group flex flex-col h-full overflow-hidden"
          >
            {/* Top Cutout Section */}
            <div className="p-6 pb-5 relative bg-background/30 border-b-2 border-dashed border-border before:absolute before:content-[''] before:h-5 before:w-5 before:bg-background before:rounded-full before:top-1/2 before:-translate-y-1/2 before:-left-2.5 before:shadow-[inset_-2px_0_3px_rgba(0,0,0,0.1)] before:z-10 after:absolute after:content-[''] after:h-5 after:w-5 after:bg-background after:rounded-full after:top-1/2 after:-translate-y-1/2 after:-right-2.5 after:shadow-[inset_2px_0_3px_rgba(0,0,0,0.1)] after:z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${tournament.statusBg} ${tournament.status === "Registration Open" ? "animate-pulse" : ""}`}
                  ></span>
                  <span
                    className={`text-[10px] font-bold uppercase ${tournament.statusColor} tracking-wider`}
                  >
                    {tournament.status}
                  </span>
                </div>
                <button className="text-muted-foreground hover:text-accent transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    bookmark
                  </span>
                </button>
              </div>

              <h4 className="text-lg font-serif font-bold text-foreground mb-1 group-hover:text-accent transition-colors truncate">
                {tournament.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-5">
                {tournament.subtitle}
              </p>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-mono text-muted-foreground">
                <div>
                  <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                    Date
                  </span>
                  <span className="text-foreground">{tournament.date}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                    Time Control
                  </span>
                  <span className="text-foreground">
                    {tournament.timeControl}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                    Format
                  </span>
                  <span className="text-foreground">{tournament.format}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                    Players
                  </span>
                  <span className="text-foreground">{tournament.players}</span>
                </div>
              </div>
            </div>

            {/* Bottom Stub Section */}
            <div className="p-4 bg-card flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                {tournament.orgAbbr === "ver" ? (
                  <span className="material-symbols-outlined text-lg text-accent">
                    verified
                  </span>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
                    {tournament.orgAbbr}
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  {tournament.orgName}
                </span>
              </div>
              <button className="bg-transparent border border-border hover:border-accent hover:text-accent text-muted-foreground text-xs font-mono font-bold py-2 px-4 rounded-md transition-all uppercase tracking-wide">
                {tournament.actionText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
