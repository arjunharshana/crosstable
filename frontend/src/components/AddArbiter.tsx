import { useState, useEffect } from "react";
import api from "../services/api";
import { AxiosError } from "axios";

interface AddArbiterModalProps {
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

export default function AddArbiterModal({
  isOpen,
  onClose,
  tournamentId,
  onSuccess,
}: AddArbiterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  // Live Search Effect
  useEffect(() => {
    if (!searchQuery.trim() || selectedUserId) {
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
  }, [searchQuery, selectedUserId]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
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

      await api.post(`/tournaments/${tournamentId}/add-arbiter`, {
        userId: targetUserId,
      });

      setSearchQuery("");
      setSelectedUserId("");
      setSearchResults([]);
      onSuccess();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to add arbiter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-[28rem] bg-card border border-border rounded-2xl shadow-2xl overflow-visible flex flex-col relative">
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent text-2xl">
              admin_panel_settings
            </span>
            <h2 className="text-foreground text-lg font-bold tracking-tight uppercase">
              Add Arbiter
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

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
                placeholder="e.g. garykasparov"
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
              Arbiters will gain full access to pair rounds and report scores.
            </p>
          </div>
        </div>

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
              <span className="material-symbols-outlined text-lg">
                shield_person
              </span>
            )}
            Promote to Arbiter
          </button>
        </footer>
      </div>
    </div>
  );
}
