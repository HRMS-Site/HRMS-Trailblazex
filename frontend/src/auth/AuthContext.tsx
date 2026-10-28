import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { isMockApiEnabled } from "@/lib/env";
import { login as loginRequest } from "@/services/auth";
import type { SessionUser } from "@/types";

const STORAGE_KEY = "hrms.session";

function readSession(): SessionUser | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: SessionUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requiresLogin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession());
  const requiresLogin = isMockApiEnabled();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      requiresLogin,
      async login(email: string, password: string) {
        const next = await loginRequest(email, password);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setUser(next);
      },
      logout() {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem("hrms.accessToken");
        setUser(null);
      },
    }),
    [user, requiresLogin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return value;
}
