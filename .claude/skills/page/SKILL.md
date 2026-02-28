---
name: page
description: Generate a new Next.js App Router page following project conventions. Use when adding a new route to the booking system.
argument-hint: <route-group>/<page-path>
disable-model-invocation: true
---

# Generate Page: $ARGUMENTS

Create a new Next.js App Router page following the project's routing and layout conventions.

## Route Groups
The app uses these route groups — place the page in the appropriate one:

| Group | Path | Layout | Use Case |
|-------|------|--------|----------|
| `(public)` | `src/app/(public)/` | Header only | Public pages (no auth required) |
| `(booking)` | `src/app/(booking)/` | Header + NavBar (citizen) | Booking flow pages |
| `(dashboard)` | `src/app/(dashboard)/` | Header + NavBar (citizen) | User dashboard pages |
| `(admin)` | `src/app/(admin)/` | Header + NavBar (admin) | Admin back office pages |

## File Structure
- Create `page.tsx` inside the target directory: `src/app/<group>/<path>/page.tsx`
- Use dynamic segments with `[paramName]` for dynamic routes
- Export a default function component

## Conventions
- Add `"use client"` only when the page uses hooks, event handlers, or browser APIs
- Import and use existing components from `src/components/`
- Import services from `src/services/` — never call Firebase directly
- Import types from `@/types`
- All UI text must be in **Portuguese** (Angola)
- Use Stylin.js elements for layout: `import { Div, H2, P } from "@stylin.js/elements"`
- Use `useParams()` from `next/navigation` for dynamic route params
- Use `useRouter()` for programmatic navigation

## Layout Integration
Each route group already has a `layout.tsx` that provides:
- `(public)`: `<Header />` only
- `(booking)`: `<Header />` + `<NavBar items={NAV_ITEMS} />` + `<Main maxWidth="1100px">`
- `(dashboard)`: `<Header />` + `<NavBar items={NAV_ITEMS} />` + `<Main maxWidth="900px">`
- `(admin)`: `<Header />` + `<NavBar items={ADMIN_NAV_ITEMS} />` + `<Main maxWidth="900px">`

Do NOT re-add Header or NavBar in the page — they come from the layout.

## State & Data Patterns
- Use `useState` + `useEffect` for data fetching from services
- Use `useAuth()` from `@/contexts/auth-context` for user context
- Show loading states while fetching: `<P color="#888">A carregar...</P>`
- Show empty states when no data: `<P color="#888">Nenhum resultado.</P>`

## Example Pattern
```typescript
"use client";

import { useEffect, useState } from "react";
import { Div, H2, P } from "@stylin.js/elements";
import { useAuth } from "@/contexts/auth-context";

export default function ExamplePage() {
  const { user } = useAuth();
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <Div>
      <H2 fontSize="1.25rem" fontWeight="600" color="#333" mb="1.5rem">
        Título da Página
      </H2>
      {loading ? (
        <P color="#888">A carregar...</P>
      ) : data.length === 0 ? (
        <P color="#888">Nenhum resultado encontrado.</P>
      ) : (
        <Div display="flex" flexDirection="column" gap="0.75rem">
          {/* Render data */}
        </Div>
      )}
    </Div>
  );
}
```

## Reference Files
- `src/app/(booking)/agendar/page.tsx` — Simple category grid page
- `src/app/(dashboard)/marcacoes/page.tsx` — List page with actions
- `src/app/(admin)/servicos/page.tsx` — CRUD page with forms
- `src/app/(public)/login/page.tsx` — Form page with split layout
