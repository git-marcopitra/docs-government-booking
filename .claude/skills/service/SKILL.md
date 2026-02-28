---
name: service
description: Generate a new Firebase service file following project conventions. Use when adding Firestore operations for a new collection or domain.
argument-hint: <service-name>
disable-model-invocation: true
---

# Generate Service: $ARGUMENTS

Create a new Firebase service file at `src/services/$ARGUMENTS-service.ts` following the project's service layer pattern.

## Core Rules
1. **All Firebase access goes through service files** — components never import Firebase directly
2. Export **standalone async functions** — no classes
3. Use `db` from `@/lib/firebase` for Firestore operations
4. Use `auth` from `@/lib/firebase` for Auth operations (only in auth-service)
5. Define a **collection name constant** at the top of the file
6. Use strict TypeScript — import/define proper types for inputs and outputs

## File Structure Pattern
```typescript
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
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { YourType } from "@/types";

const COLLECTION_NAME = "your-collection";

export async function getAll(): Promise<YourType[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as YourType);
}

export async function getById(id: string): Promise<YourType | null> {
  const snap = await getDoc(doc(db, COLLECTION_NAME, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as YourType;
}

export async function create(data: Omit<YourType, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
  return docRef.id;
}

export async function update(id: string, data: Partial<Omit<YourType, "id">>): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), data);
}

export async function remove(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
```

## Firestore Query Patterns
- Use `where()` for filtering
- Use `orderBy()` for sorting
- Use `Timestamp.now()` for created/updated timestamps
- Use `arrayUnion()` / `arrayRemove()` for array field operations
- For composite queries, ensure matching indexes exist in `firestore.indexes.json`

## Type Conventions
- Define new types in `src/types/index.ts` if they don't exist yet
- Use `Timestamp` from `firebase/firestore` for date fields
- Use `Omit<Type, "id">` for create operations (ID is auto-generated)
- Use `Partial<Omit<Type, "id">>` for update operations
- Return `Type | null` for single-document lookups

## Security
- After creating a service, add corresponding rules in `firestore.rules`
- Follow the existing pattern: read requires auth, write may require admin role
- Use the `isAdmin()` helper function for admin-only operations

## Reference Files
- `src/services/booking-service.ts` — Complex queries with multiple where/orderBy
- `src/services/institution-service.ts` — Array operations (arrayUnion/arrayRemove)
- `src/services/service-service.ts` — Simple CRUD operations
- `src/services/auth-service.ts` — Auth + user profile management
