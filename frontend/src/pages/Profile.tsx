import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  country: string;
  avatar?: string;
  isVerified?: boolean;
  isFideVerified?: boolean;
  title?: string;
  createdAt: string;
  ratings: {
    classical: number | null;
    rapid: number | null;
    blitz: number | null;
  };
  stats: {
    tournamentsPlayed: number;
    tournamentsWon: number;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
  };
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-32 text-muted-foreground">
        <span className="material-symbols-outlined text-4xl mb-4">error</span>
        <p>Failed to load profile. Please try logging in again.</p>
      </div>
    );
  }

  const totalGames = profile.stats.gamesPlayed || 0;
  const winRate =
    totalGames > 0
      ? Math.round((profile.stats.gamesWon / totalGames) * 100)
      : 0;

  const winWidth =
    totalGames > 0 ? `${(profile.stats.gamesWon / totalGames) * 100}%` : "0%";
  const drawWidth =
    totalGames > 0 ? `${(profile.stats.gamesDrawn / totalGames) * 100}%` : "0%";
  const lossWidth =
    totalGames > 0 ? `${(profile.stats.gamesLost / totalGames) * 100}%` : "0%";

  return (
    <div className="animate-in fade-in duration-500 pb-12 -mt-6 lg:-mt-8 -mx-6 lg:-mx-8">
      {/* Hero Banner */}
      <header className="h-56 bg-gradient-to-b from-accent/10 to-background relative z-10 flex flex-col justify-end px-8 pb-8 border-b border-border">
        <div className="absolute top-6 right-8 flex gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="px-4 py-2 bg-card/50 hover:bg-card border border-border rounded-md text-sm text-foreground flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 relative">
          <div className="relative shrink-0">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-full p-1 bg-gradient-to-tr from-accent to-card shadow-lg z-20">
              <img
                alt={`${profile.firstName} ${profile.lastName}`}
                className="h-full w-full rounded-full object-cover border-4 border-background bg-background"
                src={
                  profile.avatar ||
                  `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=1E293B&color=C5A059`
                }
              />
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full border border-border shadow-sm z-30">
                <span
                  className="material-symbols-outlined text-accent text-2xl"
                  title="Verified Account"
                >
                  verified
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 mb-1 relative z-20">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
              {profile.firstName} {profile.lastName}
              <span className="text-sm font-sans font-normal text-muted-foreground px-2 py-0.5 rounded-md border border-border/50 bg-background/30 shadow-inner">
                {profile.country || "Global"}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {profile.isFideVerified && (
                <span className="text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>{" "}
                  FIDE Verified
                </span>
              )}
              {profile.title && profile.title !== "None" && (
                <span className="text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[14px]">
                    military_tech
                  </span>{" "}
                  {profile.title} Title
                </span>
              )}
            </div>
          </div>

          <div className="text-right hidden md:block mb-1 relative z-20">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Total Tournaments
            </p>
            <p className="text-5xl font-mono font-bold text-foreground drop-shadow-md">
              {profile.stats.tournamentsPlayed}
            </p>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              id: "classical",
              label: "Classical",
              rating: profile.ratings.classical,
            },
            { id: "rapid", label: "Rapid", rating: profile.ratings.rapid },
            { id: "blitz", label: "Blitz", rating: profile.ratings.blitz },
          ].map((stat) => (
            <div
              key={stat.id}
              className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative group hover:border-accent/30 transition-colors"
            >
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-mono font-bold text-foreground">
                  {stat.rating && stat.rating > 0 ? stat.rating : "--"}
                </p>
                <span className="text-[10px] text-accent font-bold uppercase tracking-tighter">
                  Elo
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full bg-accent/20 w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">
                emoji_events
              </span>{" "}
              Trophy Room
            </h2>
            {profile.stats.tournamentsWon === 0 ? (
              <div className="bg-card/30 border border-dashed border-border rounded-md p-12 text-center text-muted-foreground">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">
                  workspace_premium
                </span>
                <p className="text-sm">
                  No tournament trophies collected yet. Join a tournament to
                  start your collection!
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Connect your FIDE or Chess.com ID to sync tournament history.
              </p>
            )}
          </div>

          {/* Performance Overview */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[20px]">
                  query_stats
                </span>{" "}
                Performance Overview
              </h2>
              <div className="bg-card border border-border p-6 rounded-md shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-4xl font-mono font-bold text-foreground">
                      {totalGames}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-2 font-bold">
                      Total Games
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-accent font-mono font-bold text-xl">
                      {winRate}%
                    </span>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider mt-0.5">
                      Win Rate
                    </span>
                  </div>
                </div>

                <div className="flex h-3 rounded-sm overflow-hidden mb-4 w-full shadow-inner bg-background">
                  {totalGames > 0 ? (
                    <>
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: winWidth }}
                      />
                      <div
                        className="bg-muted-foreground/50 transition-all"
                        style={{ width: drawWidth }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: lossWidth }}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-muted/20" />
                  )}
                </div>

                <div className="flex justify-between text-xs font-mono font-bold text-muted-foreground mb-6">
                  <span>{profile.stats.gamesWon} W</span>
                  <span>{profile.stats.gamesDrawn} D</span>
                  <span>{profile.stats.gamesLost} L</span>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-5 border-t border-border/60 font-mono">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Won
                    </p>
                    <p className="text-foreground text-lg">
                      {profile.stats.tournamentsWon}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Joined
                    </p>
                    <p className="text-foreground text-lg">
                      {new Date(profile.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
