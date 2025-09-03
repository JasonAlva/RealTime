import { supabase } from "../lib/supabaseClient";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

type SessionUser = {
  id: string;
  name: string;
  email?: string | null;
  isGuest: boolean;
};

interface AuthContextType {
  user: SessionUser | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function makeGuestUser(): SessionUser {
  const existing = localStorage.getItem("guest_user");
  if (existing) {
    return JSON.parse(existing);
  }
  const short = Math.random().toString(36).slice(2, 6);
  const guest: SessionUser = {
    id: `guest_${crypto.randomUUID?.() ?? short}`,
    name: `Anonymous-${short}`,
    email: null,
    isGuest: true,
  };
  localStorage.setItem("guest_user", JSON.stringify(guest));
  return guest;
}

function toSessionUser(session: Session | null): SessionUser | null {
  const u: SupabaseUser | null = session?.user ?? null;
  if (!u) return null;

  const meta = (u.user_metadata ?? {}) as Record<string, any>;
  const name =
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    (u.email ? u.email.split("@")[0] : null) ||
    "Anonymous";

  return {
    id: u.id,
    name,
    email: u.email,
    isGuest: false,
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setInitialized(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);
  const user = useMemo<SessionUser | null>(() => {
    const su = toSessionUser(session);
    if (su) {
      return su;
    }
    if (!initialized) {
      return null;
    }
    return makeGuestUser();
  }, [session, initialized]);
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
