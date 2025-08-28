import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type User = SupabaseUser | null;

interface AuthContextType {
  user: User;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
            
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
    
        if (error) {
          console.error("Signup error:", error.message);
          alert(error.message); // or show in UI
          return;
        }
    
        console.log("Signup success:", data);
        alert("Signup successful! Check your email for confirmation.");
      } catch (err: any) {
        console.error("Unexpected error:", err.message);
        alert("Something went wrong. Try again later.");
      }
  };

  const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            alert("Please confirm your email before logging in.");
          } else {
            alert("Login failed: " + error.message);
          }
        } else {
          console.log("Login success", data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      setError(error.message);
      return;
    }
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, error, signUp, signIn, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
