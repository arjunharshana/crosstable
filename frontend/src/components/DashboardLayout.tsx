import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedTournament?:
    | {
        _id: string;
        name: string;
      }
    | string;
  createdAt: string;
}

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/explore", icon: "explore", label: "Explore" },
    { path: "/tournaments", icon: "trophy", label: "My Tournaments" },
    { path: "/games", icon: "swords", label: "My Games" },
    { path: "/settings", icon: "settings", label: "Settings" },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/activity/notifications");
        setNotifications(res.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    fetchNotifications();
  }, [location.pathname]); // Refetch when navigating pages

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotifMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReadNotification = (notif: Notification) => {
    setIsNotifMenuOpen(false);

    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)),
      );

      api.patch(`/activity/notifications/${notif._id}/read`).catch((err) => {
        console.error("Failed to mark as read in DB", err);
      });
    }

    const tourneyId =
      typeof notif.relatedTournament === "string"
        ? notif.relatedTournament
        : notif.relatedTournament?._id;

    if (tourneyId) {
      navigate(`/tournaments/${tourneyId}`);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await api.patch("/activity/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read in database", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-background h-screen flex overflow-hidden selection:bg-accent selection:text-[#0B1120] font-sans text-foreground">
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col justify-between transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0
          ${isSidebarCollapsed ? "md:w-20" : "md:w-64 w-64"}
        `}
      >
        <div>
          <div
            className={`h-20 flex items-center border-b border-border/50 ${isSidebarCollapsed ? "justify-center px-0" : "justify-between md:justify-start px-6"}`}
          >
            <Link to="/dashboard" className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-accent" />
              {!isSidebarCollapsed && (
                <span className="font-bold font-serif text-xl tracking-wide whitespace-nowrap">
                  CrossTable
                </span>
              )}
            </Link>

            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="mt-8 px-2 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
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

        {/* Profile Section */}
        <div
          className="p-4 border-t border-border/50 relative"
          ref={profileMenuRef}
        >
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

          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`w-full flex items-center p-2 rounded-md hover:bg-background transition-colors ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}
          >
            <div className="flex items-center">
              <img
                alt="Profile"
                className="h-8 w-8 rounded-full ring-2 ring-background"
                src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1E293B&color=C5A059`}
              />
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
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
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
        <header className="relative z-50 h-20 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors md:hidden"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
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

            {/* NOTIFICATION BELL & DROPDOWN */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors relative mt-1"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-background flex items-center justify-center animate-pulse"></span>
                )}
              </button>

              {isNotifMenuOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col max-h-[80vh]">
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
                    <h3 className="font-bold text-sm tracking-wide text-foreground uppercase">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase font-bold tracking-wider"
                        >
                          Mark all read
                        </button>
                        <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-sm">
                          {unreadCount} New
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Body */}
                  <div className="overflow-y-auto flex-1 divide-y divide-border/50">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <span className="material-symbols-outlined text-3xl mb-2 opacity-50">
                          notifications_paused
                        </span>
                        <p className="text-xs">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif._id}
                          onClick={() => handleReadNotification(notif)}
                          className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex gap-3 items-start ${!notif.isRead ? "bg-accent/5" : ""}`}
                        >
                          <div
                            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? "bg-accent shadow-[0_0_8px_rgba(197,160,89,0.6)]" : "bg-transparent"}`}
                          ></div>
                          <div className="flex-1">
                            <p
                              className={`text-sm leading-snug ${!notif.isRead ? "text-foreground font-medium" : "text-muted-foreground"}`}
                            >
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <span className="material-symbols-outlined text-[12px] text-muted-foreground">
                                schedule
                              </span>
                              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Injected Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 z-0 scroll-smooth relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
