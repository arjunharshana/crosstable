import React from "react";

export interface PlayerStats {
  id: string;
  name: string;
  rating: number;
  isGuest: boolean;
  score: number;
  wins: number;
  draws: number;
  losses: number;
  playedBlack: number;
  matchHistory: {
    opponentId: string | null;
    outcome: "W" | "D" | "L" | "BYE";
  }[];
  tiebreaks: {
    buchholzCut1: number;
    buchholz: number;
    sonnebornBerger: number;
    progressiveScore: number;
    directEncounter: number;
  };
}

export interface Standing extends PlayerStats {
  rank: number;
}

export function StandingsPanel({ standings }: { standings: Standing[] }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No standings available yet.
      </div>
    );
  }

  const first = standings[0];
  const second = standings[1];
  const third = standings[2];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Top Players Spotlight */}
      <div className="grid grid-cols-12 gap-6">
        {/* 1st Place */}
        {first && (
          <div className="col-span-12 lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-xl border border-accent/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono text-sm text-accent flex items-center gap-2 font-bold tracking-widest uppercase">
                  <span className="material-symbols-outlined text-base">
                    workspace_premium
                  </span>
                  Current Leader
                </span>
                <div className="text-right">
                  <span className="font-mono text-4xl font-black text-accent">
                    {first.score}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full flex items-center justify-center bg-[#0B1120] border-2 border-accent shadow-[0_0_20px_rgba(197,160,89,0.15)] text-accent font-serif text-3xl font-bold">
                  {first.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold mb-1 text-foreground">
                    {first.name}
                  </h3>
                  <div className="flex gap-3 items-center">
                    <span className="px-2 py-0.5 bg-black/40 text-[10px] font-mono text-muted-foreground rounded uppercase tracking-wider border border-accent/10">
                      {first.isGuest ? "GUEST" : "USER"}
                    </span>
                    <span className="font-mono text-lg text-accent/80">
                      ELO {first.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-accent/10 pt-6">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    Buchholz
                  </p>
                  <p className="font-mono text-lg text-foreground font-bold">
                    {first.tiebreaks.buchholz}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    SB Tiebreak
                  </p>
                  <p className="font-mono text-lg text-foreground font-bold">
                    {first.tiebreaks.sonnebornBerger}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    W-D-L
                  </p>
                  <p className="font-mono text-lg text-accent font-bold">
                    {first.wins}-{first.draws}-{first.losses}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2nd Place */}
        {second && (
          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Rank 02
                </span>
                <span className="font-mono text-xl font-bold text-slate-300">
                  {second.score}
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground">
                {second.name}
              </h4>
              <p className="font-mono text-sm text-muted-foreground mt-1">
                ELO {second.rating}
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center border-t border-dashed border-white/10 pt-4">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                W-D-L
              </span>
              <span className="font-mono text-sm text-slate-300 font-bold">
                {second.wins}-{second.draws}-{second.losses}
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Rank 03
                </span>
                <span className="font-mono text-xl font-bold text-amber-600">
                  {third.score}
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground">
                {third.name}
              </h4>
              <p className="font-mono text-sm text-muted-foreground mt-1">
                ELO {third.rating}
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center border-t border-dashed border-white/10 pt-4">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                W-D-L
              </span>
              <span className="font-mono text-sm text-amber-600 font-bold">
                {third.wins}-{third.draws}-{third.losses}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Standings Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-accent/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#0B1120]/95 backdrop-blur-md border-b border-accent/10">
              <tr className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-5 font-bold">Rk</th>
                <th className="px-6 py-5 font-bold">Player</th>
                <th className="px-6 py-5 font-bold text-right">ELO</th>
                <th className="px-6 py-5 font-black text-center text-accent text-sm">
                  Pts
                </th>
                <th
                  className="px-6 py-5 font-bold text-right"
                  title="Buchholz Cut 1"
                >
                  BH-1
                </th>
                <th className="px-6 py-5 font-bold text-right" title="Buchholz">
                  BH
                </th>
                <th
                  className="px-6 py-5 font-bold text-right"
                  title="Sonneborn-Berger"
                >
                  SB
                </th>
                <th
                  className="px-6 py-5 font-bold text-right"
                  title="Progressive Score"
                >
                  PS
                </th>
                <th className="px-6 py-5 font-bold text-center">W-D-L</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {standings.map((player) => {
                // Determine row styling based on rank
                let rowClasses =
                  "group hover:bg-white/5 transition-colors border-b border-dashed border-white/5";
                let rankClasses = "text-muted-foreground";

                if (player.rank === 1) {
                  rowClasses =
                    "group hover:bg-accent/10 transition-colors bg-accent/5 border-b border-accent/10 shadow-[inset_0_0_20px_rgba(197,160,89,0.05)]";
                  rankClasses =
                    "text-accent font-black drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]";
                } else if (player.rank === 2) {
                  rowClasses =
                    "group hover:bg-slate-300/10 transition-colors bg-slate-300/5 border-b border-white/10";
                  rankClasses = "text-slate-300 font-bold";
                } else if (player.rank === 3) {
                  rowClasses =
                    "group hover:bg-amber-700/10 transition-colors bg-amber-700/5 border-b border-white/10";
                  rankClasses = "text-amber-600 font-bold";
                }

                return (
                  <tr key={player.id} className={rowClasses}>
                    <td className="px-6 py-4">
                      <span className={rankClasses}>
                        {String(player.rank).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans font-bold text-base text-foreground block truncate max-w-[200px]">
                        {player.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {player.rating}
                    </td>
                    <td className="px-6 py-4 text-center font-black text-accent text-lg">
                      {player.score}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {player.tiebreaks.buchholzCut1}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {player.tiebreaks.buchholz}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {player.tiebreaks.sonnebornBerger}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {player.tiebreaks.progressiveScore}
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">
                      {player.wins}-{player.draws}-{player.losses}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-black/40 flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <div className="flex gap-6">
            <span>BH-1: Buchholz Cut 1</span>
            <span>SB: Sonneborn-Berger</span>
            <span>PS: Progressive Score</span>
          </div>
          <div className="flex items-center gap-2 text-accent/80">
            <span className="material-symbols-outlined text-[14px]">
              verified
            </span>
            <span>FIDE Licensed System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
