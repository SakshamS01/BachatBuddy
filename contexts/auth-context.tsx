"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthChange,
  signIn,
  signUp,
  logOut,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  firebaseStatus,
  type UserProfile,
} from "@/lib/firebase";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isFirebaseConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateIncome: (income: number) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase isn't configured, just stop loading
    if (!firebaseStatus.isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!firebaseStatus.isConfigured) {
      setError("Firebase is not configured. Please add environment variables.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await signIn(email, password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!firebaseStatus.isConfigured) {
      setError("Firebase is not configured. Please add environment variables.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const newUser = await signUp(email, password);
      await createUserProfile(newUser.uid, email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      if (firebaseStatus.isConfigured) {
        await logOut();
      }
      setUser(null);
      setUserProfile(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to log out";
      setError(errorMessage);
      throw err;
    }
  };

  const updateIncome = async (income: number) => {
    if (!user) return;
    if (!firebaseStatus.isConfigured) {
      // In demo mode, just update local state
      setUserProfile((prev) =>
        prev ? { ...prev, monthlyIncome: income } : null
      );
      return;
    }
    try {
      await updateUserProfile(user.uid, { monthlyIncome: income });
      setUserProfile((prev) =>
        prev ? { ...prev, monthlyIncome: income } : null
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update income";
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        isFirebaseConfigured: firebaseStatus.isConfigured,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateIncome,
        clearError,
      }}
    >
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
