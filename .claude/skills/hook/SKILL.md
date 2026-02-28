---
name: hook
description: Generate a new custom React hook following project conventions. Use when creating reusable stateful logic for components.
argument-hint: <hook-name>
disable-model-invocation: true
---

# Generate Hook: $ARGUMENTS

Create a new custom React hook at `src/hooks/use-$ARGUMENTS.ts` following the project's hook conventions.

## Conventions
1. File naming: `use-<name>.ts` (kebab-case)
2. Function naming: `use<Name>` (camelCase with `use` prefix)
3. Always add `"use client"` directive at the top
4. Import services from `@/services/` — never call Firebase directly from hooks
5. Use `useAuth()` from `@/contexts/auth-context` when user context is needed
6. Return a typed object with state values and action functions

## Pattern Template
```typescript
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getData, performAction } from "@/services/your-service";
import type { YourType } from "@/types";

export function useYourHook(param?: string) {
  const { user } = useAuth();
  const [data, setData] = useState<YourType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const result = await getData(user.uid);
    setData(result);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function action(id: string) {
    await performAction(id);
    await fetch(); // Refresh data after action
  }

  return { data, loading, action, refresh: fetch };
}
```

## Key Patterns
- **Data fetching hooks**: Fetch on mount, return `{ data, loading, refresh }`
- **Action hooks**: Include mutation functions that refresh data after execution
- **Filter hooks**: Include state for search/filter with `useMemo` for filtered results
- **Auth-dependent hooks**: Guard with `if (!user) return;` before fetching

## State Management Rules
- Use `useState` for local component state
- Use `useCallback` for stable function references in `useEffect` dependencies
- Use `useMemo` for derived/computed values (e.g., filtered lists)
- Never use external state libraries (Redux, Zustand, etc.)

## Reference Files
- `src/hooks/use-bookings.ts` — Data fetching + actions (cancel, refresh)
- `src/hooks/use-institutions.ts` — Data fetching + client-side filtering with useMemo
- `src/hooks/use-auth.ts` — Re-export from context
