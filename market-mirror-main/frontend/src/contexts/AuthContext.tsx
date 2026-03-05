import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { clearAuthSession, getStoredToken, getStoredUser, setAuthSession, apiGet, apiPost, type AuthScope } from "@/lib/api";
import { ensureStaticAdmin, isStaticAdmin } from "@/lib/static-admin";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  user_metadata?: {
    full_name?: string;
  };
  created_at?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: { access_token: string } | null;
  isLoading: boolean;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithAdminId: (adminId: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const signupInProgress = useRef(false);
  const signinInProgress = useRef(false);

  const applyAuth = (data: AuthResponse, scope: AuthScope) => {
    setAuthSession(data, scope);
    setUser(data.user);
    setSession({ access_token: data.token });
    setIsAdmin(Boolean(data.isAdmin));
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const localUser = getStoredUser();
        if (!localUser) {
          setIsLoading(false);
          return;
        }
        const me = await apiGet<{ user: AuthUser; isAdmin: boolean }>("/api/auth/me");
        setUser(me.user);
        setIsAdmin(Boolean(me.isAdmin));
        setSession({ access_token: getStoredToken() });
      } catch {
        clearAuthSession("all");
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    if (signupInProgress.current) return { error: new Error("Signup already in progress") };
    signupInProgress.current = true;
    setIsSigningUp(true);

    try {
      const data = await apiPost<AuthResponse>("/api/auth/register", { email, password, fullName }, false);
      applyAuth(data, "user");
      return { error: null };
    } catch (error: any) {
      return { error: error || new Error("Signup failed") };
    } finally {
      signupInProgress.current = false;
      setIsSigningUp(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (signinInProgress.current) return { error: new Error("Signin already in progress") };
    signinInProgress.current = true;
    setIsSigningIn(true);

    try {
      const data = await apiPost<AuthResponse>("/api/auth/login", { email, password }, false);
      applyAuth(data, "user");
      if (isStaticAdmin(email)) {
        await ensureStaticAdmin(data.user.id, email);
        const me = await apiGet<{ user: AuthUser; isAdmin: boolean }>("/api/auth/me");
        setIsAdmin(Boolean(me.isAdmin));
      }
      return { error: null };
    } catch (error: any) {
      return { error: error || new Error("Login failed") };
    } finally {
      signinInProgress.current = false;
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      if (session?.access_token) {
        await apiPost("/api/auth/logout");
      }
    } catch {
      // ignore
    } finally {
      const scope: AuthScope = window.location.pathname.startsWith("/admin") ? "admin" : "user";
      clearAuthSession(scope);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  const signInWithAdminId = async (adminId: string, password: string) => {
    if (signinInProgress.current) return { error: new Error("Signin already in progress") };
    signinInProgress.current = true;
    setIsSigningIn(true);

    try {
      const data = await apiPost<AuthResponse>("/api/auth/admin-login", { adminId, password }, false);
      applyAuth(data, "admin");
      return { error: null };
    } catch (error: any) {
      return { error: error || new Error("Admin login failed") };
    } finally {
      signinInProgress.current = false;
      setIsSigningIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSigningUp,
        isSigningIn,
        isAdmin,
        signUp,
        signIn,
        signInWithAdminId,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
