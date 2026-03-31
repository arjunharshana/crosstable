import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AxiosError } from "axios";
import { motion, type Variants } from "motion/react"; // ADDED Variants IMPORT

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function CreateTournament() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const isRoundsDisabled =
    formData.format === "Round Robin" || formData.format === "Knockout";

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

    if (!formData.startDate) {
      setError("Start date is required.");
      setLoading(false);
      return;
    }
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

      const finalRounds = isRoundsDisabled ? 0 : Number(formData.totalRounds);

      const response = await api.post("/tournaments", {
        name: formData.name,
        description: formData.description,
        format: formData.format,
        formatType: formData.formatType,
        tournamentType: formData.tournamentType,
        location: finalLocation,
        timeControl: timeControlString,
        totalRounds: finalRounds,
        access: formData.access,
        startDate: formData.startDate || new Date().toISOString(),
      });

      navigate(`/tournaments/${response.data._id}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Failed to create tournament. Please try again.";

      console.error("Create Tournament Error:", errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col relative min-h-[calc(100vh-4rem)]"
    >
      {/* Decorative Grid Background */}
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

      {/* Arbiter Header - Slides down */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-16 border-b border-border bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 shrink-0"
      >
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
              Create Tournament
              <span className="text-xs font-sans font-normal text-accent border border-accent/30 px-2 py-0.5 rounded bg-accent/5">
                Arbiter Setup
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground font-mono hidden md:block">
            STATUS: <span className="text-foreground">DRAFT</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area - Staggered children */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-4 md:p-6 z-10"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {error && (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-12 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md flex items-center gap-3"
            >
              <span className="material-symbols-outlined">error</span>
              {error}
            </motion.div>
          )}

          {/* Left Column: Identification */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="bg-card border border-border rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] relative overflow-hidden group h-full">
              <div className="p-4 border-b border-border/50 bg-background/30 flex justify-between items-center">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-lg">
                    badge
                  </span>
                  Identification
                </h2>
                <span className="material-symbols-outlined text-muted-foreground text-lg">
                  info
                </span>
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
                    className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground/50 transition-colors"
                    placeholder="e.g. Winter Blitz 2026"
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
                      className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none transition-colors cursor-pointer"
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
                      className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none transition-colors cursor-pointer"
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
                      className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none transition-colors cursor-pointer"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Team" disabled>
                        Team (Soon)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold block">
                    Venue / Location
                  </label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground group">
                      <input
                        type="radio"
                        name="venueType"
                        value="Online"
                        checked={formData.venueType === "Online"}
                        onChange={handleChange}
                        className="text-accent bg-transparent border-muted-foreground focus:ring-0 transition-all"
                      />
                      <span className="group-hover:text-accent transition-colors">
                        Online
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground group">
                      <input
                        type="radio"
                        name="venueType"
                        value="Offline"
                        checked={formData.venueType === "Offline"}
                        onChange={handleChange}
                        className="text-accent bg-transparent border-muted-foreground focus:ring-0 transition-all"
                      />
                      <span className="group-hover:text-accent transition-colors">
                        Offline
                      </span>
                    </label>
                  </div>

                  {formData.venueType === "Offline" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="relative duration-200"
                    >
                      <span className="absolute left-3 top-1.5 text-muted-foreground material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      <input
                        required
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 pl-9 pr-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        placeholder="City, Country or Venue Name"
                        type="text"
                      />
                    </motion.div>
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
                    className="w-full bg-background border border-border rounded-sm text-foreground text-sm p-3 h-24 focus:border-accent focus:ring-1 focus:ring-accent resize-none transition-colors"
                    placeholder="Enter tournament details..."
                  ></textarea>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Format & Rules */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 flex flex-col gap-4"
          >
            <div className="bg-card border border-border rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] h-full">
              <div className="p-4 border-b border-border/50 bg-background/30 flex justify-between items-center">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-lg">
                    tune
                  </span>
                  Format & Rules
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-[10px] bg-background border border-border px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
                  >
                    Load Preset
                  </button>
                </div>
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
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm font-mono text-center focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                        className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm font-mono text-center focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                      <label
                        className={`text-xs uppercase tracking-widest mb-1 font-semibold block flex justify-between items-center ${isRoundsDisabled ? "text-muted-foreground/50" : "text-muted-foreground"}`}
                      >
                        Rounds
                        {isRoundsDisabled && (
                          <span className="text-[9px] text-accent/80 normal-case">
                            (Auto)
                          </span>
                        )}
                      </label>

                      {/* CONDITIONAL ROUNDS INPUT */}
                      {isRoundsDisabled ? (
                        <input
                          disabled
                          value="Auto-calculated"
                          className="w-full bg-background border border-border/30 rounded-sm text-muted-foreground/60 py-1.5 px-3 text-sm font-mono cursor-not-allowed italic"
                          type="text"
                        />
                      ) : (
                        <input
                          required
                          name="totalRounds"
                          value={formData.totalRounds}
                          onChange={handleChange}
                          className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm font-mono focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                          type="number"
                          min="1"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-semibold block">
                        Pairing Engine
                      </label>
                      <select className="w-full bg-background border border-border rounded-sm text-foreground py-1.5 px-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent appearance-none transition-colors cursor-pointer">
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
                      className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors group ${formData.access === "Public" ? "bg-accent/5 border-accent" : "bg-background border-border hover:border-accent/50"}`}
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
                          className={`text-xs font-bold transition-colors ${formData.access === "Public" ? "text-accent" : "text-foreground group-hover:text-accent/80"}`}
                        >
                          Public
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Listed in lobby
                        </span>
                      </div>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors group ${formData.access === "Invite Only" ? "bg-accent/5 border-accent" : "bg-background border-border hover:border-accent/50"}`}
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
                          className={`text-xs font-bold transition-colors ${formData.access === "Invite Only" ? "text-accent" : "text-foreground group-hover:text-accent/80"}`}
                        >
                          Invite Only
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Link required
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar: Scheduling */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 lg:col-span-12"
          >
            <div className="bg-card border border-border rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
              <div className="p-4 border-b border-border/50 bg-background/30 flex justify-between items-center">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-lg">
                    calendar_month
                  </span>
                  Schedule Timeline
                </h2>
              </div>
              <div className="p-5 overflow-x-auto">
                <div className="flex min-w-[600px] justify-between items-center relative py-4">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-0"></div>

                  <div className="relative z-10 flex flex-col items-center group">
                    <div className="w-8 h-8 rounded-full bg-accent border-4 border-card flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(197,160,89,0.3)] group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[#0B1120] text-sm font-bold">
                        flag
                      </span>
                    </div>
                    <div className="text-center bg-card p-2 border border-border rounded shadow-lg min-w-[140px] transition-colors group-hover:border-accent/50">
                      <p className="text-[10px] text-accent uppercase font-bold mb-1">
                        Tournament Starts *
                      </p>
                      <input
                        required
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="bg-background border border-border rounded text-foreground text-xs p-1 font-mono w-full text-center focus:border-accent focus:ring-1 focus:ring-accent [color-scheme:dark] transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center opacity-50 hover:opacity-80 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-border border-4 border-card mb-2"></div>
                    <div className="text-center bg-card p-2 border border-border rounded shadow-lg min-w-[120px]">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                        Rounds Progress
                      </p>
                      <div className="text-[10px] text-foreground font-mono">
                        Auto-scheduled
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center opacity-50 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-border border-4 border-card flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-foreground text-sm">
                        trophy
                      </span>
                    </div>
                    <div className="text-center bg-card p-2 border border-border rounded shadow-lg min-w-[120px]">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                        Awards
                      </p>
                      <div className="text-[10px] text-foreground font-mono">
                        TBD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sticky Bottom Action Bar - Slides up */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="mt-8 w-full bg-background border-t border-border p-4 md:px-8 flex justify-between items-center z-10"
      >
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Format
            </span>
            <span className="text-foreground font-mono font-medium">
              {formData.format} • {formData.formatType} •{" "}
              {isRoundsDisabled ? "Auto" : formData.totalRounds} Rounds
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 px-8 rounded-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)] group disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-[#0B1120] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-xl">
                rocket_launch
              </span>
            )}
            Launch Tournament
          </button>
        </div>
      </motion.footer>
    </form>
  );
}
