import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Collaborator } from "@/types";

const COLLABORATORS_COLLECTION = "collaborators";

export async function getCollaborators(): Promise<Collaborator[]> {
  const snapshot = await getDocs(collection(db, COLLABORATORS_COLLECTION));
  return snapshot.docs.map(
    (d) => ({ uid: d.id, ...d.data() }) as Collaborator
  );
}

export async function createCollaborator(
  data: Omit<Collaborator, "uid">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLABORATORS_COLLECTION), data);
  return docRef.id;
}

export async function updateCollaborator(
  id: string,
  data: Partial<Omit<Collaborator, "uid">>
): Promise<void> {
  await updateDoc(doc(db, COLLABORATORS_COLLECTION, id), data);
}

export async function deleteCollaborator(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLABORATORS_COLLECTION, id));
}

export async function getCollaboratorByEmail(
  email: string
): Promise<Collaborator | null> {
  const q = query(
    collection(db, COLLABORATORS_COLLECTION),
    where("email", "==", email)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { uid: d.id, ...d.data() } as Collaborator;
}
