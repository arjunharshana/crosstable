import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { AxiosError } from "axios";

interface PublicUser {
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  country?: string;
  title?: string;
  fideId?: string;
  isFideVerified?: boolean;
  ratings?: {
    classical: number | null;
    rapid: number | null;
    blitz: number | null;
  };
  stats?: {
    tournamentsPlayed: number;
    tournamentsWon: number;
    gamesPlayed: number;
    gamesWon: number;
  };
  createdAt: string;
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [player, setPlayer] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await api.get(`/users/${username}`);
        setPlayer(response.data);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message ||
            "Failed to fetch player profile",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchPlayer();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-center py-16 animate-in fade-in">
        <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4">
          person_off
        </span>
        <h2 className="text-2xl font-serif text-foreground mb-2">
          Player Not Found
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-accent text-[#0B1120] font-bold rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm mb-8">
        <div className="h-32 bg-gradient-to-r from-accent/20 to-card border-b border-border/50 relative">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] translate-y-8 translate-x-4">
              chess
            </span>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4 relative z-10">
            <img
              src={
                player.avatar ||
                `https://ui-avatars.com/api/?name=${player.firstName}+${player.lastName}&background=1E293B&color=C5A059&size=150`
              }
              alt={player.username}
              className="h-24 w-24 rounded-full ring-4 ring-card object-cover shadow-lg bg-background"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                {player.title && player.title.toLowerCase() !== "none" && (
                  <span className="text-accent mr-2">{player.title}</span>
                )}
                {player.firstName} {player.lastName}
              </h1>
              {player.country && (
                <span className="px-2 py-0.5 bg-background border border-border rounded text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {player.country}
                </span>
              )}
              {player.isFideVerified && (
                <span className="text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>{" "}
                  FIDE
                </span>
              )}
            </div>
            <p className="text-muted-foreground font-mono text-sm italic">
              @{player.username}
            </p>
          </div>

          {player.bio && (
            <div className="mt-6 text-sm text-foreground/80 leading-relaxed max-w-2xl border-l-2 border-accent/30 pl-4">
              {player.bio}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ratings Card */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          <h2 className="text-lg font-serif font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">
              leaderboard
            </span>
            Strength Rating
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { label: "Classical", key: "classical", icon: "hourglass_empty" },
              { label: "Rapid", key: "rapid", icon: "timer" },
              { label: "Blitz", key: "blitz", icon: "bolt" },
            ].map((r) => (
              <div
                key={r.key}
                className="flex justify-between items-center p-4 bg-background/50 rounded-md border border-border hover:border-accent/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground">
                    {r.icon}
                  </span>
                  <span className="font-semibold text-foreground">
                    {r.label}
                  </span>
                </div>
                <span className="text-xl font-mono font-bold text-accent">
                  {player.ratings?.[r.key as keyof typeof player.ratings] ||
                    "--"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Stats Card */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          <h2 className="text-lg font-serif font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">
              trophy
            </span>
            Tournament Career
          </h2>
          <div className="grid grid-cols-2 gap-4 font-mono">
            <div className="p-4 bg-background/50 rounded-md border border-border text-center">
              <span className="text-3xl font-bold text-foreground block">
                {player.stats?.tournamentsPlayed || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Played
              </span>
            </div>
            <div className="p-4 bg-background/50 rounded-md border border-border text-center">
              <span className="text-3xl font-bold text-accent block">
                {player.stats?.tournamentsWon || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Won
              </span>
            </div>
            <div className="p-4 bg-background/50 rounded-md border border-border text-center">
              <span className="text-3xl font-bold text-foreground block">
                {player.stats?.gamesPlayed || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Total Games
              </span>
            </div>
            <div className="p-4 bg-background/50 rounded-md border border-border text-center">
              <span className="text-3xl font-bold text-[#10B981] block">
                {player.stats?.gamesWon || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Wins
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Member Since
            </p>
            <p className="text-foreground text-sm font-mono">
              {new Date(player.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
