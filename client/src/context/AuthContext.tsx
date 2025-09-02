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
