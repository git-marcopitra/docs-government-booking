---
name: validate
description: Validate consistency across the codebase — Firestore rules, types, services, and UI conventions. Use to check for inconsistencies or issues.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash(npm run type-check), Bash(npm run lint), Bash(npm run build)
---

# Validate Project Consistency

Perform a comprehensive validation of the Government Booking System codebase. Check each area below and report any issues found.

## 1. TypeScript Strict Compliance
- Run `npm run type-check` and report any errors
- Check for `any` types in `src/` — there should be none
- Verify all service functions have explicit return types

## 2. Firestore Rules vs Code Alignment
Read `firestore.rules` and compare with service files in `src/services/`:
- Every collection accessed in services should have a matching rule
- Read/write permissions should match: citizen-only, admin-only, or authenticated
- Check that `isAdmin()` helper is used for admin-only operations
- Verify user document access is scoped to `request.auth.uid == userId`

## 3. Type-Document Shape Consistency
Compare `src/types/index.ts` interfaces with how documents are created/read in services:
- All fields in the type should be written when creating documents
- All reads should cast to the correct type
- Timestamps should use `firebase/firestore` `Timestamp` type
- Check for missing fields or extra fields

## 4. Component Conventions
Scan all files in `src/components/`:
- Every file should use **kebab-case** naming
- Every component should be a **named export** (not default)
- Styling should use `@stylin.js/elements` — no Tailwind classes, no `className`, no `style={{}}`
- `"use client"` should only be present when needed (hooks, event handlers, browser APIs)

## 5. Portuguese Localization
Scan all `.tsx` files for visible text strings:
- All UI text should be in Portuguese
- Check for English strings in labels, buttons, headings, and messages
- Verify usage of "utilizador" (not "usuário")
- Verify date format is DD/MM/YYYY and time is HH:mm (24-hour)

## 6. Service Layer Isolation
Check that no component or page file directly imports from:
- `firebase/firestore`
- `firebase/auth`
- `@/lib/firebase`

Only files in `src/services/` and `src/contexts/` should import Firebase directly.

## 7. Build & Lint
- Run `npm run build` and report any build errors
- Run `npm run lint` and report any lint errors

## Report Format
For each section, report:
- **PASS** if no issues found
- **FAIL** with specific file paths and line numbers for each issue
- Suggest fixes for any failures found
