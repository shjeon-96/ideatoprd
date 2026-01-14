# Architecture

**Analysis Date:** 2026-01-14

## Pattern Overview

**Overall:** Next.js Full-Stack Web Application (App Router)

**Key Characteristics:**

- Server-side rendering with React Server Components
- File-based routing via `app/` directory
- Monolithic deployment (client + server in single package)
- Minimal current implementation (boilerplate stage)

## Layers

**Presentation Layer:**

- Purpose: UI rendering and user interaction
- Contains: React components (TSX files)
- Location: `app/page.tsx`, `app/layout.tsx`
- Depends on: Next.js primitives (Image, Metadata)
- Used by: Browser/client

**Configuration Layer:**

- Purpose: Build and runtime configuration
- Contains: TypeScript, ESLint, PostCSS, Next.js configs
- Location: Root config files (`tsconfig.json`, `next.config.ts`, etc.)
- Depends on: Nothing (foundational)
- Used by: Build tools, dev server

## Data Flow

**Page Render (Current Implementation):**

1. User navigates to `/`
2. Next.js App Router matches `app/page.tsx`
3. Server renders React component
4. HTML sent to client
5. React hydrates for interactivity

**State Management:**

- No client state management configured
- Server components render statically
- No data fetching implemented yet

## Key Abstractions

**Page Component:**

- Purpose: Route handler and UI renderer
- Examples: `app/page.tsx` (Home)
- Pattern: Default export function component

**Layout Component:**

- Purpose: Shared UI wrapper across routes
- Examples: `app/layout.tsx` (RootLayout)
- Pattern: Children prop wrapper with metadata

**Metadata:**

- Purpose: SEO and document head configuration
- Examples: `export const metadata` in `app/layout.tsx`
- Pattern: Next.js Metadata API

## Entry Points

**Root Layout:**

- Location: `app/layout.tsx`
- Triggers: Every page render
- Responsibilities: HTML structure, fonts, global CSS, metadata

**Home Page:**

- Location: `app/page.tsx`
- Triggers: Navigation to `/`
- Responsibilities: Landing page UI

**Dev Server:**

- Location: `npm run dev`
- Triggers: Development command
- Responsibilities: Hot reload, dev tooling

## Error Handling

**Strategy:** Not yet implemented (boilerplate stage)

**Patterns:**

- Next.js built-in error boundaries (not customized)
- No `error.tsx` or `not-found.tsx` files present

## Cross-Cutting Concerns

**Styling:**

- Tailwind CSS v4 utilities
- CSS variables for theming (`app/globals.css`)
- Dark mode via `prefers-color-scheme` media query

**Fonts:**

- Next.js Google Fonts API (`next/font/google`)
- Geist (sans-serif) and Geist_Mono fonts
- Automatic font optimization

**Linting:**

- ESLint 9 flat config
- Next.js Core Web Vitals rules
- TypeScript ESLint rules

---

_Architecture analysis: 2026-01-14_
_Update when major patterns change_
