import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

interface ActivityRecord {
  _id: string;
  type: string;
  message: string;
  user?: { _id: string; username: string; firstName: string; lastName: string };
  tournament?: { _id: string; name: string };
  createdAt: string;
}

interface Participant {
  user?: { _id: string; username?: string } | string;
  isGuest: boolean;
  guestName?: string;
  score?: number;
}

interface Tournament {
  _id: string;
  name: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  location: string;
  startDate: string;
  participants: Participant[];
  organizer:
    | { _id: string; username: string; firstName: string; lastName: string }
    | string;
  arbiters?:
    | { _id: string; username: string; firstName: string; lastName: string }[]
    | string[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const currentUserId = user?._id;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get("/tournaments");
        setTournaments(response.data);
      } catch (err) {
        console.error("Failed to load tournaments", err);
      } finally {
        setLoadingTournaments(false);
      }
    };

    const fetchActivities = async () => {
      try {
        console.log("Fetching activity feed...");
        const response = await api.get("/activity/feed");
        setActivities(response.data);
        console.log("Activity feed loaded:", response.data);
      } catch (err) {
        console.error("Failed to fetch activity feed", err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchTournaments();
    fetchActivities();
  }, []);

  const isOrganizer = (t: Tournament) => {
    if (t.organizer) {
      const orgId =
        typeof t.organizer === "string" ? t.organizer : t.organizer._id;
      if (orgId === currentUserId) return true;
    }

    if (t.arbiters && t.arbiters.length > 0) {
      return t.arbiters.some((arbiter) => {
        const arbId = typeof arbiter === "string" ? arbiter : arbiter._id;
        return arbId === currentUserId;
      });
    }

    return false;
  };

  const isPlayer = (t: Tournament) => {
    if (!t.participants) return false;
    return t.participants.some((p) => {
      if (!p.user) return false;
      const playerId = typeof p.user === "string" ? p.user : p.user._id;
      return playerId === currentUserId;
    });
  };

  const myOrganizing = tournaments.filter(
    (t) => isOrganizer(t) && t.status !== "Completed",
  );

  // Sort playing tournaments by date so the most immediate one is first
  const myPlaying = tournaments
    .filter((t) => isPlayer(t) && t.status !== "Completed")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";

    const diffInSeconds = Math.floor(
      (new Date().getTime() - date.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "TOURNAMENT_CREATED":
        return "bg-accent";
      case "PLAYER_JOINED":
        return "bg-[#10B981]";
      case "ROLE_UPDATE":
        return "bg-blue-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Welcome back */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            Welcome back,{" "}
            <span className="text-accent font-semibold">
              {user?.firstName || "Blunder Master"}
            </span>
          </h1>
        </div>
        <Link
          to="/create-tournament"
          className="text-s uppercase tracking-wider"
        >
          <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] group whitespace-nowrap transform hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-300">
              add
            </span>
            Create New Tournament
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-accent">
              trophy
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Active Tournaments (Hosting)
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-foreground font-mono">
              {loadingTournaments
                ? "--"
                : myOrganizing.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-accent">
              swords
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Upcoming Matches (Playing)
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-foreground font-mono">
              {loadingTournaments
                ? "--"
                : myPlaying.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-accent">
              trending_up
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            My Elo (FIDE)
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-accent font-mono">
              Unrated
            </span>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Tournaments Table */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-sm">
                  grid_view
                </span>
                Organizing
              </h2>
              <Link
                to="/tournaments"
                className="text-xs text-accent hover:text-foreground transition-colors uppercase tracking-wider font-bold"
              >
                View All
              </Link>
            </div>

            <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-background/50 border-b border-border text-xs uppercase text-muted-foreground font-mono">
                    <tr>
                      <th className="px-6 py-4 font-medium tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 font-medium tracking-wider">
                        Tournament Name
                      </th>
                      <th className="px-6 py-4 font-medium tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 font-medium tracking-wider text-right">
                        Players
                      </th>
                      <th className="px-6 py-4 font-medium tracking-wider text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-sm">
                    {loadingTournaments ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin inline-block"></span>
                        </td>
                      </tr>
                    ) : myOrganizing.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          You are not organizing any active tournaments.
                        </td>
                      </tr>
                    ) : (
                      myOrganizing.slice(0, 4).map((t) => {
                        // Check if the tournament date is in the past
                        const isPast =
                          new Date(t.startDate).getTime() <
                          new Date().getTime();

                        return (
                          <tr
                            key={t._id}
                            onClick={() => navigate(`/tournaments/${t._id}`)}
                            className="hover:bg-background/80 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {t.status === "Ongoing" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
                                    <span className="text-[#10B981] text-xs font-bold uppercase">
                                      Live
                                    </span>
                                  </>
                                ) : isPast ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                                    <span className="text-amber-500 text-xs font-bold uppercase">
                                      Overdue
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-accent"></span>
                                    <span className="text-accent text-xs font-bold uppercase">
                                      Upcoming
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-foreground group-hover:text-accent transition-colors">
                                {t.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {t.location || "Online"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">
                              {new Date(t.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-foreground font-mono">
                              {t.participants?.length || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <span className="material-symbols-outlined text-lg">
                                  arrow_forward
                                </span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-sm">
                  history
                </span>
                Recent Activity
              </h2>
            </div>
            <div className="bg-card border border-border rounded-md p-6 shadow-sm min-h-[200px]">
              {loadingActivities ? (
                <div className="flex justify-center items-center h-32">
                  <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                  <span className="material-symbols-outlined text-3xl mb-2 opacity-50">
                    history_toggle_off
                  </span>
                  <p className="text-sm">No recent activity to show.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {/* Upgraded Interactive Timeline */}
                  {activities.map((activity) => {
                    return (
                      <li
                        key={activity._id}
                        className="relative pl-8 pb-2 group last:pb-0"
                      >
                        <div className="absolute left-[11px] top-6 bottom-[-8px] w-px bg-border group-last:hidden"></div>
                        <div
                          className={`absolute left-2 top-5 h-2.5 w-2.5 rounded-full ring-4 ring-card ${getActivityColor(
                            activity.type,
                          )} transition-transform duration-300 group-hover:scale-150 z-10`}
                        ></div>

                        <div className="bg-background/20 hover:bg-card border border-transparent hover:border-border/60 p-4 rounded-xl transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex flex-col gap-1.5 cursor-default relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                          <p className="text-sm text-muted-foreground relative z-10">
                            <span className="group-hover:text-foreground transition-colors duration-300">
                              {activity.message}
                            </span>
                          </p>

                          {/* Timestamp with icon */}
                          <div className="flex items-center gap-1.5 relative z-10 mt-1">
                            <span className="material-symbols-outlined text-[14px] text-accent/70">
                              schedule
                            </span>
                            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                              {formatTimeAgo(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* upcoming matches */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-sm">
                sports_esports
              </span>
              My Upcoming Matches
            </h2>
          </div>

          {myPlaying.length > 0 ? (
            <div className="bg-card border border-border p-5 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative group hover:border-accent/50 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-[10px] text-accent uppercase font-bold tracking-widest mb-1 truncate max-w-[150px]">
                    {myPlaying[0].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(myPlaying[0].startDate).getTime() <
                    new Date().getTime()
                      ? "Start delayed by organizer..."
                      : "Waiting for pairings..."}
                  </p>
                </div>
                <div
                  className={`bg-background px-2 py-1 rounded text-[10px] font-mono border border-border flex items-center gap-1 shadow-sm ${new Date(myPlaying[0].startDate).getTime() < new Date().getTime() ? "text-amber-500" : "text-[#10B981]"}`}
                >
                  {new Date(myPlaying[0].startDate).getTime() <
                  new Date().getTime()
                    ? "OVERDUE"
                    : "PENDING"}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 relative z-10 bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="text-center w-full">
                  <span className="text-xs text-muted-foreground font-mono block mb-1">
                    The pairing engine has not started Round 1 yet.
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/tournaments/${myPlaying[0]._id}`)}
                className="w-full bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 rounded-md text-xs transition-colors shadow-[0_0_10px_rgba(197,160,89,0.2)] uppercase tracking-wider relative z-10 transform hover:-translate-y-0.5"
              >
                Go to Tournament
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border p-8 rounded-md text-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl mb-2 opacity-50">
                event_busy
              </span>
              <p className="text-sm">No upcoming matches scheduled.</p>
            </div>
          )}

          {/* future feature */}
          <div className="bg-card border border-border p-5 rounded-md relative opacity-80 hover:opacity-100 transition-opacity mt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">
                  Titled Tuesday
                </p>
                <p className="text-xs text-muted-foreground">Swiss Round 1</p>
              </div>
              <div className="bg-background px-2 py-1 rounded text-[10px] font-mono text-muted-foreground border border-border">
                TOMORROW
              </div>
            </div>
            <div className="flex items-center justify-between bg-background/30 rounded p-2 border border-border/30">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border">
                  You
                </div>
                <div className="text-xs text-muted-foreground">
                  vs. <span className="text-foreground font-bold">TBD</span>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-card px-2 py-0.5 rounded border border-border/50">
                3+0 Blitz
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
