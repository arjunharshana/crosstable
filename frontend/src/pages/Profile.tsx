const playerStats = {
  name: "Magnus C.",
  country: "NOR",
  worldRank: "#1",
  tags: [
    {
      label: "FIDE Verified",
      icon: "verified",
      colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "GM Title",
      icon: "military_tech",
      colorClass: "text-accent bg-accent/10 border-accent/20",
    },
  ],
  performance: {
    totalGames: 42,
    winRate: "76%",
    wins: 23,
    draws: 15,
    losses: 4,
    avgOpponent: 2745,
    perfRating: 2890,
    blackWins: "45%",
    whiteWins: "62%",
  },
};

const ratings = [
  {
    id: "classical",
    label: "Classical",
    rating: "2830",
    change: "+4.2",
    isPositive: true,
    path: "M0,35 Q10,32 20,28 T40,25 T60,15 T80,10 T100,5",
  },
  {
    id: "rapid",
    label: "Rapid",
    rating: "2823",
    change: "-2.0",
    isPositive: false,
    path: "M0,20 Q10,18 20,22 T40,25 T60,30 T80,28 T100,35",
  },
  {
    id: "blitz",
    label: "Blitz",
    rating: "2886",
    change: "+12.0",
    isPositive: true,
    path: "M0,30 Q10,32 20,20 T40,15 T60,25 T80,10 T100,2",
  },
];

const trophies = [
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
  {
    id: 2,
    title: "World Rapid Championship",
    location: "Samarkand, Uzbekistan",
    placement: "1st Place",
    desc: "Defended the title successfully in a thrilling tie-break finish.",
    date: "Dec 2023",
    prize: "$60,000",
    icon: "workspace_premium",
    colorTheme:
      "text-muted-foreground border-border group-hover:border-muted-foreground",
    badgeTheme:
      "text-muted-foreground border-muted-foreground/20 bg-muted-foreground/10",
  },
  {
    id: 3,
    title: "Qatar Masters",
    location: "Doha, Qatar",
    placement: "3rd Place",
    desc: "Strong finish in a highly competitive open field.",
    date: "Oct 2023",
    prize: "$25,000",
    icon: "military_tech",
    colorTheme: "text-amber-600 border-border group-hover:border-amber-600",
    badgeTheme: "text-amber-600 border-amber-600/20 bg-amber-600/10",
  },
  {
    id: 4,
    title: "FIDE World Cup",
    location: "Baku, Azerbaijan",
    placement: "1st Place",
    desc: "First ever World Cup victory, completing the set of all major classical titles.",
    date: "Aug 2023",
    prize: "$110,000",
    icon: "trophy",
    colorTheme: "text-accent border-border group-hover:border-accent",
    badgeTheme: "text-accent border-accent/20 bg-accent/5",
  },
];

export default function Profile() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 -mt-6 lg:-mt-8 -mx-6 lg:-mx-8">
      {/* Hero Banner Area */}
      <header className="h-56 bg-gradient-to-b from-accent/10 to-background relative z-10 flex flex-col justify-end px-8 pb-8 border-b border-border">
        <div className="absolute top-6 right-8 flex gap-3">
          <button className="px-4 py-2 bg-card/50 hover:bg-card border border-border rounded-md text-sm text-foreground flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 relative">
          <div className="relative shrink-0">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-full p-1 bg-gradient-to-tr from-accent to-card shadow-lg z-20">
              <img
                alt={playerStats.name}
                className="h-full w-full rounded-full object-cover border-4 border-background bg-background"
                src={`https://ui-avatars.com/api/?name=Magnus+C&background=1E293B&color=C5A059`}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full border border-border shadow-sm z-30">
              <span
                className="material-symbols-outlined text-accent text-2xl"
                title="Verified Grandmaster"
              >
                verified
              </span>
            </div>
          </div>

          <div className="flex-1 mb-1 relative z-20">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
              {playerStats.name}
              <span className="text-sm font-sans font-normal text-muted-foreground px-2 py-0.5 rounded-md border border-border/50 bg-background/30 shadow-inner">
                {playerStats.country}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {playerStats.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`${tag.colorClass} border px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-sm`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {tag.icon}
                  </span>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-8 pt-8">
        {/* Ratings Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {ratings.map((stat) => {
            // Determine color class based purely on data logic
            const svgThemeColor = stat.isPositive
              ? "text-accent"
              : "text-[#EF4444]";

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
                  <span
                    className={`text-xs font-mono font-bold px-2 py-1 rounded-md border ${stat.isPositive ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"}`}
                  >
                    {stat.change}
                  </span>
                </div>

                {/* SVG dynamically inherits the text color via `currentColor` */}
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
                      d={stat.path}
                    ></path>
                    <path
                      fill={`url(#gradient-${stat.id})`}
                      stroke="none"
                      d={`${stat.path} V40 H0 Z`}
                    ></path>
                    <circle
                      className="animate-pulse"
                      cx="100"
                      cy={stat.path.split(",").pop()?.split(" ")[0]}
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
              <div className="flex gap-2">
                <button className="p-1.5 text-muted-foreground hover:bg-card rounded-md hover:text-foreground transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    filter_list
                  </span>
                </button>
                <button className="p-1.5 text-muted-foreground hover:bg-card rounded-md hover:text-foreground transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_month
                  </span>
                </button>
              </div>
            </div>

            <div className="relative pl-4 mt-2">
              <div className="absolute left-[27px] top-4 bottom-0 w-px bg-border"></div>

              {trophies.map((trophy) => (
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

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground bg-background/50 p-2 rounded-sm inline-flex border border-border/50">
                      <span className="flex items-center gap-1.5 text-foreground/80">
                        <span className="material-symbols-outlined text-[16px] text-accent">
                          calendar_today
                        </span>
                        {trophy.date}
                      </span>
                      {trophy.prize && (
                        <span className="flex items-center gap-1.5 text-foreground/80">
                          <span className="material-symbols-outlined text-[16px] text-[#10B981]">
                            payments
                          </span>
                          {trophy.prize}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[20px]">
                  query_stats
                </span>
                Performance (2024)
              </h2>
              <div className="bg-card border border-border p-6 rounded-md shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-4xl font-mono font-bold text-foreground">
                      {playerStats.performance.totalGames}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-2 font-bold">
                      Total Games
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-accent font-mono font-bold text-xl">
                      {playerStats.performance.winRate}
                    </span>
                    <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider mt-0.5">
                      Win Rate
                    </span>
                  </div>
                </div>

                <div className="flex h-3 rounded-sm overflow-hidden mb-4 w-full shadow-inner">
                  <div
                    className="bg-[#10B981] hover:brightness-125 transition-all"
                    style={{ width: "55%" }}
                    title={`Won: ${playerStats.performance.wins}`}
                  ></div>
                  <div
                    className="bg-muted-foreground/50 hover:brightness-125 transition-all"
                    style={{ width: "35%" }}
                    title={`Drawn: ${playerStats.performance.draws}`}
                  ></div>
                  <div
                    className="bg-[#EF4444] hover:brightness-125 transition-all"
                    style={{ width: "10%" }}
                    title={`Lost: ${playerStats.performance.losses}`}
                  ></div>
                </div>

                <div className="flex justify-between text-xs font-mono font-bold text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>{" "}
                    {playerStats.performance.wins} W
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>{" "}
                    {playerStats.performance.draws} D
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>{" "}
                    {playerStats.performance.losses} L
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-5 border-t border-border/60">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Avg Opponent
                    </p>
                    <p className="font-mono font-bold text-foreground text-lg">
                      {playerStats.performance.avgOpponent}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Performance
                    </p>
                    <p className="font-mono font-bold text-accent text-lg drop-shadow-sm">
                      {playerStats.performance.perfRating}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      Black Wins
                    </p>
                    <p className="font-mono font-bold text-foreground">
                      {playerStats.performance.blackWins}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                      White Wins
                    </p>
                    <p className="font-mono font-bold text-foreground">
                      {playerStats.performance.whiteWins}
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
