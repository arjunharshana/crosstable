import React, { useRef, useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "motion/react";

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 48, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        delay: index * 0.09,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="bg-card p-10 hover:bg-secondary/50 transition-colors group relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5 }}
    >
      {/* Hover sheen */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none"
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.55 }}
      />

      <motion.div
        className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center mb-6 rounded-sm shadow-sm group-hover:bg-accent transition-colors"
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
        transition={{ duration: 0.35 }}
      >
        <span className="material-symbols-outlined text-xl">
          {feature.icon}
        </span>
      </motion.div>

      <h3 className="text-lg font-bold text-primary mb-3 font-serif">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {feature.desc}
      </p>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-80px",
  });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 18 });
  const rotateY = useTransform(smoothX, [-500, 500], [-6, 6]);
  const rotateX = useTransform(smoothY, [-400, 400], [5, -5]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const [barWidth, setBarWidth] = useState<number>(54);
  useEffect(() => {
    const id = setInterval(() => {
      setBarWidth((w) =>
        Math.min(Math.max(w + (Math.random() - 0.5) * 5, 38), 70),
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

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

  const features: Feature[] = [
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
  ];

  return (
    <div className="bg-background text-foreground overflow-x-hidden selection:bg-accent/30 selection:text-primary font-sans">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            {" "}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <Logo className="h-12" />
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              {(["Features", "Pricing", "Resources"] as const).map(
                (label, i) => (
                  <motion.a
                    key={label}
                    className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors uppercase tracking-wide relative"
                    href={`#${label.toLowerCase()}`}
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
                ),
              )}
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

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background"
      >
        <motion.div
          className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#2D3748_1px,transparent_1px),linear-gradient(to_bottom,#2D3748_1px,transparent_1px)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        <motion.div
          className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center">
            <div className="flex flex-col gap-8 pr-0 xl:pr-10">
              <motion.h1
                className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-primary leading-[1.1] font-serif"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Master the Board. <br />
                <motion.span
                  className="italic text-muted-foreground"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  Manage the Result.
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg xl:text-xl text-muted-foreground leading-relaxed max-w-xl font-light border-l border-border pl-6"
                custom={0.45}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                The definitive standard for organizing FIDE-rated tournaments.
                Precision pairings, regulatory compliance, and enterprise-grade
                broadcasting for the modern arbiter.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                custom={0.6}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm xl:text-base uppercase tracking-wider font-semibold px-8 py-4 rounded transition-all shadow-md flex items-center gap-3 group relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 36px hsl(var(--primary)/0.28)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/10 pointer-events-none"
                    initial={{ x: "-100%", skewX: "-15deg" }}
                    whileHover={{ x: "160%" }}
                    transition={{ duration: 0.45 }}
                  />
                  Create Tournament
                  <motion.span
                    className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    arrow_forward
                  </motion.span>
                </motion.button>
                <motion.button
                  className="bg-transparent hover:bg-accent/10 text-primary border border-accent text-sm xl:text-base uppercase tracking-wider font-semibold px-8 py-4 rounded transition-all flex items-center gap-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="material-symbols-outlined text-accent"
                    animate={{ scale: [1, 1.22, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    play_circle
                  </motion.span>
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div
                className="flex items-center gap-6 text-sm text-muted-foreground pt-6 border-t border-border mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.6 }}
              ></motion.div>
            </div>

            {/* Visual Element */}
            <motion.div
              className="relative lg:h-[600px] w-full flex items-center justify-center"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/5 rounded-full blur-[80px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="relative w-full h-full rounded shadow-card-depth border border-border bg-card overflow-hidden group"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              >
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10 pointer-events-none"></div>
                <motion.img
                  alt="Chess Knight"
                  className="w-full h-full object-cover rounded opacity-90 grayscale group-hover:grayscale-0 transition-all duration-700"
                  src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <motion.div
                    className="bg-card/95 backdrop-blur shadow-lg border border-border w-full max-w-sm ml-auto rounded-sm p-5"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.1,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                        Live Pairing Data
                      </span>
                      <div className="flex items-center gap-1">
                        <motion.span
                          className="h-1.5 w-1.5 rounded-full bg-destructive inline-block"
                          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
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
                        <motion.div
                          className="bg-accent h-full"
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.9, ease: "easeInOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Win: 32%</span>
                        <span>Draw: 54%</span>
                        <span>Loss: 14%</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Grid Features */}
      <div ref={featuresRef} className="bg-card py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-serif">
              Enterprise-Grade Tournament Management
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Engineered for stability and scale. Designed for the rigorous
              demands of professional arbiters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={ctaRef}
        className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-border"
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-serif text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            Ready to preside?
          </motion.h2>
          <motion.p
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 28 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            Join the elite tier of organizers who rely on CrossTable for
            flawless tournament execution.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.24 }}
          >
            <motion.button
              className="bg-[#C5A059] hover:bg-[#B08D4B] text-[#0B0F19] text-lg font-bold px-10 py-4 rounded transition-all shadow-lg relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 18px 48px rgba(197,160,89,0.38)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="absolute inset-0 bg-white/20 pointer-events-none"
                initial={{ x: "-100%", skewX: "-15deg" }}
                whileHover={{ x: "160%" }}
                transition={{ duration: 0.4 }}
              />
              Organize Event
            </motion.button>

            <motion.button
              className="bg-transparent hover:bg-white/5 text-white border border-slate-700 hover:border-slate-500 text-lg font-medium px-10 py-4 rounded transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="material-symbols-outlined text-xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                explore
              </motion.span>
              Explore Features
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="bg-card border-t border-border pt-16 pb-8"
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
                  <a className="hover:text-accent transition-colors" href="#">
                    Features
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a className="hover:text-accent transition-colors" href="#">
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
              <ul className="space-y-3 text-sm text-muted-foreground">
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a className="hover:text-accent transition-colors" href="#">
                    Documentation
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a className="hover:text-accent transition-colors" href="#">
                    API Reference
                  </a>
                </motion.li>
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
                  <a className="hover:text-accent transition-colors" href="#">
                    About
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a className="hover:text-accent transition-colors" href="#">
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
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </motion.a>
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
    </div>
  );
}
