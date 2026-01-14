# Codebase Concerns

**Analysis Date:** 2026-01-14

## Overview

This is a **fresh Create Next App project** (boilerplate stage). The codebase is clean but lacks production-ready configuration.

## Tech Debt

**React Compiler Not Enabled:**
- File: `next.config.ts`
- Issue: Empty configuration, React Compiler not activated
- Why: Default Create Next App doesn't enable it
- Impact: Missing automatic memoization optimization
- Fix approach: Add `reactCompiler: true` to next.config.ts:
  ```typescript
  const nextConfig: NextConfig = {
    reactCompiler: true,
  };
  ```

**Default Metadata Values:**
- File: `app/layout.tsx` (lines 15-18)
- Issue: Using "Create Next App" as title/description
- Why: Template defaults not updated
- Impact: Poor SEO, unprofessional branding
- Fix approach: Update metadata to reflect actual project:
  ```typescript
  export const metadata: Metadata = {
    title: "IdeaToPRD",
    description: "AI-powered PRD generator",
  };
  ```

## Known Bugs

*No bugs detected - this is a fresh boilerplate with no custom logic.*

## Security Considerations

**Firebase Debug Log in Git:**
- File: `firebase-debug.log`
- Risk: Contains user email (tmdgns893758@gmail.com) and auth tokens
- Current mitigation: None (file is tracked)
- Recommendations:
  1. Add to `.gitignore`: `firebase-debug.log`
  2. Remove from git history: `git rm --cached firebase-debug.log`

**No Environment Variable Template:**
- File: Project root (missing `.env.example`)
- Risk: Developers may commit secrets if no template exists
- Current mitigation: None
- Recommendations: Create `.env.example` with required variable names (no values)

## Performance Bottlenecks

*No performance issues - minimal boilerplate code.*

## Fragile Areas

*No fragile areas - no custom logic implemented yet.*

## Scaling Limits

*Not applicable - no production deployment.*

## Dependencies at Risk

*All dependencies are current and maintained:*
- Next.js 16.1.1 (latest)
- React 19.2.3 (latest)
- Tailwind CSS 4.x (latest)
- TypeScript 5.x (latest)

## Missing Critical Features

**Testing Infrastructure:**
- Problem: No test framework, no tests
- Current workaround: Manual testing only
- Blocks: TDD workflow, CI/CD quality gates
- Implementation complexity: Low (install Vitest, add config)

**Environment Configuration:**
- Problem: No .env files or templates
- Current workaround: Hardcoded values (none yet)
- Blocks: Deployment, secrets management
- Implementation complexity: Low (create .env.example)

**Project Documentation:**
- Problem: No project-specific CLAUDE.md
- Current workaround: Relying on global instructions
- Blocks: Context-specific AI assistance
- Implementation complexity: Low (create CLAUDE.md)

## Test Coverage Gaps

**Entire Codebase:**
- What's not tested: Everything (no tests exist)
- Risk: Any future changes could break silently
- Priority: High (before adding features)
- Difficulty to test: Low (setup framework first)

## Recommendations Summary

### Immediate (before any development):
1. **Add `firebase-debug.log` to `.gitignore`** and remove from tracking
2. **Create `.env.example`** template file
3. **Enable React Compiler** in `next.config.ts`

### Short-term (before feature development):
4. **Configure Vitest** for testing
5. **Update metadata** in `app/layout.tsx`
6. **Create project CLAUDE.md** with specific instructions

### Long-term:
7. Set up CI/CD with GitHub Actions
8. Add error boundaries and `not-found.tsx`
9. Configure monitoring (Sentry or similar)

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
