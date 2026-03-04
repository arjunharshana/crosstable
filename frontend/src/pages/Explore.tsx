import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Tournament {
  _id: string;
  name: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  location: string;
  description: string;
  startDate: string;
  timeControl: string;
  formatType: string;
  format: string;
  totalRounds: number;
  participants: [];
  organizer: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real data on component mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await api.get("/tournaments");
        setTournaments(response.data);
      } catch {
        setError("Failed to load tournaments.");
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Live search filtering
  const filteredTournaments = tournaments.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.location.toLowerCase().includes(query) ||
      (t.organizer?.username || "").toLowerCase().includes(query)
    );
  });

  const featured =
    filteredTournaments.length > 0 ? filteredTournaments[0] : null;
  const gridTournaments =
    filteredTournaments.length > 1 ? filteredTournaments.slice(1) : [];

  // UI Helpers
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return (
      `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "OR"
    );
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Upcoming":
        return {
          color: "text-[#10B981]",
          bg: "bg-[#10B981]",
          border: "border-[#10B981]/20",
          pulse: true,
        };
      case "Ongoing":
        return {
          color: "text-accent",
          bg: "bg-accent",
          border: "border-accent/20",
          pulse: true,
        };
      case "Completed":
      default:
        return {
          color: "text-muted-foreground",
          bg: "bg-muted-foreground",
          border: "border-border",
          pulse: false,
        };
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
      </div>
    );

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Sticky Search & Filter Bar */}
      <div className="sticky -top-6 lg:-top-8 -mt-6 lg:-mt-8 pt-6 lg:pt-8 -mx-6 lg:-mx-8 px-6 lg:px-8 pb-3 mb-6 bg-background/80 backdrop-blur-xl z-40 border-b border-border shadow-sm flex flex-col md:flex-row items-center gap-2">
        <div className="relative flex-1 w-full max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-[18px]">
            search
          </span>
          <input
            className="w-full bg-card border border-border rounded-md py-2 pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all focus:outline-none"
            placeholder="Search tournaments, players, or organizers..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hidden md:block h-6 w-px bg-border mx-1"></div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <select className="bg-card border border-border text-sm text-muted-foreground rounded-md px-2 py-2 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none min-w-[100px]">
            <option>Format: All</option>
            <option>Classical</option>
            <option>Rapid</option>
            <option>Blitz</option>
          </select>
          <select className="bg-card border border-border text-sm text-muted-foreground rounded-md px-2 py-2 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none min-w-[100px]">
            <option>Status: All</option>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end mt-2 md:mt-0">
          <button
            className="p-2 text-muted-foreground hover:text-accent transition-colors border border-transparent hover:border-border rounded-md hidden sm:block"
            title="Advanced Filters"
          >
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
          </button>
          <button
            onClick={() => navigate("/create-tournament")}
            className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all shadow-sm w-full md:w-auto whitespace-nowrap text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Host Event</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Featured Hero Card */}
      {featured && (
        <div className="mb-12 w-full relative group">
          <div className="absolute inset-0 bg-accent/5 rounded-md blur-xl group-hover:bg-accent/10 transition-all duration-500"></div>
          <div
            className="relative bg-card border border-accent/30 rounded-md shadow-[0_0_20px_rgba(197,160,89,0.1)] overflow-hidden flex flex-col md:flex-row cursor-pointer"
            onClick={() => navigate(`/tournaments/${featured._id}`)}
          >
            <div className="md:w-2/3 p-8 flex flex-col justify-between z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-accent text-[#0B1120] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                    Featured
                  </span>
                  {(() => {
                    const styles = getStatusStyles(featured.status);
                    return (
                      <span
                        className={`px-2 py-0.5 ${styles.bg}/10 ${styles.color} border ${styles.border} text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1`}
                      >
                        {styles.pulse && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${styles.bg} animate-pulse`}
                          ></span>
                        )}
                        {featured.status}
                      </span>
                    );
                  })()}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3 leading-tight">
                  {featured.name}
                </h2>
                <p className="text-muted-foreground max-w-xl mb-6 text-sm leading-relaxed line-clamp-2">
                  {featured.description ||
                    "Join the most prestigious chess event. Compete with top players and climb the leaderboards!"}
                </p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-mono text-muted-foreground border-t border-border/50 pt-6 mt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[18px]">
                    calendar_month
                  </span>
                  <span>{formatDate(featured.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[18px]">
                    location_on
                  </span>
                  <span>{featured.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[18px]">
                    timer
                  </span>
                  <span>
                    {featured.timeControl} {featured.formatType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[18px]">
                    groups
                  </span>
                  <span className="text-foreground font-medium">
                    {featured.participants.length} Registered
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 bg-background/50 border-t md:border-t-0 md:border-l border-border/50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-center relative z-10 w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tournaments/${featured._id}`);
                  }}
                  className="w-full bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-3 px-8 rounded-md transition-all shadow-md uppercase tracking-wider text-sm flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
                >
                  View Details
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
          <span className="material-symbols-outlined text-accent">
            confirmation_number
          </span>
          Discover Tournaments
        </h3>
        <div className="text-xs font-mono text-muted-foreground">
          Showing {gridTournaments.length} additional events
        </div>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {gridTournaments.length === 0 && !featured && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-md">
            No tournaments found matching your search.
          </div>
        )}

        {gridTournaments.map((tournament) => {
          const styles = getStatusStyles(tournament.status);
          return (
            <div
              key={tournament._id}
              className="bg-card border border-border rounded-md shadow-sm hover:transition-transform hover:scale-[1.02] hover:shadow-md transition-all group flex flex-col h-full overflow-hidden cursor-pointer"
              onClick={() => navigate(`/tournaments/${tournament._id}`)}
            >
              <div className="p-6 pb-5 relative bg-background/30 border-b-2 border-dashed border-border before:absolute before:content-[''] before:h-5 before:w-5 before:bg-background before:rounded-full before:top-1/2 before:-translate-y-1/2 before:-left-2.5 before:shadow-[inset_-2px_0_3px_rgba(0,0,0,0.1)] before:z-10 after:absolute after:content-[''] after:h-5 after:w-5 after:bg-background after:rounded-full after:top-1/2 after:-translate-y-1/2 after:-right-2.5 after:shadow-[inset_2px_0_3px_rgba(0,0,0,0.1)] after:z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {styles.pulse && (
                      <span
                        className={`w-2 h-2 rounded-full ${styles.bg} animate-pulse`}
                      ></span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase ${styles.color} tracking-wider`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                  <button className="text-muted-foreground hover:text-accent transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      bookmark
                    </span>
                  </button>
                </div>

                <h4 className="text-lg font-serif font-bold text-foreground mb-1 group-hover:text-accent transition-colors truncate">
                  {tournament.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-5 truncate">
                  {tournament.location}
                </p>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-mono text-muted-foreground">
                  <div>
                    <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                      Date
                    </span>
                    <span className="text-foreground">
                      {formatDate(tournament.startDate)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                      Time Control
                    </span>
                    <span className="text-foreground">
                      {tournament.timeControl} {tournament.formatType}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                      Format
                    </span>
                    <span className="text-foreground">
                      {tournament.totalRounds}-Rd {tournament.format}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-muted-foreground/70 mb-1">
                      Players
                    </span>
                    <span className="text-foreground">
                      {tournament.participants.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
                    {getInitials(
                      tournament.organizer?.firstName,
                      tournament.organizer?.lastName,
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {tournament.organizer?.firstName || "System"}{" "}
                    {tournament.organizer?.lastName || "Admin"}
                  </span>
                </div>
                <button className="bg-transparent border border-border hover:border-accent hover:text-accent text-muted-foreground text-xs font-mono font-bold py-2 px-4 rounded-md transition-all uppercase tracking-wide">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
