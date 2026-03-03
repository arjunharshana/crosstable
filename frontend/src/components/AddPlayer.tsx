import { useState, useEffect } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  onSuccess: () => void;
}

interface UserSearchResult {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export default function AddPlayerModal({
  isOpen,
  onClose,
  tournamentId,
  onSuccess,
}: AddPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<"registered" | "guest">(
    "registered",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestRating, setGuestRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (!searchQuery.trim() || activeTab !== "registered" || selectedUserId) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/users/search?q=${searchQuery}`);
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab, selectedUserId]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "guest") {
        if (!guestName.trim()) throw new Error("Guest name is required");

        await api.post(`/tournaments/${tournamentId}/add-player`, {
          isGuest: true,
          guestName: guestName.trim(),
          guestRating: guestRating ? Number(guestRating) : 1200,
        });
      } else {
        if (!searchQuery.trim()) throw new Error("Username is required");

        let targetUserId = selectedUserId;

        if (!targetUserId) {
          try {
            const profileRes = await api.get(`/users/${searchQuery.trim()}`);
            targetUserId = profileRes.data._id;
          } catch {
            throw new Error("Could not find a user with that exact username.");
          }
        }

        await api.post(`/tournaments/${tournamentId}/add-player`, {
          isGuest: false,
          userId: targetUserId,
        });
      }

      setGuestName("");
      setGuestRating("");
      setSearchQuery("");
      setSelectedUserId("");
      setSearchResults([]);
      onSuccess();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to add player.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-[28rem] bg-card border border-border rounded-2xl shadow-2xl overflow-visible flex flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent text-2xl">
              person_add
            </span>
            <h2 className="text-foreground text-lg font-bold tracking-tight uppercase">
              Add Player
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex p-1 bg-background/50 rounded-xl border border-border/50">
            <button
              onClick={() => {
                setActiveTab("registered");
                setError("");
              }}
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${
                activeTab === "registered"
                  ? "bg-accent text-[#0B1120] shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Registered User
            </button>
            <button
              onClick={() => {
                setActiveTab("guest");
                setError("");
              }}
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${
                activeTab === "guest"
                  ? "bg-accent text-[#0B1120] shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Guest (Walk-in)
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {activeTab === "registered" ? (
            <div className="space-y-2 relative">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                Search by Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isSearching ? (
                    <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-muted-foreground group-focus-within:text-accent transition-colors text-xl">
                      search
                    </span>
                  )}
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUserId("");
                  }}
                  className="block w-full pl-12 pr-4 py-4 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none"
                  placeholder="e.g. magnuscarlsen"
                  type="text"
                />
              </div>

              {/* LIVE SEARCH DROPDOWN */}
              {searchResults.length > 0 && !selectedUserId && (
                <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-border/50">
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => {
                        setSearchQuery(user.username);
                        setSelectedUserId(user._id);
                        setSearchResults([]);
                      }}
                      className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                        <span className="material-symbols-outlined text-sm">
                          person
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {user.username}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[10px] text-muted-foreground mt-2 italic">
                They will be linked to their official CrossTable profile and
                stats.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  Player Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-muted-foreground group-focus-within:text-accent transition-colors text-xl">
                      badge
                    </span>
                  </div>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none"
                    placeholder="Full Name"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  Estimated Rating
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-muted-foreground group-focus-within:text-accent transition-colors text-xl">
                      trending_up
                    </span>
                  </div>
                  <input
                    value={guestRating}
                    onChange={(e) => setGuestRating(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-background/50 border border-border rounded-lg text-accent font-mono text-lg placeholder-muted-foreground focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none"
                    placeholder="1200"
                    type="number"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                      ELO
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-6 bg-background/30 flex gap-3 border-t border-border mt-auto">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-[#0B1120] font-bold text-xs hover:brightness-110 transition-all shadow-md uppercase tracking-widest disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#0B1120] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-lg">add</span>
            )}
            Add to Tournament
          </button>
        </footer>
      </div>
    </div>
  );
}
