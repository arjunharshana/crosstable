import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AxiosError } from "axios";
import AddPlayerModal from "../components/AddPlayer";
import AddArbiterModal from "../components/AddArbiter";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { TournamentPanel } from "../components/TournamentPanel"; 
export interface Participant {
  _id: string;
  isGuest: boolean;
  guestName?: string;
  guestRating?: number;
  user?: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    country?: string;
    ratings?: { rapid: number; blitz: number; classical: number };
  };
  score: number;
}

export interface Tournament {
  _id: string;
  name: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  format: string;
  formatType: string;
  timeControl: string;
  totalRounds: number;
  venueType: string;
  tournamentType: string;
  location: string;
  description: string;
  startDate: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  arbiters?: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  }[];
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

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]); // NEW STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isArbiterModalOpen, setIsArbiterModalOpen] = useState(false);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: () => {},
    confirmText: "Confirm",
  });

  const { user } = useAuth();

  const isOrganizer = user?._id === tournament?.organizer._id;
 
  const isArbiter = tournament?.arbiters?.some((a) => a._id === user?._id);
  const isRegistered = tournament?.participants.some(
    (p) => p.user?._id === user?._id,
  );

  
  const currentRound =
    matches.length > 0 ? Math.max(...matches.map((m) => m.round)) : 1;

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournRes, matchRes] = await Promise.all([
          api.get(`/tournaments/${id}`),
          api.get(`/tournaments/${id}/matches`),
        ]);
        setTournament(tournRes.data);
        setMatches(matchRes.data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to fetch details.";
        console.error("Fetch Error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleStartTournament = async () => {
    try {
      await api.post(`/tournaments/${id}/start`);
      const [tournRes, matchRes] = await Promise.all([
        api.get(`/tournaments/${id}`),
        api.get(`/tournaments/${id}/matches`),
      ]);
      setTournament(tournRes.data);
      setMatches(matchRes.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(
        axiosError.response?.data?.message || "Failed to start tournament.",
      );
    }
  };

  const handleAdvanceRound = async () => {
    try {
      await api.post(`/tournaments/${id}/advance`);
      // Refresh to grab the new rounds
      const [tournRes, matchRes] = await Promise.all([
        api.get(`/tournaments/${id}`),
        api.get(`/tournaments/${id}/matches`),
      ]);
      setTournament(tournRes.data);
      setMatches(matchRes.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(
        axiosError.response?.data?.message ||
          "Failed to advance round. Check if all matches have a result!",
      );
    }
  };

  const handleJoinTournament = async () => {
    try {
      await api.post(`/tournaments/${id}/join`);
      const response = await api.get(`/tournaments/${id}`);
      setTournament(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(axiosError.response?.data?.message || "Failed to join tournament.");
    }
  };

  const handleRemovePlayer = (participantId: string) => {
    setConfirmState({
      isOpen: true,
      title: "Remove Player?",
      message: "Are you sure you want to remove this player?",
      confirmText: "Remove Player",
      action: async () => {
        try {
          await api.delete(`/tournaments/${id}/remove-player/${participantId}`);
          setTournament((prev) =>
            prev
              ? {
                  ...prev,
                  participants: prev.participants.filter(
                    (p) => p._id !== participantId,
                  ),
                }
              : prev,
          );
        } catch {
          alert("Failed to remove player.");
        }
      },
    });
  };

  const handleRemoveArbiter = (arbiterId: string) => {
    setConfirmState({
      isOpen: true,
      title: "Remove Arbiter?",
      message:
        "Are you sure you want to revoke this user's Arbiter privileges?",
      confirmText: "Remove Arbiter",
      action: async () => {
        try {
          await api.delete(`/tournaments/${id}/remove-arbiter/${arbiterId}`);
          setTournament((prev) =>
            prev
              ? {
                  ...prev,
                  arbiters: prev.arbiters?.filter((a) => a._id !== arbiterId),
                }
              : prev,
          );
        } catch {
          alert("Failed to remove arbiter.");
        }
      },
    });
  };

  const handleDeleteTournament = () => {
    setConfirmState({
      isOpen: true,
      title: "Delete Tournament?",
      message:
        "WARNING: Are you sure you want to completely delete this tournament? All pairings, matches, and data will be permanently lost.",
      confirmText: "Yes, Delete It",
      action: async () => {
        try {
          await api.delete(`/tournaments/${id}`);
          navigate("/dashboard");
        } catch {
          alert("Failed to delete tournament.");
        }
      },
    });
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
      </div>
    );

  if (error || !tournament)
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-serif text-foreground mb-4">
          Tournament Not Found
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-accent text-[#0B1120] font-bold rounded-md"
        >
          Return Home
        </button>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-background/50 via-background to-background min-h-[calc(100vh-4rem)]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-foreground">
              {tournament.name}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                tournament.status === "Upcoming"
                  ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                  : tournament.status === "Ongoing"
                    ? "bg-accent/10 text-accent border-accent/30"
                    : "bg-muted-foreground/10 text-muted-foreground border-border"
              }`}
            >
              {tournament.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            {tournament.status === "Ongoing" && (
              <>
                <div className="flex items-center gap-1.5 text-accent">
                  <span className="material-symbols-outlined text-sm">
                    flag
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Round {currentRound} of {tournament.totalRounds}
                  </span>
                </div>
                <span className="w-1 h-1 bg-border rounded-full"></span>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                calendar_month
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">
                {new Date(tournament.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">
                location_on
              </span>
              <span className="text-xs font-medium uppercase tracking-wider">
                {tournament.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOrganizer || isArbiter ? (
            <>
              {isOrganizer && (
                <>
                  <button
                    onClick={handleDeleteTournament}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all font-bold text-sm tracking-wide group"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                      delete_forever
                    </span>
                    <span className="hidden md:block">DELETE</span>
                  </button>

                  <Link
                    to={`/tournaments/${id}/edit`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-card transition-all font-bold text-sm tracking-wide"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      tune
                    </span>
                    EDIT
                  </Link>
                </>
              )}

              {tournament.status === "Upcoming" && (
                <button
                  onClick={handleStartTournament}
                  disabled={tournament.participants.length < 2}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-[#0B1120] hover:brightness-110 transition-all font-black text-sm tracking-widest shadow-[0_0_15px_rgba(197,160,89,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  START ROUND 1
                </button>
              )}

            
              {tournament.status === "Ongoing" &&
                tournament.format.includes("Knockout") && (
                  <button
                    onClick={handleAdvanceRound}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-[#0B1120] hover:brightness-110 transition-all font-black text-sm tracking-widest shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                  >
                    <span className="material-symbols-outlined">
                      keyboard_double_arrow_right
                    </span>
                    ADVANCE ROUND
                  </button>
                )}
            </>
          ) : isRegistered ? (
            <button
              disabled
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl border border-accent/30 text-accent bg-accent/5 font-black text-sm tracking-widest cursor-not-allowed opacity-80"
            >
              <span className="material-symbols-outlined">check_circle</span>
              REGISTERED
            </button>
          ) : (
            <button
              onClick={handleJoinTournament}
              disabled={tournament?.status !== "Upcoming"}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-accent text-[#0B1120] hover:brightness-110 transition-all font-black text-sm tracking-widest shadow-[0_0_15px_rgba(197,160,89,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">sports_esports</span>
              JOIN TOURNAMENT
            </button>
          )}
        </div>
      </header>

      <div className="p-6 md:p-8">
        {tournament.status === "Ongoing" && (
          <div className="mb-8">
            <h3 className="text-xl font-serif font-bold text-foreground mb-4">
              Pairings & Results
            </h3>
            <TournamentPanel
              tournament={tournament}
              matches={matches}
              setMatches={setMatches}
              currentRound={currentRound}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column Left: Tournament Overview */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all pointer-events-none"></div>

              <h3 className="text-xs font-black tracking-[0.3em] uppercase text-accent mb-6">
                Tournament Overview
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-background border border-border flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    Format
                  </span>
                  <span className="text-lg font-mono font-bold text-foreground">
                    {tournament.format}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    Time Control
                  </span>
                  <span className="text-lg font-mono font-bold text-foreground">
                    {tournament.timeControl}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    Rounds
                  </span>
                  <span className="text-lg font-mono font-bold text-foreground">
                    {tournament.totalRounds}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    Players
                  </span>
                  <span className="text-lg font-mono font-bold text-foreground">
                    {tournament.participants.length}
                  </span>
                </div>
              </div>

              {tournament.description && (
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-accent shrink-0">
                    <span className="material-symbols-outlined">
                      description
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{tournament.description}"
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-between group/row cursor-pointer hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground group-hover/row:text-accent transition-colors">
                    event_available
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover/row:text-foreground">
                    {new Date(tournament.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="material-symbols-outlined text-muted-foreground text-sm">
                  arrow_forward_ios
                </span>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground">
                  Arbiters
                </h3>
                {isOrganizer && (
                  <button
                    onClick={() => setIsArbiterModalOpen(true)}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-accent bg-accent/10 hover:bg-accent hover:text-[#0B1120] px-2 py-1.5 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      add
                    </span>
                    Add
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Chief Arbiter (Creator) */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-accent">
                      shield_person
                    </span>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold text-foreground truncate">
                      {tournament.organizer.firstName}{" "}
                      {tournament.organizer.lastName}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                      Chief Arbiter
                    </p>
                  </div>
                </div>

                {tournament.arbiters?.map((arbiter) => (
                  <div
                    key={arbiter._id}
                    className="flex items-center gap-3 border-t border-border/50 pt-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-muted-foreground">
                        gavel
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-bold text-foreground truncate">
                        {arbiter.firstName} {arbiter.lastName}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                        Deputy Arbiter
                      </p>
                    </div>
                    {isOrganizer && (
                      <button
                        onClick={() => handleRemoveArbiter(arbiter._id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        title="Remove Arbiter"
                      >
                        <span className="material-symbols-outlined text-sm">
                          person_remove
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="col-span-1 lg:col-span-8">
            <div className="bg-card border border-border rounded-2xl flex flex-col h-full overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    Participants
                  </h3>
                  <span className="text-sm font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                    {tournament.participants.length}
                  </span>
                </div>

                {(isOrganizer || isArbiter) &&
                  tournament.status === "Upcoming" && (
                    <button
                      onClick={() => setIsAddPlayerModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-[#0B1120] transition-all font-bold text-xs tracking-widest group"
                    >
                      <span className="material-symbols-outlined text-[18px] leading-none">
                        person_add
                      </span>
                      <span className="leading-none mt-[1px]">ADD PLAYER</span>
                    </button>
                  )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-background/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                        Seed
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                        Player
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase text-center">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase text-center">
                        Type
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {tournament.participants.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-muted-foreground font-mono text-sm"
                        >
                          No participants registered yet.
                        </td>
                      </tr>
                    ) : (
                      tournament.participants.map((p, index) => {
                        const formatKey =
                          tournament.formatType.toLowerCase() as
                            | "classical"
                            | "rapid"
                            | "blitz";
                        const name = p.isGuest
                          ? p.guestName
                          : `${p.user?.firstName} ${p.user?.lastName}`;
                        const rating = p.isGuest
                          ? p.guestRating || 1200
                          : p.user?.ratings?.[formatKey] || 1200;
                        const subtext = p.isGuest
                          ? "Walk-in"
                          : `@${p.user?.username}`;

                        return (
                          <tr
                            key={p._id}
                            className="hover:bg-background/50 transition-colors group/row"
                          >
                            <td className="px-6 py-4">
                              <span className="font-mono text-sm text-muted-foreground">
                                #{String(index + 1).padStart(3, "0")}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-muted-foreground text-xl">
                                    {p.isGuest ? "no_accounts" : "person"}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-foreground">
                                    {name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                                    {subtext}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-mono text-sm font-bold text-accent">
                                {rating}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter border ${
                                  p.isGuest
                                    ? "bg-background border-border text-muted-foreground"
                                    : "bg-accent/10 border-accent/20 text-accent"
                                }`}
                              >
                                {p.isGuest ? "Guest" : "User"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {/* Only allow removing players before the tournament starts */}
                              {(isOrganizer || isArbiter) &&
                                tournament.status === "Upcoming" && (
                                  <button
                                    onClick={() => handleRemovePlayer(p._id)}
                                    className="p-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-all focus:opacity-100"
                                    title="Remove Player"
                                  >
                                    <span className="material-symbols-outlined text-lg">
                                      delete
                                    </span>
                                  </button>
                                )}
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
        </div>
      </div>

      {/* Modals */}
      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        tournamentId={tournament._id}
        onSuccess={() => {
          api.get(`/tournaments/${id}`).then((res) => setTournament(res.data));
        }}
      />
      <AddArbiterModal
        isOpen={isArbiterModalOpen}
        onClose={() => setIsArbiterModalOpen(false)}
        tournamentId={tournament._id}
        onSuccess={() => {
          api.get(`/tournaments/${id}`).then((res) => setTournament(res.data));
        }}
      />

      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.action}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        isDestructive={true}
      />
    </div>
  );
}
