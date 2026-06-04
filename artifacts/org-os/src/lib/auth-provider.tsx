import React, { createContext, useContext, useState } from "react";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  organizationId: number;
  status: string;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("org_os_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("org_os_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("org_os_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
