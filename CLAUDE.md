# CLAUDE.md — Government Booking System

## Project Overview

Government Booking is a web-based scheduling platform that allows citizens to book appointments for government document services (ID cards, passports, criminal records, etc.). It includes a public-facing booking flow and an administrative back office.

**Target locale:** Angola (Portuguese — pt-PT/pt-AO)
**Primary language in UI:** Portuguese

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Backend/Auth/DB | Firebase (Firestore, Authentication) |
| Styling | Stylin.js / @stylin.js/elements |
| Deployment | Vercel (assumed) |

---

## Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (public)/         # Public routes (home, login, register)
│   │   ├── (booking)/        # Booking flow (steps 0-3)
│   │   ├── (dashboard)/      # User dashboard (marcações, histórico, perfil)
│   │   └── (admin)/          # Admin back office
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Firebase config, utilities, helpers
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Firebase service layer (Firestore queries, auth)
│   ├── types/                # TypeScript interfaces and types
│   └── constants/            # App-wide constants and enums
├── public/                   # Static assets (illustrations, icons, logo)
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

---

## Architecture & Conventions

### Code Style

- Use **TypeScript strict mode** — avoid `any` types
- Functional components only with React hooks
- Use `"use client"` directive only when necessary (event handlers, hooks, browser APIs)
- Prefer Server Components by default (Next.js App Router)
- File naming: `kebab-case` for files, `PascalCase` for components
- One component per file

### Styling with Stylin.js

- Use `@stylin.js/elements` for styled components
- Do NOT use Tailwind, CSS Modules, or inline styles
- Keep styles co-located with components or in adjacent style files
- Follow the design system tokens (colors, spacing, typography)

### Firebase Patterns

- All Firebase interactions go through the `services/` layer — never call Firebase directly from components
- Use Firestore security rules — never trust client-side validation alone
- Authentication via Firebase Auth with custom fields (Bilhete de Identidade as identifier)
- Use Firestore real-time listeners (`onSnapshot`) for live data (e.g., available slots)
- Use batched writes for operations that modify multiple documents

### State Management

- Use React Context for global state (auth, user profile)
- Use local state (`useState`, `useReducer`) for component-level state
- Avoid external state libraries unless complexity demands it

---

## Domain Model

### Key Entities

```typescript
interface User {
  uid: string;
  bilheteIdentidade: string; // National ID number
  nomeCompleto: string;
  telefone?: string;
  email?: string;
  role: "citizen" | "admin";
}

interface Booking {
  id: string;
  userId: string;
  serviceCategory: ServiceCategory;
  serviceType: string;
  institutionId: string;
  date: Timestamp;
  timeSlot: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Institution {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  services: string[];
  availableSlots: TimeSlot[];
  maxCapacity: number;
  pinned?: boolean; // user-specific preference
}

interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  averageDuration: number; // in minutes
  maxCapacity: number;
  requirements: string[]; // documents needed
}

type ServiceCategory =
  | "documentacao-pessoal"
  | "documentacao-habitacional"
  | "documentacao-automovel"
  | "documentacao-comercial";
```

---

## User Flows

### Booking Flow (Citizen)

```
Home → Login/Register → Tela 0 (Categories) → Tela 1 (Service Selection)
→ Tela 2 (Institution Selection) → Tela 3 (Date/Time + Confirmation) → Done
```

1. **Tela 0:** Four category cards (Pessoal, Habitacional, Automóvel, Comercial)
2. **Tela 1:** List of specific services within chosen category
3. **Tela 2:** Split layout — requirements panel (left) + institution cards with search (right)
4. **Tela 3:** Split layout — map with institution location (left) + calendar/time picker (right) → confirmation message with details

### Dashboard (Citizen)

- **Agendar** (default tab): Booking flow entry
- **Minhas Marcações**: Active bookings list with Reschedule/Cancel actions
- **Histórico**: Past bookings
- **Perfil**: User profile management

### Admin Back Office

- Service management (CRUD): duration, capacity, requirements
- Accessed via the same "Entrar" button with admin role detection

---

## Key UI Patterns

### Layout

- **Header:** Logo centered, auth button/user info on the right
- **Navigation bar:** Horizontal tabs below header (Agendar, Minhas Marcações, Histórico, Perfil)
- **Content area:** Centered, often split into two panels for complex screens

### Component Conventions

- Confirmation dialogs before destructive actions (cancel booking, remove service)
- Cards for institutions and services
- Interactive map (consider Leaflet or Google Maps) for institution locations
- Calendar component showing only available dates
- Time slot selector with clearly marked availability
- Search bar above institution listings
- Pin/unpin button on institution cards for user favorites
- Success state with checkmark icon after booking confirmation

---

## Important Business Rules

1. Users authenticate with **Bilhete de Identidade** (national ID number) + password
2. Only **available dates** should be selectable in the calendar
3. Time slots have **capacity limits** — disable when full
4. Users can **reschedule** (redirects to booking flow with pre-filled data)
5. Users can **cancel** with mandatory confirmation dialog
6. Users can **pin institutions** to keep them at the top of the list
7. Admin can **edit** service duration and capacity
8. Admin can **remove** services with confirmation

---

## Localization Notes

- All UI text in **Portuguese** (Angolan/European variant)
- Use "utilizador" not "usuário"
- Use "marcação/agendamento" for booking/appointment
- Use "Bilhete de Identidade" for national ID
- Date format: `DD/MM/YYYY`
- Time format: `HH:mm` (24-hour)

---

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_MAPS_API_KEY=
```

---

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## When Modifying This Project

- Always validate Firestore security rules when changing data access patterns
- Keep the booking flow linear — avoid skipping steps
- Test slot availability race conditions (multiple users booking simultaneously)
- Ensure all destructive actions have confirmation modals
- Maintain the split-panel layout pattern for Telas 2 and 3
- Keep service requirements up to date in the admin panel
- Run `npm run type-check` before committing
