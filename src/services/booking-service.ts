import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking, BookingStatus, ServiceCategory } from "@/types";

const BOOKINGS_COLLECTION = "bookings";

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status">
): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
    ...data,
    status: "scheduled" as BookingStatus,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("userId", "==", userId),
    where("status", "==", "scheduled"),
    orderBy("date", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}

export async function getBookingHistory(userId: string): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("userId", "==", userId),
    where("status", "in", ["completed", "cancelled", "rescheduled"]),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
    status: "cancelled" as BookingStatus,
    updatedAt: Timestamp.now(),
  });
}

export async function rescheduleBooking(
  bookingId: string,
  newDate: Timestamp,
  newTimeSlot: string,
  newInstitutionId: string,
  newInstitutionName: string
): Promise<void> {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
    date: newDate,
    timeSlot: newTimeSlot,
    institutionId: newInstitutionId,
    institutionName: newInstitutionName,
    status: "rescheduled" as BookingStatus,
    updatedAt: Timestamp.now(),
  });
}

export async function getBookingsByDateAndInstitution(
  institutionId: string,
  date: Timestamp,
  serviceCategory: ServiceCategory
): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("institutionId", "==", institutionId),
    where("date", "==", date),
    where("serviceCategory", "==", serviceCategory),
    where("status", "==", "scheduled")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}

export async function getAllActiveBookings(): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("status", "==", "scheduled"),
    orderBy("date", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
}

export async function markBookingCompleted(bookingId: string): Promise<void> {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
    status: "completed" as BookingStatus,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
}
