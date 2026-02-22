import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import api from "../services/api";
import { AxiosError } from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordReqs = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordReqs).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = isPasswordValid && passwordsMatch && token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password });

      alert("Password successfully reset! You can now log in.");
      navigate("/login");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(
        axiosError.response?.data?.message ||
          "Failed to reset password. Your link may have expired.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground h-screen flex flex-col font-sans overflow-hidden">
      {/* Navbar */}
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
        {/* Left Panel*/}
        <div className="relative hidden md:flex w-1/2 h-full bg-slate-950 overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-transparent to-slate-950/90 z-10 pointer-events-none"></div>
          <img
            alt="Tactical Chess"
            className="w-full h-full object-cover opacity-90 scale-105 hover:scale-110 transition-transform duration-[20s] ease-in-out grayscale-[20%]"
            src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=2158&auto=format&fit=crop"
          />
          <div className="absolute bottom-16 left-12 z-20 max-w-md">
            <div className="w-12 h-[2px] bg-accent mb-6 shadow-sm"></div>
            <p className="font-serif text-2xl text-white drop-shadow-md leading-relaxed italic font-medium">
              "Tactics flow from a superior position."
            </p>
            <p className="text-sm text-white/90 drop-shadow-sm mt-4 uppercase tracking-widest font-mono font-bold">
              Bobby Fischer
            </p>
          </div>
        </div>

        {/* Right Panel: Form Area */}
        <div className="w-full md:w-1/2 h-full flex flex-col px-8 sm:px-12 lg:px-24 bg-background relative overflow-y-auto">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply dark:mix-blend-screen"></div>

          <div className="relative z-10 max-w-md mx-auto w-full my-auto py-12 md:py-16">
            {!token ? (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                <span className="material-symbols-outlined text-destructive text-5xl mb-4">
                  error
                </span>
                <h1 className="text-2xl font-semibold text-foreground mb-2 font-serif">
                  Missing Reset Token
                </h1>
                <p className="text-muted-foreground text-sm mb-6">
                  It looks like you clicked an invalid or incomplete link.
                  Please request a new password reset.
                </p>
                <Link
                  to="/forgot-password"
                  className="text-accent hover:underline font-medium"
                >
                  Request new link
                </Link>
              </div>
            ) : (
              // Normal Flow
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mb-6 border border-border">
                    <span className="material-symbols-outlined text-accent">
                      lock_reset
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3 font-serif">
                    Set New Password
                  </h1>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    Please create a strong password to secure your account.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* New Password Input */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="password"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm pr-10"
                        id="password"
                        placeholder="••••••••••••"
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>

                    {/* Dynamic Password Checklist */}
                    <div
                      className={`grid grid-cols-2 gap-2 text-[10px] sm:text-xs overflow-hidden transition-all duration-300 ease-in-out ${
                        isPasswordFocused ||
                        (password.length > 0 && !isPasswordValid)
                          ? "max-h-24 pt-2 opacity-100"
                          : "max-h-0 pt-0 opacity-0"
                      }`}
                    >
                      {Object.entries(passwordReqs).map(([key, valid]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-1.5 transition-colors duration-300 ${valid ? "text-accent" : "text-muted-foreground"}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {valid ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span className="capitalize">
                            {key === "special"
                              ? "Special Char"
                              : key === "length"
                                ? "8+ Chars"
                                : key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full bg-card border text-foreground px-4 py-3 rounded-md focus:outline-none focus:ring-1 placeholder-muted-foreground transition-colors shadow-sm pr-10 ${
                          confirmPassword.length > 0 && !passwordsMatch
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-accent focus:ring-accent"
                        }`}
                        id="confirmPassword"
                        placeholder="••••••••••••"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showConfirmPassword
                            ? "visibility_off"
                            : "visibility"}
                        </span>
                      </button>
                    </div>
                    {/* Visual cue if passwords don't match */}
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-[10px] text-destructive pt-1">
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      className={`w-full font-bold text-sm uppercase tracking-wider py-4 rounded-md shadow-md transition-all transform ${
                        !canSubmit || isSubmitting
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-accent hover:bg-accent/90 text-[#0B0F19] hover:-translate-y-0.5 hover:shadow-lg"
                      }`}
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
