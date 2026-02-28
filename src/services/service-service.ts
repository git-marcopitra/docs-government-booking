import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Service, ServiceCategory } from "@/types";

const SERVICES_COLLECTION = "services";

export async function getServicesByCategory(
  category: ServiceCategory
): Promise<Service[]> {
  const q = query(
    collection(db, SERVICES_COLLECTION),
    where("category", "==", category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const snap = await getDoc(doc(db, SERVICES_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Service;
}

export async function createService(
  data: Omit<Service, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, SERVICES_COLLECTION), data);
  return docRef.id;
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id">>
): Promise<void> {
  await updateDoc(doc(db, SERVICES_COLLECTION, id), data);
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, SERVICES_COLLECTION, id));
}
