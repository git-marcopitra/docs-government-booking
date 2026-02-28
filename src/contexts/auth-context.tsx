"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProfile,
  loginWithBI,
  loginWithEmail,
  registerUser,
  registerCollaboratorAuth,
  logoutUser,
} from "@/services/auth-service";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (bi: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  register: (
    bi: string,
    password: string,
    nome: string,
    telefone?: string,
    email?: string,
    role?: UserRole
  ) => Promise<void>;
  setupCollaboratorPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(bi: string, password: string) {
    const profile = await loginWithBI(bi, password);
    setUser(profile);
  }

  async function loginAdmin(email: string, password: string) {
    const profile = await loginWithEmail(email, password);
    setUser(profile);
  }

  async function register(
    bi: string,
    password: string,
    nome: string,
    telefone?: string,
    email?: string,
    role?: UserRole
  ) {
    const profile = await registerUser(bi, password, nome, telefone, email, role);
    setUser(profile);
  }

  async function setupCollaboratorPassword(email: string, password: string) {
    const profile = await registerCollaboratorAuth(email, password);
    setUser(profile);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAdmin, register, setupCollaboratorPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
