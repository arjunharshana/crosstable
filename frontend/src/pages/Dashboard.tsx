import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Welcome back */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            Welcome back,{" "}
            <span className="text-accent font-semibold">
              {user?.fname || "Nigger"}
            </span>
          </h1>
        </div>

        <button className="bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] group whitespace-nowrap transform hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
          Create New Tournament
        </button>
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
              03
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
              02
            </span>
            <span className="text-accent text-xs font-mono mb-1.5">
              Next in 45m
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
              2882
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
                    <tr className="hover:bg-background/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
                          <span className="text-[#10B981] text-xs font-bold uppercase">
                            Live
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-foreground group-hover:text-accent transition-colors">
                          Tata Steel Chess 2026
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Wijk aan Zee, Masters
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">
                        Jan 12 - 28
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-foreground font-mono">
                        14
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <span className="material-symbols-outlined text-lg">
                            more_horiz
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-background/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-accent"></span>
                          <span className="text-accent text-xs font-bold uppercase">
                            Pairing
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-foreground group-hover:text-accent transition-colors">
                          Candidates Tournament
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Toronto, Open Section
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono">
                        Apr 02 - 23
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-foreground font-mono">
                        8
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <span className="material-symbols-outlined text-lg">
                            more_horiz
                          </span>
                        </button>
                      </td>
                    </tr>
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
            <div className="bg-card border border-border rounded-md p-6 shadow-sm">
              <ul className="space-y-6">
                <li className="relative pl-6 pb-6 border-l border-border last:pb-0 last:border-0">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-card"></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-foreground font-medium">
                      Registered for{" "}
                      <span className="text-accent">Tata Steel 2026</span>
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Today, 09:42 AM
                    </p>
                  </div>
                </li>
                <li className="relative pl-6 pb-6 border-l border-border last:pb-0 last:border-0">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-muted-foreground ring-4 ring-card"></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-foreground font-medium">
                      Match completed vs.{" "}
                      <span className="font-semibold">Caruana, F.</span> (Draw)
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Yesterday, 18:30 PM
                    </p>
                  </div>
                </li>
                <li className="relative pl-6 pb-6 border-l border-border last:pb-0 last:border-0">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-muted-foreground ring-4 ring-card"></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-foreground font-medium">
                      Published Round 3 Pairings for{" "}
                      <span className="font-semibold">
                        Candidates Tournament
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Yesterday, 14:15 PM
                    </p>
                  </div>
                </li>
              </ul>
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

          {/* next  */}
          <div className="bg-card border border-border p-5 rounded-md shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative group hover:border-accent/50 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-[10px] text-accent uppercase font-bold tracking-widest mb-1">
                  Speed Chess Championship
                </p>
                <p className="text-xs text-muted-foreground">Round of 16</p>
              </div>
              <div className="bg-background px-2 py-1 rounded text-[10px] font-mono text-[#10B981] border border-border flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
                LIVE IN 45m
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10 bg-background/50 rounded-lg p-3 border border-border/50">
              <div className="text-center w-1/3">
                <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm mx-auto mb-2 border-2 border-accent shadow-sm">
                  You
                </div>
                <p className="text-xs font-bold text-foreground">White</p>
              </div>

              <div className="text-center w-1/3 px-2">
                <span className="text-[10px] text-muted-foreground font-mono block mb-1 uppercase tracking-widest">
                  VS
                </span>
                <span className="text-xs text-foreground font-bold block bg-card py-1 rounded border border-border">
                  3+2 Blitz
                </span>
              </div>

              <div className="text-center w-1/3">
                <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm mx-auto mb-2 border border-border">
                  HN
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                  Hikaru N.
                </p>
              </div>
            </div>

            <button className="w-full bg-accent hover:bg-accent/90 text-[#0B1120] font-bold py-2.5 rounded-md text-xs transition-colors shadow-[0_0_10px_rgba(197,160,89,0.2)] uppercase tracking-wider relative z-10 transform hover:-translate-y-0.5">
              Join Match Lobby
            </button>
          </div>

          {/* future */}
          <div className="bg-card border border-border p-5 rounded-md relative opacity-80 hover:opacity-100 transition-opacity">
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
