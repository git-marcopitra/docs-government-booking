---
name: component
description: Generate a new UI component following project conventions. Use when creating a new reusable component for the booking system.
argument-hint: <component-name>
disable-model-invocation: true
---

# Generate Component: $ARGUMENTS

Create a new React component at `src/components/$ARGUMENTS.tsx` following these project conventions:

## File Naming
- Filename: **kebab-case** (e.g., `booking-card.tsx`)
- Component export: **PascalCase** named export (e.g., `export function BookingCard`)
- One component per file

## Directive
- Add `"use client"` at the top ONLY if the component uses event handlers, React hooks, or browser APIs
- Prefer Server Components by default

## Styling — Stylin.js
- Import styled elements from `@stylin.js/elements`:
  ```typescript
  import { Div, Button, P, Span, H2, H3, Input, Form, Label } from "@stylin.js/elements";
  ```
- Apply styles as props directly on elements. **Never** use Tailwind, CSS Modules, or inline `style={{}}`.
- Use `nHover={{}}` for hover states and `nFocus={{}}` for focus states.

## Design Tokens
Use these established design tokens consistently:

| Token | Value |
|-------|-------|
| Primary color | `#FFA800` |
| Primary hover | `#E69500` |
| Error/destructive | `#d32f2f` |
| Success | `#2e7d32` |
| Text primary | `#373737` |
| Text secondary | `#ABABAB` |
| Border color | `#e0e0e0` or `#d0d0d0` |
| Background white | `#ffffff` |
| Background light | `#f8f9fa` |
| Background disabled | `#f5f5f5` |
| Accent background | `#FFF3D6` |
| Border radius (buttons) | `6px` |
| Border radius (inputs/cards) | `8px` |
| Border radius (panels) | `10px` |
| Border radius (modals) | `12px` |

## TypeScript
- Use strict TypeScript — no `any` types
- Define a Props interface for the component
- Import types from `@/types` when referencing domain entities

## Portuguese Localization
- All visible text must be in Portuguese (Angolan/European variant)
- Use "utilizador" not "usuário"
- Use "marcação/agendamento" for booking

## Example Pattern
```typescript
"use client";

import { Div, H3, P, Button } from "@stylin.js/elements";

interface ExampleCardProps {
  title: string;
  description: string;
  onAction: () => void;
}

export function ExampleCard({ title, description, onAction }: ExampleCardProps) {
  return (
    <Div
      padding="1.25rem"
      borderRadius="10px"
      border="1px solid #e0e0e0"
      bg="#ffffff"
      transition="box-shadow 0.2s"
      nHover={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <H3 fontSize="1rem" fontWeight="600" color="#373737" mb="0.5rem">
        {title}
      </H3>
      <P fontSize="0.875rem" color="#ABABAB" mb="1rem">
        {description}
      </P>
      <Button
        onClick={onAction}
        bg="#FFA800"
        color="#ffffff"
        border="none"
        padding="0.5rem 1rem"
        borderRadius="6px"
        cursor="pointer"
        fontSize="0.875rem"
        fontWeight="600"
        nHover={{ background: "#E69500" }}
      >
        Acção
      </Button>
    </Div>
  );
}
```

## Reference Files
Look at these existing components for patterns:
- `src/components/category-card.tsx` — Card with hover effects
- `src/components/institution-card.tsx` — Card with actions
- `src/components/confirmation-dialog.tsx` — Modal overlay
- `src/components/booking-row.tsx` — List row with actions
