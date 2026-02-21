import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden selection:bg-accent/30 selection:text-primary font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            {" "}
            <div className="flex items-center gap-3">
              <Logo className="h-12" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors uppercase tracking-wide"
                href="#features"
              >
                Features
              </a>
              <a
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors uppercase tracking-wide"
                href="#pricing"
              >
                Pricing
              </a>
              <a
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors uppercase tracking-wide"
                href="#resources"
              >
                Resources
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="hidden sm:flex text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2 transition-colors">
                Log In
              </button>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-6 py-2.5 rounded shadow-sm hover:shadow-md transition-all border border-primary">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#2D3748_1px,transparent_1px),linear-gradient(to_bottom,#2D3748_1px,transparent_1px)]"></div>

        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center">
            <div className="flex flex-col gap-8 pr-0 xl:pr-10">
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-primary leading-[1.1] font-serif">
                Master the Board. <br />
                <span className="italic text-muted-foreground">
                  Manage the Result.
                </span>
              </h1>

              <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed max-w-xl font-light border-l border-border pl-6">
                The definitive standard for organizing FIDE-rated tournaments.
                Precision pairings, regulatory compliance, and enterprise-grade
                broadcasting for the modern arbiter.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm xl:text-base uppercase tracking-wider font-semibold px-8 py-4 rounded transition-all shadow-md flex items-center gap-3 group">
                  Create Tournament
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button className="bg-transparent hover:bg-accent/10 text-primary border border-accent text-sm xl:text-base uppercase tracking-wider font-semibold px-8 py-4 rounded transition-all flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">
                    play_circle
                  </span>
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-6 border-t border-border mt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">
                    verified_user
                  </span>
                  <span>FIDE Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">
                    database
                  </span>
                  <span>99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative lg:h-[600px] w-full flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/5 rounded-full blur-[80px]"></div>
              <div className="relative w-full h-full rounded shadow-card-depth border border-border bg-card overflow-hidden group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10 pointer-events-none"></div>
                <img
                  alt="Chess Knight"
                  className="w-full h-full object-cover rounded opacity-90 grayscale group-hover:grayscale-0 transition-all duration-700"
                  src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="bg-card/95 backdrop-blur shadow-lg border border-border w-full max-w-sm ml-auto rounded-sm p-5">
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                        Live Pairing Data
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse"></span>
                        <span className="text-[10px] font-bold text-primary uppercase">
                          Live
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold">
                          Carlsen, M. [2853]
                        </span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="text-primary font-bold">
                          Niemann, H. [2699]
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-1 rounded-none overflow-hidden">
                        <div className="bg-accent h-full w-[54%]"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Win: 32%</span>
                        <span>Draw: 54%</span>
                        <span>Loss: 14%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="bg-card py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-serif">
              Enterprise-Grade Tournament Management
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Engineered for stability and scale. Designed for the rigorous
              demands of professional arbiters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {[
              {
                icon: "account_tree",
                title: "Automated Pairings",
                desc: "Instant Swiss, Round-Robin, and Arena pairings. Zero latency even for massive collegiate fields.",
              },
              {
                icon: "verified",
                title: "Regulatory Compliance",
                desc: "Built-in Buchholz and Sonneborn-Berger tie-break calculations matching official handbooks.",
              },
              {
                icon: "link",
                title: "One-Click Matchmaking",
                desc: "Deep integration with online platforms. Generate direct challenge links to eliminate the friction of finding opponents.",
              },
              {
                icon: "emoji_events",
                title: "Season Circuits",
                desc: "Link individual events into leagues. Unified, dynamic leaderboards give players a reason to return.",
              },
              {
                icon: "print",
                title: "Print & Export Engine",
                desc: "Generate vector-perfect PDF pairing sheets for physical posting, plus TRF file exports for rating submission.",
              },
              {
                icon: "admin_panel_settings",
                title: "Arbiter Dashboard",
                desc: "Total control over the bracket. Override results, resolve disputes, and manage late-joins with a few tactical clicks.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-10 hover:bg-secondary/50 transition-colors group"
              >
                <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center mb-6 rounded-sm shadow-sm group-hover:bg-accent transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-border">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-serif text-white">
            Ready to preside?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            Join the elite tier of organizers who rely on CrossTable for
            flawless tournament execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-[#C5A059] hover:bg-[#B08D4B] text-[#0B0F19] text-lg font-bold px-10 py-4 rounded transition-all shadow-lg transform hover:-translate-y-0.5">
              Organize Event
            </button>

            <button className="bg-transparent hover:bg-white/5 text-white border border-slate-700 hover:border-slate-500 text-lg font-medium px-10 py-4 rounded transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl">explore</span>
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Logo className="h-8" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The authoritative platform for professional chess tournament
                administration and broadcasting.
              </p>
            </div>
            {/* Footer Links (Truncated for brevity, kept structure identical) */}
            <div>
              <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a className="hover:text-accent transition-colors" href="#">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-accent transition-colors" href="#">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a className="hover:text-accent transition-colors" href="#">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="hover:text-accent transition-colors" href="#">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a className="hover:text-accent transition-colors" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="hover:text-accent transition-colors" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © 2026 CrossTable Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                className="text-muted-foreground hover:text-primary transition-colors"
                href="#"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                className="text-muted-foreground hover:text-primary transition-colors"
                href="#"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
