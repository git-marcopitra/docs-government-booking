import { Timestamp } from "firebase/firestore";

export type ServiceCategory =
  | "documentacao-pessoal"
  | "documentacao-habitacional"
  | "documentacao-automovel"
  | "documentacao-comercial";

export type BookingStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type UserRole =
  | "citizen"
  | "atendente"
  | "supervisor"
  | "admin"
  | "proprietario";

export interface User {
  uid: string;
  bilheteIdentidade: string;
  nomeCompleto: string;
  telefone?: string;
  email?: string;
  role: UserRole;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  currentBookings: number;
  maxCapacity: number;
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  services: string[];
  availableSlots: TimeSlot[];
  maxCapacity: number;
  pinned?: boolean;
  imageUrl?: string;
  operatingHours?: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  averageDuration: number;
  maxCapacity: number;
  requirements: string[];
}

export interface Booking {
  id: string;
  userId: string;
  serviceCategory: ServiceCategory;
  serviceType: string;
  institutionId: string;
  institutionName: string;
  date: Timestamp;
  timeSlot: string;
  status: BookingStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userName?: string;
  userSurname?: string;
  userBI?: string;
  userPhone?: string;
}

export interface Collaborator {
  uid: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  role: Exclude<UserRole, "citizen">;
  institutionIds: string[];
  serviceIds: string[];
}
