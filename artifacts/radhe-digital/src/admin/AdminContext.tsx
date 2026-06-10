import React, { createContext, useContext, useState, useCallback } from "react";
import { loginAdmin, type AdminUser } from "./api";

interface AdminContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const STORAGE_KEY    = "rd_admin_auth";
const STORAGE_USER   = "rd_admin_user";

function isValidJwt(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
}

function loadStored(): { auth: boolean; user: AdminUser | null } {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!isValidJwt(token)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_USER);
      return { auth: false, user: null };
    }
    const raw  = localStorage.getItem(STORAGE_USER);
    const user = raw ? (JSON.parse(raw) as AdminUser) : null;
    return { auth: true, user };
  } catch {
    return { auth: false, user: null };
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const stored = loadStored();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(stored.auth);
  const [user, setUser] = useState<AdminUser | null>(stored.user);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginAdmin(email, password);
      localStorage.setItem(STORAGE_KEY, res.token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(res.user));
      setIsAuthenticated(true);
      setUser(res.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_USER);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
