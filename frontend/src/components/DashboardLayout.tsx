import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/explore", icon: "explore", label: "Explore" },
    { path: "/tournaments", icon: "trophy", label: "My Tournaments" },
    { path: "/games", icon: "swords", label: "My Games" },
    { path: "/settings", icon: "settings", label: "Settings" },
  ];

  // we will close the dropdown if user clicks out of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-background h-screen flex overflow-hidden selection:bg-accent selection:text-[#0B1120] font-sans text-foreground">
      {/* Collapsible Sidebar */}
      <aside
        className={`${isSidebarCollapsed ? "w-20" : "w-64"} bg-card border-r border-border flex flex-col justify-between transition-all duration-300 z-50 flex-shrink-0 hidden md:flex`}
      >
        <div>
          <div
            className={`h-20 flex items-center border-b border-border/50 ${isSidebarCollapsed ? "justify-center px-0" : "justify-start px-6"}`}
          >
            <Link to="/dashboard" className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-accent" />
              {!isSidebarCollapsed && (
                <span className="font-bold font-serif text-xl tracking-wide whitespace-nowrap">
                  CrossTable
                </span>
              )}
            </Link>
          </div>

          <nav className="mt-8 px-2 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-md group transition-all duration-200 ${
                    isActive
                      ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? "" : "group-hover:text-accent transition-colors"}`}
                  >
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="ml-3 font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* profile*/}
        <div className="p-4 border-t border-border/50 relative" ref={menuRef}>
          {isProfileMenuOpen && (
            <div
              className={`absolute bottom-full mb-2 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${isSidebarCollapsed ? "left-4 right-4" : "left-4 right-4"}`}
            >
              <Link
                to="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-background transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  person
                </span>
                {!isSidebarCollapsed && <span>My Profile</span>}
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-background transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
                {!isSidebarCollapsed && <span>Sign Out</span>}
              </button>
            </div>
          )}

          {/* profile trigger */}
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`w-full flex items-center p-2 rounded-md hover:bg-background transition-colors ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
          >
            <div className="flex items-center">
              <img
                alt="Profile"
                className="h-8 w-8 rounded-full ring-2 ring-background"
                src={`https://ui-avatars.com/api/?name=${user?.fname}+${user?.lname}&background=1E293B&color=C5A059`}
              />
              {!isSidebarCollapsed && (
                <div className="ml-3 overflow-hidden text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.fname} {user?.lname?.charAt(0)}.
                  </p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span
                className={`material-symbols-outlined text-muted-foreground transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
              >
                expand_less
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* grid bg*/}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        ></div>

        {/* Top Header */}
        <header className="h-20 border-b border-border bg-background/80 backdrop-blur-sm z-10 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              <span className="material-symbols-outlined text-2xl">
                {isSidebarCollapsed ? "menu_open" : "menu"}
              </span>
            </button>
            <Logo className="h-8 w-8 md:hidden text-accent" />
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Injected Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 z-10 scroll-smooth relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
