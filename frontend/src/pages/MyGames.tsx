import { useState } from "react";

// Dummy data for the Match Ledger
const dummyGames = [
  {
    id: 1,
    resultText: "1-0",
    resultBg: "bg-[#10B981]/10",
    resultColor: "text-[#10B981]",
    resultBorder: "border-[#10B981]/20",
    resultShadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    playerColor: "White",
    playerIconBg: "bg-white",
    playerIconBorder: "border-slate-300",
    oppInitials: "HN",
    oppBg:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500/30",
    oppName: "Hikaru N.",
    oppTitle: "GM",
    oppRating: "3240",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    resultText: "0-1",
    resultBg: "bg-[#EF4444]/10",
    resultColor: "text-[#EF4444]",
    resultBorder: "border-[#EF4444]/20",
    resultShadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    playerColor: "Black",
    playerIconBg: "bg-background",
    playerIconBorder: "border-border",
    oppInitials: "AF",
    oppBg:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-500/30",
    oppName: "Alireza F.",
    oppTitle: "GM",
    oppRating: "2980",
    timeAgo: "Yesterday",
  },
  {
    id: 3,
    resultText: "½-½",
    resultBg: "bg-muted/10",
    resultColor: "text-muted-foreground",
    resultBorder: "border-muted/20",
    resultShadow: "",
    playerColor: "Black",
    playerIconBg: "bg-background",
    playerIconBorder: "border-border",
    oppInitials: "GD",
    oppBg:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500/30",
    oppName: "Gukesh D.",
    oppTitle: "GM",
    oppRating: "2795",
    timeAgo: "Jan 12",
  },
  {
    id: 4,
    resultText: "1-0",
    resultBg: "bg-[#10B981]/10",
    resultColor: "text-[#10B981]",
    resultBorder: "border-[#10B981]/20",
    resultShadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    playerColor: "White",
    playerIconBg: "bg-white",
    playerIconBorder: "border-slate-300",
    oppInitials: "AN",
    oppBg:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-500/30",
    oppName: "Abdusattorov",
    oppTitle: "GM",
    oppRating: "2750",
    timeAgo: "Jan 11",
  },
  {
    id: 5,
    resultText: "1-0",
    resultBg: "bg-[#10B981]/10",
    resultColor: "text-[#10B981]",
    resultBorder: "border-[#10B981]/20",
    resultShadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    playerColor: "Black",
    playerIconBg: "bg-background",
    playerIconBorder: "border-border",
    oppInitials: "WS",
    oppBg:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500/30",
    oppName: "Wesley So",
    oppTitle: "GM",
    oppRating: "2765",
    timeAgo: "Jan 10",
  },
];

export default function MyGames() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground tracking-tight">
            My Games
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            SYNCED: JUST NOW
          </p>
        </div>
      </header>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Performance Breakdown */}
        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-accent">
              pie_chart
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
            Performance Breakdown
          </h3>

          {/* match stats */}
          <div className="flex justify-between items-end w-full mb-5 relative z-10">
            <div className="group/stat cursor-default flex flex-col items-start">
              <span className="text-3xl font-bold text-[#10B981] font-mono group-hover/stat:text-foreground transition-colors leading-none mb-1">
                142
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Wins
              </span>
            </div>
            <div className="group/stat cursor-default flex flex-col items-center">
              <span className="text-3xl font-bold text-[#EF4444] font-mono group-hover/stat:text-foreground transition-colors leading-none mb-1">
                48
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Losses
              </span>
            </div>
            <div className="group/stat cursor-default flex flex-col items-end">
              <span className="text-3xl font-bold text-[#94A3B8] font-mono group-hover/stat:text-foreground transition-colors leading-none mb-1">
                86
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Draws
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-background rounded-full overflow-hidden flex gap-0.5 mt-2 relative z-10">
            <div
              className="h-full bg-[#10B981] hover:brightness-125 transition-all"
              style={{ width: "51%" }}
              title="51% Wins"
            ></div>
            <div
              className="h-full bg-[#EF4444] hover:brightness-125 transition-all"
              style={{ width: "17%" }}
              title="17% Losses"
            ></div>
            <div
              className="h-full bg-[#94A3B8] hover:brightness-125 transition-all"
              style={{ width: "32%" }}
              title="32% Draws"
            ></div>
          </div>
        </div>

        {/* Current Elo Graph */}
        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Current Elo (Blitz)
          </h3>
          <div className="flex items-end justify-between mb-2">
            <span className="text-4xl font-bold text-foreground font-mono">
              2914
            </span>
            <span className="text-[#10B981] text-xs font-mono mb-1.5 flex items-center bg-[#10B981]/10 px-2 py-1 rounded border border-[#10B981]/20">
              <span className="material-symbols-outlined text-sm mr-1">
                trending_up
              </span>
              +12 this month
            </span>
          </div>
          <div className="h-16 w-full relative">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 40"
            >
              <defs>
                <linearGradient
                  id="gradientElo"
                  x1="0%"
                  x2="0%"
                  y1="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#C5A059", stopOpacity: 0.5 }}
                  ></stop>
                  <stop
                    offset="100%"
                    style={{ stopColor: "#C5A059", stopOpacity: 0 }}
                  ></stop>
                </linearGradient>
              </defs>
              <path
                fill="url(#gradientElo)"
                className="opacity-20"
                d="M0,40 L0,30 L20,25 L40,28 L60,15 L80,10 L100,5 L100,40 Z"
              ></path>
              <path
                fill="none"
                stroke="#C5A059"
                strokeWidth="2"
                className="drop-shadow-[0_0_4px_rgba(197,160,89,0.5)]"
                d="M0,30 L20,25 L40,28 L60,15 L80,10 L100,5"
              ></path>
              <circle
                className="animate-pulse"
                cx="100"
                cy="5"
                fill="#C5A059"
                r="2"
              ></circle>
            </svg>
          </div>
        </div>

        {/* Avg Accuracy Circle */}
        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-accent">
              psychology
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Avg. Accuracy (Last 50)
          </h3>
          <div className="flex items-center gap-5 mt-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  fill="none"
                  r="36"
                  stroke="currentColor"
                  className="text-background"
                  strokeWidth="6"
                ></circle>
                <circle
                  className="drop-shadow-[0_0_8px_rgba(197,160,89,0.3)] text-accent"
                  cx="40"
                  cy="40"
                  fill="none"
                  r="36"
                  stroke="currentColor"
                  strokeDasharray="226"
                  strokeDashoffset="22"
                  strokeLinecap="round"
                  strokeWidth="6"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-foreground text-xl font-bold font-mono">
                  91.2
                </span>
                <span className="text-[9px] text-muted-foreground">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 relative z-10">
              <p className="text-sm text-muted-foreground font-medium">
                Sharper than usual.
              </p>
              <div className="text-xs text-[#10B981] flex items-center gap-1.5 bg-[#10B981]/5 py-1 px-2 rounded border border-[#10B981]/10">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                0.4% Blunder Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg group-focus-within:text-accent transition-colors">
            search
          </span>
          <input
            className="w-full bg-card border border-border rounded-md py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm focus:outline-none"
            placeholder="Search opponent, opening..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          <select className="bg-card border border-border text-xs text-foreground rounded-md px-3 py-2.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-w-[110px] cursor-pointer hover:border-muted-foreground transition-colors appearance-none">
            <option>All Formats</option>
            <option>Bullet</option>
            <option>Blitz</option>
            <option>Rapid</option>
            <option>Classical</option>
          </select>
          <select className="bg-card border border-border text-xs text-foreground rounded-md px-3 py-2.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-w-[110px] cursor-pointer hover:border-muted-foreground transition-colors appearance-none">
            <option>All Colors</option>
            <option>White</option>
            <option>Black</option>
          </select>
          <select className="bg-card border border-border text-xs text-foreground rounded-md px-3 py-2.5 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-w-[110px] cursor-pointer hover:border-muted-foreground transition-colors appearance-none">
            <option>Result</option>
            <option>Win</option>
            <option>Loss</option>
            <option>Draw</option>
          </select>
        </div>
      </div>

      {/* Match Ledger Table */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 bg-background/50 border-b border-border">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-lg">
              history_edu
            </span>
            Match Ledger
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            Showing 1-5 of 2,492 games
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-background/30">
                <th className="px-8 py-5 font-semibold w-24 text-center">
                  Res
                </th>
                <th className="px-8 py-5 font-semibold w-32">Color</th>
                <th className="px-8 py-5 font-semibold w-full">Opponent</th>
                <th className="px-8 py-5 font-semibold text-center w-32">
                  Rating
                </th>
                <th className="px-8 py-5 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dummyGames.map((game) => (
                <tr
                  key={game.id}
                  className="group hover:bg-background/40 transition-all duration-300 border-b border-border/50 relative hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02),0_4px_20px_-2px_rgba(0,0,0,0.2)] hover:border-accent/20"
                >
                  {/* Result */}
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <div
                        className={`w-12 h-9 rounded ${game.resultBg} border ${game.resultBorder} flex items-center justify-center ${game.resultColor} font-mono font-bold text-sm ${game.resultShadow}`}
                      >
                        {game.resultText}
                      </div>
                    </div>
                  </td>

                  {/* Color Played */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${game.playerIconBg} border-2 ${game.playerIconBorder} shadow-sm`}
                      ></div>
                      <span
                        className={`${game.playerColor === "White" ? "text-foreground" : "text-muted-foreground"} font-medium text-sm tracking-wide`}
                      >
                        {game.playerColor}
                      </span>
                    </div>
                  </td>

                  {/* Opponent */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded ${game.oppBg} flex items-center justify-center text-xs font-bold border`}
                      >
                        {game.oppInitials}
                      </div>
                      <div>
                        <span className="font-mono text-foreground text-base group-hover:text-accent transition-colors block">
                          {game.oppName}
                        </span>
                        <span className="text-[10px] bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 px-1.5 py-0.5 rounded inline-block mt-1">
                          {game.oppTitle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-8 py-5 text-center font-mono text-foreground/90 text-base">
                    {game.oppRating}
                  </td>

                  {/* Date */}
                  <td className="px-8 py-5 text-right font-mono text-muted-foreground text-sm">
                    {game.timeAgo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-background border-t border-border flex items-center justify-between">
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-2 rounded-md hover:bg-card transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
            Previous
          </button>
          <div className="flex gap-1">
            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-accent text-[#0B1120] font-bold text-xs shadow-sm">
              1
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs border border-border">
              2
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs border border-border">
              3
            </button>
            <span className="h-8 w-8 flex items-center justify-center text-muted-foreground text-xs">
              ...
            </span>
            <button className="h-8 w-8 flex items-center justify-center rounded-md bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs border border-border">
              249
            </button>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-2 rounded-md hover:bg-card transition-colors">
            Next
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
