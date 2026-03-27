import React, { useState, useEffect } from "react";
import api from "../services/api";
import { StandingsPanel, type Standing } from "./StandingsPanel";

export interface Participant {
  _id: string;
  isGuest?: boolean;
  guestName?: string;
  guestRating?: number;
  user?: {
    firstName: string;
    lastName: string;
    ratings?: Record<string, number>;
  };
}

export interface TournamentData {
  _id: string;
  status: string;
  formatType?: string;
  participants: Participant[];
}

export interface MatchData {
  _id: string;
  tournament: string;
  round: number;
  board: number;
  whitePlayer: string;
  blackPlayer: string | null;
  result: "1-0" | "0-1" | "1/2-1/2" | "*" | "BYE";
  pgn?: string;
}

interface TournamentPanelProps {
  tournament: TournamentData;
  matches: MatchData[];
  setMatches: React.Dispatch<React.SetStateAction<MatchData[]>>;
  currentRound: number;
  standings: Standing[];
}

export function TournamentPanel({
  tournament,
  matches,
  setMatches,
  currentRound,
  standings,
}: TournamentPanelProps) {
  // TAB & ROUND STATE
  const [activeTab, setActiveTab] = useState<"pairings" | "standings">(
    "pairings",
  );
  const [selectedRound, setSelectedRound] = useState<number>(currentRound);

  // Automatically jump to the newest round when the tournament advances
  useEffect(() => {
    setSelectedRound(currentRound);
  }, [currentRound]);

  // Determine which rounds actually exist in the matches array
  const availableRounds = Array.from(new Set(matches.map((m) => m.round))).sort(
    (a, b) => a - b,
  );

  // If the tournament hasn't started, default to Round 1
  const roundsList = availableRounds.length > 0 ? availableRounds : [1];

  // Filter matches based on the dropdown selection, NOT just the current active round
  const displayedMatches = matches.filter((m) => m.round === selectedRound);

  const getPlayerDetails = (participantId: string | null) => {
    if (participantId === "BYE" || !participantId)
      return { name: "BYE", rating: "-", isBye: true };

    const participant = tournament.participants.find(
      (p: Participant) => p._id === participantId,
    );
    if (!participant)
      return { name: "Unknown Player", rating: "-", isBye: false };

    if (participant.isGuest) {
      return {
        name: participant.guestName,
        rating: participant.guestRating || 1200,
        isBye: false,
      };
    }

    const formatKey = tournament.formatType?.toLowerCase() || "rapid";
    return {
      name: `${participant.user?.firstName} ${participant.user?.lastName}`,
      rating: participant.user?.ratings?.[formatKey] || 1200,
      isBye: false,
    };
  };

  const handleUpdateResult = async (matchId: string, newResult: string) => {
    try {
      const response = await api.patch(
        `/tournaments/${tournament._id}/matches/${matchId}`,
        { result: newResult },
      );
      setMatches((prev) =>
        prev.map((m) => (m._id === matchId ? response.data : m)),
      );
    } catch (error) {
      console.error("Failed to update score:", error);
      alert("Failed to update score. Are you an Arbiter?");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mt-2">
      {/* TABS HEADER */}
      <div className="flex gap-8 border-b border-accent/20">
        <button
          onClick={() => setActiveTab("pairings")}
          className={`pb-4 border-b-2 font-bold tracking-wide flex items-center gap-2 transition-all ${
            activeTab === "pairings"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            format_list_bulleted
          </span>
          Pairings & Results
        </button>
        <button
          onClick={() => setActiveTab("standings")}
          className={`pb-4 border-b-2 font-bold tracking-wide flex items-center gap-2 transition-all ${
            activeTab === "standings"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            leaderboard
          </span>
          Standings
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "pairings" ? (
        <div className="animate-in fade-in duration-300">
          {/* ROUND SELECTOR HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-serif font-bold text-foreground">
              Round {selectedRound}
            </h4>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Filter:
              </span>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(Number(e.target.value))}
                className="bg-[#0B1120] border border-accent/30 text-accent font-mono font-bold text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-accent hover:border-accent/60 transition-colors cursor-pointer appearance-none shadow-[0_0_10px_rgba(197,160,89,0.1)]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C5A059'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1rem",
                  paddingRight: "2.5rem",
                }}
              >
                {roundsList.map((r) => (
                  <option
                    key={r}
                    value={r}
                    className="bg-[#0B1120] text-foreground"
                  >
                    Round {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {displayedMatches.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground bg-white/5 border border-accent/10 rounded-xl">
              No matches generated for this round yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayedMatches.map((match) => {
                const white = getPlayerDetails(match.whitePlayer);
                const black = getPlayerDetails(match.blackPlayer);
                const isByeMatch = match.result === "BYE";

                // SAFETY LOCK: Disable score editing for past rounds
                const isPastRound = match.round < currentRound;

                return (
                  <div
                    key={match._id}
                    className={`bg-white/5 backdrop-blur-md border border-accent/10 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-accent/30 transition-all ${
                      isByeMatch ? "opacity-60 grayscale" : ""
                    }`}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-accent/10 pr-6">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                          Board
                        </span>
                        <span className="text-2xl font-mono font-bold text-accent">
                          {String(match.board).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 flex-1">
                        {/* Player White */}
                        <div className="flex flex-col items-end flex-1">
                          <span className="text-foreground font-bold text-lg text-right leading-tight">
                            {white.name}
                          </span>
                          <span className="font-mono text-accent text-sm">
                            {white.rating}
                          </span>
                        </div>
                        <div className="size-10 rounded bg-white text-[#0B1120] flex items-center justify-center font-black shrink-0">
                          W
                        </div>

                        <div className="text-slate-600 font-serif italic text-xl px-2">
                          vs
                        </div>

                        {/* Player Black */}
                        <div className="size-10 rounded bg-[#0B1120] border border-slate-700 text-white flex items-center justify-center font-black shrink-0">
                          B
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="text-foreground font-bold text-lg leading-tight">
                            {black.name}
                          </span>
                          <span className="font-mono text-accent text-sm">
                            {black.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arbiter Controls */}
                    {!isByeMatch ? (
                      <div
                        className={`flex gap-2 p-1 bg-black/40 rounded-lg border border-accent/10 ${isPastRound ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
                        title={
                          isPastRound
                            ? "Scores from past rounds are locked"
                            : ""
                        }
                      >
                        <button
                          disabled={isPastRound}
                          onClick={() => handleUpdateResult(match._id, "1-0")}
                          className={`px-4 py-2 rounded font-bold font-mono text-sm transition-all ${
                            match.result === "1-0"
                              ? "bg-accent text-[#0B1120] shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          1-0
                        </button>
                        <button
                          disabled={isPastRound}
                          onClick={() =>
                            handleUpdateResult(match._id, "1/2-1/2")
                          }
                          className={`px-4 py-2 rounded font-bold font-mono text-sm transition-all ${
                            match.result === "1/2-1/2"
                              ? "bg-accent text-[#0B1120] shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          ½-½
                        </button>
                        <button
                          disabled={isPastRound}
                          onClick={() => handleUpdateResult(match._id, "0-1")}
                          className={`px-4 py-2 rounded font-bold font-mono text-sm transition-all ${
                            match.result === "0-1"
                              ? "bg-accent text-[#0B1120] shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          0-1
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 p-1 px-6 bg-black/40 rounded-lg border border-accent/10 text-muted-foreground font-mono font-bold uppercase tracking-widest text-sm items-center h-[36px]">
                        BYE AWARDED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <StandingsPanel standings={standings} />
      )}
    </div>
  );
}
