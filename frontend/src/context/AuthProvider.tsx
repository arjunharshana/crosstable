import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import api from "../services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err: unknown) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
