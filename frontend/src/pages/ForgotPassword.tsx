import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import api from "../services/api";
import { AxiosError } from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setStep(2);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(
        axiosError.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground h-screen flex flex-col font-sans overflow-hidden">
      {/* Navbar - Identical to Login/Register */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Logo className="h-12" />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-bold text-primary hover:text-accent transition-colors mr-2 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                Back to Login
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row w-full h-full pt-24">
        {/* Left Panel: Hero Image */}
        <div className="relative hidden md:flex w-1/2 h-full bg-slate-950 overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-transparent to-slate-950/90 z-10 pointer-events-none"></div>
          <img
            alt="Chess Board"
            className="w-full h-full object-cover opacity-90 scale-105 hover:scale-110 transition-transform duration-[20s] ease-in-out grayscale-[20%]"
            src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2158&auto=format&fit=crop"
          />
          <div className="absolute bottom-16 left-12 z-20 max-w-md">
            <div className="w-12 h-[2px] bg-accent mb-6 shadow-sm"></div>
            <p className="font-serif text-2xl text-white drop-shadow-md leading-relaxed italic font-medium">
              "You may learn much more from a game you lose than from a game you
              win."
            </p>
            <p className="text-sm text-white/90 drop-shadow-sm mt-4 uppercase tracking-widest font-mono font-bold">
              José Raúl Capablanca
            </p>
          </div>
        </div>

        {/* Right Panel: Form Area */}
        <div className="w-full md:w-1/2 h-full flex flex-col px-8 sm:px-12 lg:px-24 bg-background relative overflow-y-auto">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply dark:mix-blend-screen"></div>

          <div className="relative z-10 max-w-md mx-auto w-full my-auto py-12 md:py-16">
            {step === 1 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mb-6 border border-border">
                    <span className="material-symbols-outlined text-accent">
                      key
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3 font-serif">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    Enter the email associated with your account and we'll send
                    you a link to reset your password.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="email"
                    >
                      Account Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground material-symbols-outlined text-[20px]">
                        mail
                      </span>
                      <input
                        className="w-full bg-card border border-border text-foreground pl-11 pr-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm"
                        id="email"
                        placeholder="Your email address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      className={`w-full font-bold text-sm uppercase tracking-wider py-4 rounded-md shadow-md transition-all transform ${
                        isSubmitting || !email
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-accent hover:bg-accent/90 text-[#0B0F19] hover:-translate-y-0.5 hover:shadow-lg"
                      }`}
                      type="submit"
                      disabled={isSubmitting || !email}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* --- STEP 2: SUCCESS MESSAGE --- */
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                  <span className="material-symbols-outlined text-accent text-3xl">
                    mark_email_read
                  </span>
                </div>
                <h1 className="text-3xl font-semibold text-foreground mb-4 font-serif">
                  Check your email
                </h1>
                <p className="text-muted-foreground font-light text-sm leading-relaxed mb-8">
                  We've sent a password reset link to <br />
                  <span className="font-medium text-foreground">
                    {email}
                  </span>. <br />
                  Please check your inbox and spam folder.
                </p>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-card border border-border hover:border-accent text-foreground px-6 py-3 rounded-md transition-colors font-medium text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  Return to Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
