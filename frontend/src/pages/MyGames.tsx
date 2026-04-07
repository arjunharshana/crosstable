import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export interface PlayerDetails {
  _id: string;
  name: string;
  rating: number | string;
  title?: string;
}

export interface MatchResponse {
  _id: string;
  tournament: string;
  round: number;
  board: number;
  whitePlayer: PlayerDetails;
  blackPlayer: PlayerDetails | null;
  result: "1-0" | "0-1" | "1/2-1/2" | "*" | "BYE";
  pgn: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormattedGame {
  id: string;
  outcome: "win" | "loss" | "draw" | "ongoing";
  resultText: string;
  resultBg: string;
  resultColor: string;
  resultBorder: string;
  resultShadow: string;
  playerColor: "White" | "Black";
  playerIconBg: string;
  playerIconBorder: string;
  oppInitials: string;
  oppBg: string;
  oppName: string;
  oppTitle: string;
  oppRating: number | string;
  timeAgo: string;
}

const formatGameData = (
  rawGame: MatchResponse,
  currentUserId: string,
): FormattedGame => {
  const isWhite = rawGame.whitePlayer._id === currentUserId;
  const playerColor = isWhite ? "White" : "Black";
  const opponent = isWhite ? rawGame.blackPlayer : rawGame.whitePlayer;

  let outcome: "win" | "loss" | "draw" | "ongoing" = "ongoing";
  let displayResult = rawGame.result;

  if (rawGame.result === "1-0") outcome = isWhite ? "win" : "loss";
  else if (rawGame.result === "0-1") outcome = isWhite ? "loss" : "win";
  else if (rawGame.result === "1/2-1/2") {
    outcome = "draw";
    displayResult = "1/2-1/2";
  } else if (rawGame.result === "BYE") outcome = "win";
  else if (rawGame.result === "*") displayResult = "*";

  const styles = {
    win: {
      bg: "bg-[#10B981]/10",
      color: "text-[#10B981]",
      border: "border-[#10B981]/20",
      shadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    },
    loss: {
      bg: "bg-[#EF4444]/10",
      color: "text-[#EF4444]",
      border: "border-[#EF4444]/20",
      shadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    },
    draw: {
      bg: "bg-muted/10",
      color: "text-muted-foreground",
      border: "border-muted/20",
      shadow: "",
    },
    ongoing: {
      bg: "bg-accent/10",
      color: "text-accent",
      border: "border-accent/20",
      shadow: "shadow-[0_0_10px_rgba(197,160,89,0.1)]",
    },
  };

  const currentStyle = styles[outcome];
  const isBye = rawGame.result === "BYE" || !opponent;

  return {
    id: rawGame._id,
    outcome,
    resultText: displayResult,
    resultBg: currentStyle.bg,
    resultColor: currentStyle.color,
    resultBorder: currentStyle.border,
    resultShadow: currentStyle.shadow,
    playerColor,
    playerIconBg: isWhite ? "bg-white" : "bg-background",
    playerIconBorder: isWhite ? "border-slate-300" : "border-border",
    oppInitials: isBye
      ? "--"
      : opponent?.name?.substring(0, 2).toUpperCase() || "?",
    oppBg: isBye
      ? "bg-muted text-muted-foreground border-border"
      : "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500/30",
    oppName: isBye ? "Tournament BYE" : opponent?.name || "Unknown Player",
    oppTitle: opponent?.title || "",
    oppRating: opponent?.rating || "UNR",
    timeAgo: new Date(rawGame.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  };
};

export default function MyGames() {
  const [games, setGames] = useState<FormattedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const currentUserId = user?._id || "";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const baseUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${baseUrl}/matches/my-games`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch games");
        const rawData: MatchResponse[] = await response.json();
        setGames(rawData.map((game) => formatGameData(game, currentUserId)));
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) fetchGames();
    else setIsLoading(false);
  }, [currentUserId]);

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground tracking-tight">
            My Games
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-500" : "bg-[#10B981]"} animate-pulse`}
            />
            {isLoading ? "SYNCING..." : "SYNCED: JUST NOW"}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Performance Card */}
        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-accent">
              pie_chart
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">
            Performance Breakdown
          </h3>
          {(() => {
            const completed = games.filter((g) => g.outcome !== "ongoing");
            const total = completed.length;
            const wins = completed.filter((g) => g.outcome === "win").length;
            const losses = completed.filter((g) => g.outcome === "loss").length;
            const draws = completed.filter((g) => g.outcome === "draw").length;
            const winPct = total > 0 ? (wins / total) * 100 : 0;
            const lossPct = total > 0 ? (losses / total) * 100 : 0;
            const drawPct = total > 0 ? (draws / total) * 100 : 0;

            return (
              <>
                <div className="flex justify-between items-end w-full mb-5 relative z-10 font-mono">
                  <div className="flex flex-col">
                    <span
                      className={`text-3xl font-bold ${wins > 0 ? "text-[#10B981]" : "text-muted-foreground"}`}
                    >
                      {wins}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      Wins
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-3xl font-bold ${losses > 0 ? "text-[#EF4444]" : "text-muted-foreground"}`}
                    >
                      {losses}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      Losses
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-3xl font-bold ${draws > 0 ? "text-[#94A3B8]" : "text-muted-foreground"}`}
                    >
                      {draws}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      Draws
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden flex gap-0.5 mt-2 relative z-10">
                  {total === 0 ? (
                    <div className="w-full h-full bg-muted/20" />
                  ) : (
                    <>
                      <div
                        style={{ width: `${winPct}%` }}
                        className="h-full bg-[#10B981]"
                      />
                      <div
                        style={{ width: `${lossPct}%` }}
                        className="h-full bg-[#EF4444]"
                      />
                      <div
                        style={{ width: `${drawPct}%` }}
                        className="h-full bg-[#94A3B8]"
                      />
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </div>

        {/* Rating Card */}
        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-accent">
              trending_up
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Current Rating
          </h3>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl font-bold text-foreground font-mono">
              {/* Type-safe access after updating the User interface */}
              {user?.rating || "--"}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                Official Strength
              </span>
              <span className="text-xs text-accent">Verified Profile</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-background/50 border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">
              history_edu
            </span>{" "}
            Match Ledger
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {games.length} Games
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-background/30 font-semibold">
                <th className="px-8 py-5 text-center w-24">Res</th>
                <th className="px-8 py-5 w-32">Color</th>
                <th className="px-8 py-5 w-full">Opponent</th>
                <th className="px-8 py-5 text-center w-32">Rating</th>
                <th className="px-8 py-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground font-mono"
                  >
                    Loading matches...
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No matches found.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-background/40 transition-all border-b border-border/50 group"
                  >
                    <td className="px-8 py-5 text-center">
                      <div
                        className={`inline-flex w-12 h-9 rounded ${game.resultBg} border ${game.resultBorder} items-center justify-center ${game.resultColor} font-mono font-bold text-sm`}
                      >
                        {game.resultText}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${game.playerIconBg} border-2 ${game.playerIconBorder}`}
                        />
                        <span className="font-medium">{game.playerColor}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded ${game.oppBg} flex items-center justify-center text-xs font-bold border`}
                        >
                          {game.oppInitials}
                        </div>
                        <div>
                          <span className="font-mono text-base block group-hover:text-accent transition-colors">
                            {game.oppName}
                          </span>
                          {game.oppTitle && (
                            <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-bold">
                              {game.oppTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-mono">
                      {game.oppRating}
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-muted-foreground">
                      {game.timeAgo}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
