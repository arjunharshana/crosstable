import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Invalid credentials. Please try again.";

      console.error("Login Error:", errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-background text-foreground h-screen flex flex-col font-sans overflow-hidden">
      {/* Navbar - Identical to Home/Register */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Logo className="h-12" />
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                Don't have an account?
              </span>
              <Link
                to="/register"
                className="text-sm font-bold text-primary hover:text-accent transition-colors mr-2"
              >
                Sign up
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row w-full h-full pt-24">
        {/* Left Panel: Hero Image (Shared Branding) */}
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
              "Strategy requires thought, tactics require observation."
            </p>
            <p className="text-sm text-white/90 drop-shadow-sm mt-4 uppercase tracking-widest font-mono font-bold">
              Max Euwe
            </p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 h-full flex flex-col px-8 sm:px-12 lg:px-24 bg-background relative overflow-y-auto">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply dark:mix-blend-screen"></div>

          <div className="relative z-10 max-w-md mx-auto w-full my-auto py-12 md:py-16">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2 font-serif">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground font-light text-sm">
                  Enter your credentials to access your tournaments
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-foreground uppercase tracking-wide"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm"
                    id="email"
                    placeholder="Your email address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      className="text-xs font-semibold text-foreground uppercase tracking-wide"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[10px] uppercase tracking-tighter text-muted-foreground hover:text-accent transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder-muted-foreground transition-colors shadow-sm pr-10"
                      id="password"
                      placeholder="••••••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
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
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      className="w-4 h-4 rounded-sm border-border bg-card text-accent focus:ring-offset-background focus:ring-accent"
                      id="remember"
                      type="checkbox"
                    />
                  </div>
                  <label
                    className="text-xs text-muted-foreground font-light cursor-pointer"
                    htmlFor="remember"
                  >
                    Keep me logged in
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    className="w-full bg-accent hover:bg-accent/90 text-[#0B0F19] font-bold text-sm uppercase tracking-wider py-4 rounded-md shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
