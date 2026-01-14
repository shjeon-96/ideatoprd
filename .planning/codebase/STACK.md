# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**

- TypeScript 5.x - All application code (`tsconfig.json`)

**Secondary:**

- JavaScript - Config files (ESLint, PostCSS)

## Runtime

**Environment:**

- Node.js (system default, no .nvmrc)
- ES2017 target (`tsconfig.json`)

**Package Manager:**

- npm (lockfile version 3)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**

- Next.js 16.1.1 - Full-stack React framework (`package.json`)
- React 19.2.3 - UI library (`package.json`)
- React DOM 19.2.3 - DOM rendering (`package.json`)

**Testing:**

- Not configured (no Vitest or Jest)

**Build/Dev:**

- Turbopack - Built into Next.js for bundling
- TypeScript 5.x - Compilation to JavaScript (`package.json`)

## Key Dependencies

**Critical:**

- next 16.1.1 - App Router, SSR, API routes
- react 19.2.3 - Component rendering
- react-dom 19.2.3 - DOM manipulation

**Styling:**

- tailwindcss ^4 - Utility-first CSS (`package.json`)
- @tailwindcss/postcss ^4 - PostCSS integration (`package.json`)

**Dev Dependencies:**

- typescript ^5 - Type checking
- eslint ^9 - Code linting
- eslint-config-next 16.1.1 - Next.js ESLint rules
- @types/node ^20 - Node.js type definitions
- @types/react ^19 - React type definitions
- @types/react-dom ^19 - React DOM type definitions

## Configuration

**Environment:**

- No .env files detected
- Configuration via next.config.ts (currently empty)

**Build:**

- `next.config.ts` - Next.js configuration (minimal)
- `tsconfig.json` - TypeScript compiler options (strict mode)
- `postcss.config.mjs` - PostCSS with Tailwind
- `eslint.config.mjs` - ESLint flat config format

**TypeScript Settings:**

- Strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` maps to project root
- JSX: react-jsx (new transform)

## Platform Requirements

**Development:**

- Any platform with Node.js
- No external dependencies (Docker not required)

**Production:**

- Vercel (recommended, referenced in README)
- Any Node.js hosting platform

---

_Stack analysis: 2026-01-14_
_Update after major dependency changes_
