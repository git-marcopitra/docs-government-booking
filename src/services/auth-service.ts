import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getCollaboratorByEmail } from "@/services/collaborator-service";
import type { User, UserRole } from "@/types";

function biToEmail(bilheteIdentidade: string): string {
  return `${bilheteIdentidade}@gov.ao`;
}

export async function loginWithBI(
  bilheteIdentidade: string,
  password: string
): Promise<User> {
  const email = biToEmail(bilheteIdentidade);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(credential.user.uid);
  if (!profile) {
    throw new Error("Perfil do utilizador não encontrado.");
  }
  return profile;
}

export async function registerUser(
  bilheteIdentidade: string,
  password: string,
  nomeCompleto: string,
  telefone?: string,
  email?: string,
  role: UserRole = "citizen"
): Promise<User> {
  const authEmail = biToEmail(bilheteIdentidade);
  const credential = await createUserWithEmailAndPassword(
    auth,
    authEmail,
    password
  );

  const user: User = {
    uid: credential.user.uid,
    bilheteIdentidade,
    nomeCompleto,
    telefone,
    email,
    role,
  };

  await setDoc(doc(db, "users", credential.user.uid), user);
  return user;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);
    if (!profile) {
      throw new Error("Perfil do utilizador não encontrado.");
    }
    if (profile.role === "citizen") {
      await signOut(auth);
      throw new Error("Acesso restrito a administradores.");
    }
    return profile;
  } catch (error: unknown) {
    const code = (error as { code?: string }).code;
    if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
      const collab = await getCollaboratorByEmail(email);
      if (collab) {
        throw new FirstLoginError(email);
      }
    }
    throw error;
  }
}

export class FirstLoginError extends Error {
  email: string;
  constructor(email: string) {
    super("FIRST_LOGIN");
    this.email = email;
  }
}

export async function registerCollaboratorAuth(
  email: string,
  password: string
): Promise<User> {
  const collab = await getCollaboratorByEmail(email);
  if (!collab) {
    throw new Error("Colaborador não encontrado.");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  const user: User = {
    uid: credential.user.uid,
    bilheteIdentidade: "",
    nomeCompleto: collab.nomeCompleto,
    telefone: collab.telefone,
    email: collab.email,
    role: collab.role,
  };

  await setDoc(doc(db, "users", credential.user.uid), user);
  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}
