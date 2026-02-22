import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import api from "../services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed:", err);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const handleLogin = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
