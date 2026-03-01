import { createContext } from "react";

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
