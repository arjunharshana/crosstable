import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
interface UserProfile {
  firstName: string;
  lastName: string;
  country: string;
  avatar?: string;
  isVerified?: boolean;
  isFideVerified?: boolean;
  title?: string;
  createdAt: string;
  ratings: {
    classical: number;
    rapid: number;
    blitz: number;
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

const placeholderTrophies = [
  {
    id: 1,
    title: "Champions Chess Tour Finals",
    location: "Toronto, Canada",
    placement: "1st Place",
    desc: "Dominating performance in the finals securing the title with a round to spare. Defeated 3 GMs in the knockout stage.",
    date: "Dec 2023",
    prize: "$200,000",
    icon: "trophy",
    colorTheme:
      "text-accent border-accent shadow-[0_0_15px_rgba(197,160,89,0.15)]",
    badgeTheme: "text-accent border-accent/20 bg-accent/5",
  },
];

// Placeholder SVG paths for the rating charts
const ratingChartPaths = {
  classical: "M0,35 Q10,32 20,28 T40,25 T60,15 T80,10 T100,5",
  rapid: "M0,20 Q10,18 20,22 T40,25 T60,30 T80,28 T100,35",
  blitz: "M0,30 Q10,32 20,20 T40,15 T60,25 T80,10 T100,2",
};

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

  // Calculate dynamic stats from backend data
  const totalGames = profile.stats.gamesPlayed || 0;
  const winRate =
    totalGames > 0
      ? Math.round((profile.stats.gamesWon / totalGames) * 100)
      : 0;

  // Bar Chart Widths
  const winWidth =
    totalGames > 0 ? `${(profile.stats.gamesWon / totalGames) * 100}%` : "0%";
  const drawWidth =
    totalGames > 0 ? `${(profile.stats.gamesDrawn / totalGames) * 100}%` : "0%";
  const lossWidth =
    totalGames > 0 ? `${(profile.stats.gamesLost / totalGames) * 100}%` : "0%";

  return (
    <div className="animate-in fade-in duration-500 pb-12 -mt-6 lg:-mt-8 -mx-6 lg:-mx-8">
      {/* Hero Banner Area */}
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
                {profile.country}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* Dynamic Tags based on Backend Schema (Role tag removed) */}
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
        {/* Dynamic Ratings Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              id: "classical",
              label: "Classical",
              rating: profile.ratings.classical,
            },
            { id: "rapid", label: "Rapid", rating: profile.ratings.rapid },
            { id: "blitz", label: "Blitz", rating: profile.ratings.blitz },
          ].map((stat) => {
            const svgThemeColor = "text-accent";

            return (
              <div
                key={stat.id}
                className="bg-card border border-border p-5 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative group hover:border-accent/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-mono font-bold text-foreground mt-1">
                      {stat.rating}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-md border bg-muted/10 text-muted-foreground border-muted/20">
                    --
                  </span>
                </div>

                <div className={`h-16 w-full relative ${svgThemeColor}`}>
                  <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 40"
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${stat.id}`}
                        x1="0%"
                        x2="0%"
                        y1="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="currentColor"
                          stopOpacity="0.2"
                        ></stop>
                        <stop
                          offset="100%"
                          stopColor="currentColor"
                          stopOpacity="0"
                        ></stop>
                      </linearGradient>
                    </defs>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={
                        ratingChartPaths[
                          stat.id as keyof typeof ratingChartPaths
                        ]
                      }
                    ></path>
                    <path
                      fill={`url(#gradient-${stat.id})`}
                      stroke="none"
                      d={`${ratingChartPaths[stat.id as keyof typeof ratingChartPaths]} V40 H0 Z`}
                    ></path>
                    <circle
                      className="animate-pulse"
                      cx="100"
                      cy={
                        ratingChartPaths[
                          stat.id as keyof typeof ratingChartPaths
                        ]
                          .split(",")
                          .pop()
                          ?.split(" ")[0]
                      }
                      fill="currentColor"
                      r="3"
                    ></circle>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-xl">
                  emoji_events
                </span>
                Trophy Room
              </h2>
            </div>

            {/* Placeholder Trophies */}
            <div className="relative pl-4 mt-2">
              <div className="absolute left-[27px] top-4 bottom-0 w-px bg-border"></div>

              {placeholderTrophies.map((trophy) => (
                <div key={trophy.id} className="relative flex gap-6 mb-8 group">
                  <div
                    className={`relative z-10 shrink-0 h-12 w-12 rounded-full bg-card border flex items-center justify-center transition-colors ${trophy.colorTheme}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {trophy.icon}
                    </span>
                  </div>

                  <div className="flex-1 bg-card/50 border border-border hover:border-accent/50 rounded-md p-5 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div>
                        <h3 className="text-foreground font-bold text-base md:text-lg font-serif">
                          {trophy.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {trophy.location}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[10px] uppercase font-bold border px-2 py-1 rounded-sm whitespace-nowrap ${trophy.badgeTheme}`}
                      >
                        {trophy.placement}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {trophy.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Dynamic Performance Record */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[20px]">
                  query_stats
                </span>
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

                <div className="flex h-3 rounded-sm overflow-hidden mb-4 w-full shadow-inner">
                  <div
                    className="bg-emerald-500 hover:brightness-125 transition-all"
                    style={{ width: winWidth }}
                    title={`Won: ${profile.stats.gamesWon}`}
                  ></div>
                  <div
                    className="bg-muted-foreground/50 hover:brightness-125 transition-all"
                    style={{ width: drawWidth }}
                    title={`Drawn: ${profile.stats.gamesDrawn}`}
                  ></div>
                  <div
                    className="bg-red-500 hover:brightness-125 transition-all"
                    style={{ width: lossWidth }}
                    title={`Lost: ${profile.stats.gamesLost}`}
                  ></div>
                </div>

                <div className="flex justify-between text-xs font-mono font-bold text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>{" "}
                    {profile.stats.gamesWon} W
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>{" "}
                    {profile.stats.gamesDrawn} D
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>{" "}
                    {profile.stats.gamesLost} L
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-5 border-t border-border/60">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Tourneys Won
                    </p>
                    <p className="font-mono font-bold text-foreground text-lg">
                      {profile.stats.tournamentsWon}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Joined
                    </p>
                    <p className="font-mono font-bold text-foreground text-lg">
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
