import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Institution } from "@/types";

const INSTITUTIONS_COLLECTION = "institutions";

export async function getInstitutions(): Promise<Institution[]> {
  const snapshot = await getDocs(collection(db, INSTITUTIONS_COLLECTION));
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Institution
  );
}

export async function getInstitutionById(
  id: string
): Promise<Institution | null> {
  const snap = await getDoc(doc(db, INSTITUTIONS_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Institution;
}

export async function getInstitutionsByService(
  serviceId: string
): Promise<Institution[]> {
  const q = query(
    collection(db, INSTITUTIONS_COLLECTION),
    where("services", "array-contains", serviceId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Institution
  );
}

export async function pinInstitution(
  userId: string,
  institutionId: string
): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    pinnedInstitutions: arrayUnion(institutionId),
  });
}

export async function unpinInstitution(
  userId: string,
  institutionId: string
): Promise<void> {
  await updateDoc(doc(db, "users", userId), {
    pinnedInstitutions: arrayRemove(institutionId),
  });
}

export async function createInstitution(
  data: Omit<Institution, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, INSTITUTIONS_COLLECTION), data);
  return docRef.id;
}

export async function updateInstitution(
  id: string,
  data: Partial<Omit<Institution, "id">>
): Promise<void> {
  await updateDoc(doc(db, INSTITUTIONS_COLLECTION, id), data);
}

export async function deleteInstitution(id: string): Promise<void> {
  await deleteDoc(doc(db, INSTITUTIONS_COLLECTION, id));
}

export async function addServiceToInstitution(
  institutionId: string,
  serviceId: string
): Promise<void> {
  await updateDoc(doc(db, INSTITUTIONS_COLLECTION, institutionId), {
    services: arrayUnion(serviceId),
  });
}

export async function removeServiceFromInstitution(
  institutionId: string,
  serviceId: string
): Promise<void> {
  await updateDoc(doc(db, INSTITUTIONS_COLLECTION, institutionId), {
    services: arrayRemove(serviceId),
  });
}
