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
    classical: number;
    rapid: number;
    blitz: number;
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
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
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
        <div className="h-32 bg-gradient-to-r from-background to-card border-b border-border/50 relative">
          {/* Decorative Background Element */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] translate-y-8 translate-x-4">
              chess
            </span>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          {/* Avatar floating over banner */}
          <div className="flex justify-between items-end -mt-12 mb-4 relative z-10">
            <img
              src={`https://ui-avatars.com/api/?name=${player.firstName}+${player.lastName}&background=1E293B&color=C5A059&size=150`}
              alt={player.username}
              className="h-24 w-24 rounded-full ring-4 ring-card object-cover shadow-lg bg-background"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                {player.title && player.title !== "none" && (
                  <span className="text-accent mr-2">{player.title}</span>
                )}
                {player.firstName} {player.lastName}
              </h1>
              {player.country && (
                <span className="px-2 py-0.5 bg-background border border-border rounded text-xs font-mono text-muted-foreground uppercase">
                  {player.country}
                </span>
              )}
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              @{player.username}
            </p>
          </div>

          {player.bio && (
            <div className="mt-6 text-sm text-foreground/80 leading-relaxed max-w-2xl border-l-2 border-accent/50 pl-4">
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
            Current Ratings
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 bg-background rounded-md border border-border">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground">
                  hourglass_empty
                </span>
                <span className="font-semibold text-foreground">Classical</span>
              </div>
              <span className="text-xl font-mono text-accent">
                {player.ratings?.classical || 1200}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background rounded-md border border-border">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground">
                  timer
                </span>
                <span className="font-semibold text-foreground">Rapid</span>
              </div>
              <span className="text-xl font-mono text-accent">
                {player.ratings?.rapid || 1200}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background rounded-md border border-border">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground">
                  bolt
                </span>
                <span className="font-semibold text-foreground">Blitz</span>
              </div>
              <span className="text-xl font-mono text-accent">
                {player.ratings?.blitz || 1200}
              </span>
            </div>
          </div>
        </div>

        {/* Tournament Stats Card */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          <h2 className="text-lg font-serif font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent">
              trophy
            </span>
            Tournament Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-md border border-border flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-mono text-foreground mb-1">
                {player.stats?.tournamentsPlayed || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Events Played
              </span>
            </div>
            <div className="p-4 bg-background rounded-md border border-border flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-mono text-accent mb-1">
                {player.stats?.tournamentsWon || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Events Won
              </span>
            </div>
            <div className="p-4 bg-background rounded-md border border-border flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-mono text-foreground mb-1">
                {player.stats?.gamesPlayed || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Total Games
              </span>
            </div>
            <div className="p-4 bg-background rounded-md border border-border flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-mono text-[#10B981] mb-1">
                {player.stats?.gamesWon || 0}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Games Won
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
