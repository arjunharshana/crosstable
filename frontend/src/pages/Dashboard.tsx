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
        const response = await api.get("/activity/feed");
        setActivities(response.data);
      } catch (err) {
        console.error("Failed to fetch activity feed", err);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchTournaments();
    fetchActivities();
  }, []);

  // --- HELPER LOGIC ---
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

  const myPlaying = tournaments
    .filter((t) => isPlayer(t) && t.status !== "Completed")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground">
          Welcome back,{" "}
          <span className="text-accent font-semibold">
            {user?.firstName || "Player"}
          </span>
        </h1>
        <Link to="/create-tournament">
          <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-all group shadow-sm">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
              add
            </span>
            Create New Tournament
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-md shadow-sm relative overflow-hidden group">
          <span className="material-symbols-outlined absolute top-4 right-4 text-6xl text-accent opacity-10">
            trophy
          </span>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Active (Hosting)
          </h3>
          <span className="text-4xl font-bold font-mono">
            {loadingTournaments
              ? "--"
              : myOrganizing.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="bg-card border border-border p-6 rounded-md shadow-sm relative overflow-hidden group">
          <span className="material-symbols-outlined absolute top-4 right-4 text-6xl text-accent opacity-10">
            swords
          </span>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            Upcoming (Playing)
          </h3>
          <span className="text-4xl font-bold font-mono">
            {loadingTournaments
              ? "--"
              : myPlaying.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="bg-card border border-border p-6 rounded-md shadow-sm relative overflow-hidden group">
          <span className="material-symbols-outlined absolute top-4 right-4 text-6xl text-accent opacity-10">
            trending_up
          </span>
          <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
            My Rating
          </h3>
          {/* FIXED: No 'as any' needed if interface is updated */}
          <span className="text-4xl font-bold text-accent font-mono">
            {user?.rating || "--"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Organizing Table */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-sm">
                  grid_view
                </span>{" "}
                Organizing
              </h2>
              <Link
                to="/tournaments"
                className="text-xs text-accent font-bold uppercase"
              >
                View All
              </Link>
            </div>
            <div className="bg-card border border-border rounded-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-background/50 border-b border-border text-xs uppercase text-muted-foreground font-mono">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Tournament</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Players</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {loadingTournaments ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin inline-block"></span>
                      </td>
                    </tr>
                  ) : myOrganizing.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No active tournaments.
                      </td>
                    </tr>
                  ) : (
                    myOrganizing.map((t) => (
                      <tr
                        key={t._id}
                        onClick={() => navigate(`/tournaments/${t._id}`)}
                        className="hover:bg-background/80 cursor-pointer group transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${t.status === "Ongoing" ? "bg-[#10B981] animate-pulse" : "bg-accent"}`}
                            ></span>
                            <span
                              className={`text-xs font-bold uppercase ${t.status === "Ongoing" ? "text-[#10B981]" : "text-accent"}`}
                            >
                              {t.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium group-hover:text-accent transition-colors">
                            {t.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t.location || "Online"}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-muted-foreground">
                          {new Date(t.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right font-mono">
                          {t.participants?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100">
                            arrow_forward
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-sm">
                history
              </span>{" "}
              Recent Activity
            </h2>
            <div className="bg-card border border-border rounded-md p-6 min-h-[200px]">
              {loadingActivities ? (
                <div className="flex justify-center items-center h-32">
                  <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                  No recent activity.
                </div>
              ) : (
                <ul className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <li key={activity._id} className="relative pl-8 group">
                      <div className="absolute left-[11px] top-6 bottom-[-16px] w-px bg-border group-last:hidden"></div>
                      <div
                        className={`absolute left-2 top-2 h-2.5 w-2.5 rounded-full ring-4 ring-card ${getActivityColor(activity.type)}`}
                      ></div>
                      <div className="bg-background/20 hover:bg-background/40 border border-transparent hover:border-border p-4 rounded-xl transition-all">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">
                          {formatTimeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-lg font-serif font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-sm">
              sports_esports
            </span>{" "}
            My Upcoming
          </h2>
          {myPlaying.length > 0 ? (
            <div className="bg-card border border-border p-5 rounded-md relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-accent uppercase font-bold tracking-widest">
                    {myPlaying[0].name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tournament Status: {myPlaying[0].status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/tournaments/${myPlaying[0]._id}`)}
                className="w-full bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 rounded-md text-xs uppercase tracking-wider"
              >
                Go to Tournament
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border p-8 rounded-md text-center text-muted-foreground">
              No upcoming events.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
