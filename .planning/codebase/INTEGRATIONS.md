# External Integrations

**Analysis Date:** 2026-01-14

## APIs & External Services

**Payment Processing:**

- Not detected

**Email/SMS:**

- Not detected

**External APIs:**

- None integrated yet
- External links only: Vercel, Next.js docs (static hrefs in `app/page.tsx`)

## Data Storage

**Databases:**

- Not detected
- No database client or ORM installed

**File Storage:**

- Not detected

**Caching:**

- Not detected

## Authentication & Identity

**Auth Provider:**

- Not detected

**OAuth Integrations:**

- Not detected

**Session Management:**

- Not implemented

## Monitoring & Observability

**Error Tracking:**

- Not detected

**Analytics:**

- Not detected

**Logs:**

- Not detected
- Using Next.js default console output

## CI/CD & Deployment

**Hosting:**

- Vercel (recommended in `README.md`)
- Not yet deployed

**CI Pipeline:**

- Not configured
- No GitHub Actions workflows

## Environment Configuration

**Development:**

- No `.env` files detected
- No `.env.example` template
- No environment variables required (currently)

**Staging:**

- Not configured

**Production:**

- Not configured

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- None

## Firebase Integration (Detected but Not Implemented)

**Status:** CLI Initialized, SDK Not Integrated

**Evidence:**

- `firebase-debug.log` present in project root
- Firebase CLI authenticated (tmdgns893758@gmail.com)

**Configuration Status:**

- Firebase CLI initialized
- No Firebase SDK in `package.json`
- No `lib/firebase/` client code
- No Firebase configuration in codebase

**Future Integration (from `docs/plan.md`):**

- Firebase Auth - User authentication
- Firestore - NoSQL database
- Firebase Admin SDK - Server-side operations

## Planned Integrations (from docs/plan.md)

The PRD document outlines planned integrations:

**Authentication:**

- NextAuth.js + Google OAuth
- Firebase Auth

**Database:**

- Firebase Firestore (NoSQL)

**AI Services:**

- Anthropic Claude API (PRD generation)

**Payments:**

- Lemon Squeezy (credit purchases)

**Required Environment Variables (future):**

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
ANTHROPIC_API_KEY
LEMONSQUEEZY_API_KEY
LEMONSQUEEZY_WEBHOOK_SECRET
NEXTAUTH_URL
NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## Action Required

Before implementing features:

1. **Create `.env.example`** with required variables
2. **Add to `.gitignore`:**
   ```
   firebase-debug.log
   .firebase/
   .firebaserc
   ```
3. **Install Firebase SDK** when ready:
   ```bash
   npm install firebase firebase-admin
   ```

---

_Integration audit: 2026-01-14_
_Update when adding/removing external services_
