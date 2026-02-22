import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Hook into our global auth state

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordReqs = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordReqs).every(Boolean);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      await api.post("/auth/send-otp", { email: formData.email });
      setStep(2);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(
        axiosError.response?.data?.message ||
          "Error sending code. Please try again.",
      );
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register/verify", {
        ...formData,
        otp,
      });

      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(axiosError.response?.data?.message || "Verification failed.");
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
                <Logo className="h-16" />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                Already have an account?
              </span>
              <Link
                to="/login"
                className="text-sm font-bold text-primary hover:text-accent transition-colors mr-2"
              >
                Log in
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
              "Chess is the struggle against the error."
            </p>
            <p className="text-sm text-white/90 drop-shadow-sm mt-4 uppercase tracking-widest font-mono font-bold">
              Johannes Zukertort
            </p>
          </div>
        </div>

        {/* Right Panel: Dynamic Form */}
        <div className="w-full md:w-1/2 h-full flex flex-col px-8 sm:px-12 lg:px-24 bg-background relative overflow-y-auto">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply dark:mix-blend-screen"></div>

          <div className="relative z-10 max-w-md mx-auto w-full my-auto py-12 md:py-16">
            {step === 1 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10">
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2 font-serif">
                    Create Account
                  </h1>
                  <p className="text-muted-foreground font-light text-sm">
                    Join the network of professional tournament organizers.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSendOTP}>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        className="text-xs font-semibold text-foreground uppercase tracking-wide"
                        htmlFor="fname"
                      >
                        First Name
                      </label>
                      <input
                        className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm"
                        id="fname"
                        placeholder="Magnus"
                        type="text"
                        required
                        value={formData.fname}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="text-xs font-semibold text-foreground uppercase tracking-wide"
                        htmlFor="lname"
                      >
                        Last Name
                      </label>
                      <input
                        className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm"
                        id="lname"
                        placeholder="Carlsen"
                        type="text"
                        required
                        value={formData.lname}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm"
                      id="email"
                      placeholder="arbiter@federation.org"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm pr-10"
                        id="password"
                        placeholder="••••••••••••"
                        required
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-2 text-[10px] sm:text-xs overflow-hidden transition-all duration-300 ease-in-out ${isPasswordFocused || (formData.password.length > 0 && !isPasswordValid) ? "max-h-24 pt-2 opacity-100" : "max-h-0 pt-0 opacity-0"}`}
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

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      className="w-4 h-4 rounded-sm border-border bg-card text-accent"
                      id="terms"
                      type="checkbox"
                      required
                    />
                    <label
                      className="text-xs text-muted-foreground font-light"
                      htmlFor="terms"
                    >
                      I agree to the{" "}
                      <a
                        className="text-foreground font-medium hover:underline"
                        href="#"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      className={`w-full font-bold text-sm uppercase tracking-wider py-4 rounded-md shadow-md transition-all transform ${isPasswordValid ? "bg-accent hover:bg-accent/90 text-[#0B0F19] hover:-translate-y-0.5" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                      type="submit"
                      disabled={!isPasswordValid}
                    >
                      Send Verification Code
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="mb-10">
                  <button
                    onClick={() => setStep(1)}
                    className="text-muted-foreground hover:text-foreground mb-6 flex items-center text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm mr-1">
                      arrow_back
                    </span>
                    Back
                  </button>
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3 font-serif">
                    Check your email
                  </h1>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    We've sent a 6-digit verification code to <br />
                    <span className="font-medium text-foreground">
                      {formData.email}
                    </span>
                    .
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleVerifyOTP}>
                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="otp"
                    >
                      Verification Code
                    </label>
                    <input
                      className="w-full bg-card border border-border text-foreground px-4 py-4 rounded-md focus:outline-none focus:border-accent text-center text-3xl tracking-[0.5em] font-mono"
                      id="otp"
                      maxLength={6}
                      placeholder="000000"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      className="w-full bg-accent hover:bg-accent/90 text-[#0B0F19] font-bold text-sm uppercase tracking-wider py-4 rounded-md shadow-md"
                      type="submit"
                    >
                      Complete Registration
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
