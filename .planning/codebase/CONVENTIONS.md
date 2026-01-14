# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**

- kebab-case for config files: `next.config.ts`, `postcss.config.mjs`
- lowercase for Next.js files: `page.tsx`, `layout.tsx`, `globals.css`
- Test files: Not established (no tests yet)

**Functions:**

- PascalCase for React components: `RootLayout`, `Home`
- camelCase for variables: `geistSans`, `geistMono`

**Variables:**

- camelCase: `geistSans`, `geistMono`, `nextConfig`
- UPPER_SNAKE_CASE for constants: Not observed yet

**Types:**

- PascalCase: `Metadata`, `NextConfig`
- Type imports: `import type { Metadata } from "next"`

## Code Style

**Formatting:**

- 2-space indentation (Next.js default)
- Double quotes for strings: `"next"`, `"./globals.css"`
- Semicolons: Used consistently
- No trailing commas observed

**Linting:**

- ESLint 9 flat config: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals`
- Extends: `eslint-config-next/typescript`
- Run: `npm run lint`

**No Prettier:**

- No `.prettierrc` or prettier config detected
- Relies on ESLint defaults

## Import Organization

**Order (inferred from `app/layout.tsx`):**

1. Type imports: `import type { Metadata } from "next"`
2. External packages: `import { Geist } from "next/font/google"`
3. Relative imports: `import "./globals.css"`

**Grouping:**

- Type imports separated
- No blank lines between import groups

**Path Aliases:**

- `@/*` maps to project root (`tsconfig.json`)
- Not yet used in codebase

## Error Handling

**Patterns:**

- Not established (boilerplate only)
- Next.js built-in error boundaries

**Error Types:**

- No custom error handling implemented

## Logging

**Framework:**

- No logging framework detected
- Console methods available but not used

**Patterns:**

- No logging patterns established

## Comments

**When to Comment:**

- Not established (minimal code, no comments needed)

**JSDoc/TSDoc:**

- Not used in current files

**TODO Comments:**

- None present

## Function Design

**Size:**

- Components are small (under 100 lines each)
- `app/page.tsx`: 65 lines
- `app/layout.tsx`: 34 lines

**Parameters:**

- React component props with TypeScript annotations
- Example: `{ children }: Readonly<{ children: React.ReactNode }>`

**Return Values:**

- JSX elements for components
- Explicit return statements

## Module Design

**Exports:**

- Default exports for page components: `export default function Home()`
- Named exports for metadata: `export const metadata: Metadata`

**Component Pattern:**

- Function components (no class components)
- TypeScript annotations on props

**Next.js Conventions:**

- `export const metadata` for page metadata
- Default export for page component

## TypeScript Settings

**From `tsconfig.json`:**

- `strict: true` - Full type checking
- `noEmit: true` - Only type checking, no output
- `esModuleInterop: true` - CommonJS compatibility
- `allowJs: true` - Allow JavaScript files
- `skipLibCheck: true` - Skip type checking of .d.ts
- `isolatedModules: true` - Required for build tools

**Path Mapping:**

- `@/*` → `./*` (project root alias)

---

_Convention analysis: 2026-01-14_
_Update when patterns change_
