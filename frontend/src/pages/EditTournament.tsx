import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { AxiosError } from "axios";

export default function EditTournament() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    format: "Swiss",
    formatType: "Blitz",
    tournamentType: "Solo",
    venueType: "Online",
    location: "",
    description: "",
    timeControlBase: "3",
    timeControlIncrement: "2",
    totalRounds: "9",
    access: "Public",
    startDate: "",
  });

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await api.get(`/tournaments/${id}`);
        const data = response.data;

        const [base, inc] = data.timeControl
          ? data.timeControl.split("+")
          : ["3", "2"];

        const formattedDate = data.startDate
          ? new Date(data.startDate).toISOString().slice(0, 16)
          : "";

        setFormData({
          name: data.name || "",
          format: data.format || "Swiss",
          formatType: data.formatType || "Blitz",
          tournamentType: data.tournamentType || "Solo",
          venueType: data.location === "Online" ? "Online" : "Offline",
          location: data.location === "Online" ? "" : data.location || "",
          description: data.description || "",
          timeControlBase: base,
          timeControlIncrement: inc,
          totalRounds: data.totalRounds?.toString() || "9",
          access: data.access || "Public",
          startDate: formattedDate,
        });
      } catch {
        setError("Failed to load tournament data.");
      } finally {
        setInitialFetchLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const selectedDate = new Date(formData.startDate);
    const now = new Date();
    if (selectedDate < now) {
      setError("Tournament start date and time cannot be in the past.");
      setLoading(false);
      return;
    }

    try {
      const timeControlString = `${formData.timeControlBase}+${formData.timeControlIncrement}`;
      const finalLocation =
        formData.venueType === "Online" ? "Online" : formData.location;

      await api.put(`/tournaments/${id}`, {
        name: formData.name,
        description: formData.description,
        format: formData.format,
        formatType: formData.formatType,
        tournamentType: formData.tournamentType,
        location: finalLocation,
        timeControl: timeControlString,
        totalRounds: Number(formData.totalRounds),
        access: formData.access,
        startDate: formData.startDate,
      });

      navigate(`/tournaments/${id}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to update tournament.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialFetchLoading) {
    return (
      <div className="p-8 flex justify-center">
        <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)]"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      ></div>

      <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
              Edit Tournament
              <span className="text-xs font-sans font-normal text-accent border border-accent/30 px-2 py-0.5 rounded bg-accent/5">
                Arbiter Setup
              </span>
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {error && (
            <div className="lg:col-span-12 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden group h-full">
              <div className="p-4 border-b border-border/50 bg-background/30 flex justify-between items-center">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-lg">
                    badge
                  </span>{" "}
                  Identification
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                    Tournament Name
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                      Type
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none"
                    >
                      <option value="Swiss">Swiss</option>
                      <option value="Round Robin">Round Robin</option>
                      <option value="Knockout">Knockout</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                      Format
                    </label>
                    <select
                      name="formatType"
                      value={formData.formatType}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none"
                    >
                      <option value="Blitz">Blitz</option>
                      <option value="Rapid">Rapid</option>
                      <option value="Classical">Classical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                      Players
                    </label>
                    <select
                      name="tournamentType"
                      value={formData.tournamentType}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Team" disabled>
                        Team
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold block">
                    Venue / Location
                  </label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                      <input
                        type="radio"
                        name="venueType"
                        value="Online"
                        checked={formData.venueType === "Online"}
                        onChange={handleChange}
                        className="text-accent bg-transparent border-muted-foreground focus:ring-0"
                      />{" "}
                      Online
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                      <input
                        type="radio"
                        name="venueType"
                        value="Offline"
                        checked={formData.venueType === "Offline"}
                        onChange={handleChange}
                        className="text-accent bg-transparent border-muted-foreground focus:ring-0"
                      />{" "}
                      Offline
                    </label>
                  </div>
                  {formData.venueType === "Offline" && (
                    <div className="relative">
                      <span className="absolute left-3 top-1.5 text-muted-foreground material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      <input
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 pl-9 pr-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="Venue Name"
                        type="text"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                    Description (Markdown)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-sm text-foreground text-sm p-3 h-24 focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] h-full">
              <div className="p-4 border-b border-border/50 bg-background/30 flex justify-between items-center">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-lg">
                    tune
                  </span>{" "}
                  Format & Rules
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-border/30">
                    <span className="material-symbols-outlined text-accent text-lg">
                      timer
                    </span>
                    <h3 className="text-xs font-bold text-foreground uppercase">
                      Time Control
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                        Base (min)
                      </label>
                      <input
                        required
                        name="timeControlBase"
                        value={formData.timeControlBase}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm font-mono text-center focus:border-accent focus:ring-1 focus:ring-accent"
                        type="number"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                        Increment (sec)
                      </label>
                      <input
                        required
                        name="timeControlIncrement"
                        value={formData.timeControlIncrement}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm font-mono text-center focus:border-accent focus:ring-1 focus:ring-accent"
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-border/30">
                    <span className="material-symbols-outlined text-accent text-lg">
                      hub
                    </span>
                    <h3 className="text-xs font-bold text-foreground uppercase">
                      Pairing System
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                        Rounds
                      </label>
                      <input
                        required
                        name="totalRounds"
                        value={formData.totalRounds}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm font-mono focus:border-accent focus:ring-1 focus:ring-accent"
                        type="number"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                        Pairing Engine
                      </label>
                      <select className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none">
                        <option>JaVaFo (FIDE)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 pt-2 border-t border-border/30">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold block">
                    Access Control
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${formData.access === "Public" ? "bg-accent/5 border-accent" : "bg-background border-border hover:border-accent/50"}`}
                    >
                      <input
                        type="radio"
                        name="access"
                        value="Public"
                        checked={formData.access === "Public"}
                        onChange={handleChange}
                        className="text-accent bg-transparent border-muted-foreground focus:ring-0"
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-bold ${formData.access === "Public" ? "text-accent" : "text-foreground"}`}
                        >
                          Public
                        </span>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${formData.access === "Invite Only" ? "bg-accent/5 border-accent" : "bg-background border-border hover:border-accent/50"}`}
                    >
                      <input
                        type="radio"
                        name="access"
                        value="Invite Only"
                        checked={formData.access === "Invite Only"}
                        onChange={handleChange}
                        className="text-accent bg-transparent border-muted-foreground focus:ring-0"
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-bold ${formData.access === "Invite Only" ? "text-accent" : "text-foreground"}`}
                        >
                          Invite Only
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Scheduling */}
          <div className="col-span-1 lg:col-span-12">
            <div className="bg-card border border-border rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] p-4 flex flex-col items-center">
              <label className="text-[10px] text-accent uppercase font-bold mb-1">
                Tournament Starts *
              </label>
              <input
                required
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-background border border-border rounded text-foreground text-xs p-2 font-mono text-center focus:border-accent focus:ring-1 focus:ring-accent [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <footer className="mt-8 w-full bg-background border-t border-border p-4 md:px-8 flex justify-end items-center z-10">
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-8 rounded-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)] group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-[#0B1120] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-xl">save</span>
          )}
          Save Changes
        </button>
      </footer>
    </form>
  );
}
