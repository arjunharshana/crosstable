import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, type Variants } from "motion/react";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { ConfirmDialog } from "../components/ConfirmDialog";

export default function About() {
  const navigate = useNavigate();
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);

  // Footer animation refs
  const footerRef = useRef<HTMLElement>(null);
  const footerInView = useInView(footerRef, { once: true, margin: "-60px" });

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden selection:bg-accent/30 selection:text-primary font-sans min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <Link to="/">
                <Logo className="h-12" />
              </Link>
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              {(["About", "Features", "Resources"] as const).map((label, i) => (
                <motion.a
                  key={label}
                  className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors uppercase tracking-wide relative cursor-pointer"
                  href={
                    label === "About"
                      ? "/about"
                      : label === "Features"
                        ? "/#features"
                        : undefined
                  }
                  onClick={(e) => {
                    if (label === "About") {
                      e.preventDefault();
                      navigate("/about");
                      window.scrollTo(0, 0); // Ensures page loads at the top
                    }
                    if (label === "Features") {
                      // Only smooth scroll if we are already on the homepage
                      if (window.location.pathname === "/") {
                        e.preventDefault();
                        document
                          .getElementById("features")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                    if (label === "Resources") {
                      e.preventDefault();
                      setIsResourcesModalOpen(true);
                    }
                  }}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  {label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-px bg-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.22 }}
                  />
                </motion.a>
              ))}
            </div>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ThemeToggle />
              <Link
                to="/login"
                className="hidden sm:flex text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-6 py-2.5 rounded shadow-sm hover:shadow-md transition-all border border-primary"
                >
                  Sign Up
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-grow pt-36 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div
            className="text-center mb-20"
            custom={0.1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6 tracking-tight">
              About <span className="text-foreground">CrossTable</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto border-t border-border pt-6">
              Bridging the gap between the timeless history of chess and the
              modern standards of software engineering.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Who We Are */}
            <motion.div
              className="bg-card border border-border p-8 md:p-12 rounded-lg relative overflow-hidden group shadow-sm"
              custom={0.3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  groups
                </span>
                Who We Are
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-light">
                We are a team of passionate chess players and software
                developers dedicated to modernizing the competitive chess
                ecosystem. While the rules of the game have stood the test of
                time, the tools used to organize and manage tournaments have
                often lagged behind. We built CrossTable to bring a sleek,
                reliable, and user-friendly experience to arbiters and
                organizers everywhere.
              </p>
            </motion.div>

            {/* What We Do */}
            <motion.div
              className="bg-card border border-border p-8 md:p-12 rounded-lg relative overflow-hidden group shadow-lg"
              custom={0.5}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">
                  architecture
                </span>
                What CrossTable Does
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-light mb-6">
                CrossTable is a comprehensive tournament administration
                platform. We provide arbiters with robust, cloud-based tools to
                streamline the entire event lifecycle. From managing player
                registries and synchronizing official ratings, to generating
                automated pairings and broadcasting live match ledgers,
                CrossTable handles the administrative heavy lifting so you can
                focus on the board.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-20 text-center"
            custom={0.7}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={() => navigate("/login")}
              className="bg-accent hover:bg-accent/90 text-[#0B1120] text-lg font-bold px-12 py-4 rounded transition-all shadow-lg relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-white/20 pointer-events-none"
                initial={{ x: "-100%", skewX: "-15deg" }}
                whileHover={{ x: "160%" }}
                transition={{ duration: 0.4 }}
              />
              Organize Your Next Event
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="bg-card border-t border-border pt-16 pb-8 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <motion.div
              className="col-span-2 md:col-span-1"
              initial={{ opacity: 0, y: 28 }}
              animate={footerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Logo className="h-8" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The authoritative platform for professional chess tournament
                administration and broadcasting.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={footerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a
                    className="hover:text-accent transition-colors"
                    href="/#features"
                  >
                    Features
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a
                    className="hover:text-accent transition-colors"
                    href="/#pricing"
                  >
                    Pricing
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={footerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground/60">
                <li>
                  <span className="cursor-default select-none">
                    Documentation
                  </span>
                </li>
                <li>
                  <span className="cursor-default select-none">
                    API Reference
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={footerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.26 }}
            >
              <h4 className="font-bold text-primary mb-6 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    className="hover:text-accent transition-colors"
                    to="/about"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    About
                  </Link>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a
                    className="hover:text-accent transition-colors"
                    href="mailto:support.crosstable@gmail.com"
                  >
                    Contact
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            animate={footerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.38 }}
          >
            <p className="text-xs text-muted-foreground font-mono">
              © 2026 CrossTable Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <motion.a
                className="text-muted-foreground hover:text-primary transition-colors"
                href="#"
                whileHover={{ y: -4, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
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
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ConfirmDialog
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        onConfirm={() => {}}
        title="Coming Soon"
        message="We're currently polishing our developer API reference and tournament organizer guides. This hub will be available shortly after our beta launch."
        confirmText="Got It"
        cancelText="Close"
        isDestructive={false}
      />
    </div>
  );
}
