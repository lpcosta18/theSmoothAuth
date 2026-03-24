# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 authentication project using Clerk for authentication and Supabase as a PostgreSQL database (not using Supabase Auth). The project follows a modern stack with Next.js App Router, TypeScript, shadcn/ui, and Server Actions. The frontend UI is in Portuguese (PT-PT) while backend/database uses English.

## Development Commands

**Package manager:** npm (Node.js 18+ required)

**Development workflow:**
- `npm run dev` - Start development server (port 3000, frequently occupied on this system)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

**Database operations:**
- Apply Supabase migrations via Supabase Dashboard SQL Editor
- Run SQL migrations from `supabase/migrations/001_create_profiles_table.sql`
- No Supabase CLI required - use web interface

**Troubleshooting commands:**
- Kill processes on port 3000: `wmic process where processid=<PID> delete` (Windows)
- Clean build cache: Delete `.next` directory when encountering Turbopack compilation errors

## Architecture

### Key Technologies
- **Next.js 16.1.6** with App Router for routing and rendering
- **Clerk (@clerk/nextjs v6.0.0)** for authentication (login, registration, session management)
- **Supabase (@supabase/supabase-js v2.45.0)** as PostgreSQL database only (not using Supabase Auth)
- **shadcn/ui** for UI components with Tailwind CSS
- **React Hook Form + Zod** for form validation
- **Server Actions** for data mutations
- **Sonner** for toast notifications
- **Portuguese localization** (@clerk/localizations ptPT)

### Project Structure
```
src/
├── app/
│   ├── (auth)/                          # Authentication routes (Clerk hosted pages)
│   │   ├── recover/page.tsx             # Password recovery
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/                     # Protected dashboard routes
│   │   ├── home/page.tsx                # Dashboard home
│   │   └── profile/page.tsx             # User profile
│   ├── api/webhooks/clerk/route.ts      # Clerk webhook endpoint
│   ├── layout.tsx                       # Root layout with ClerkProvider
│   └── globals.css
├── components/
│   ├── ui/                              # shadcn/ui components (avatar, button, card, etc.)
│   └── user/                            # User-related components (UserMenu, UserProfileForm)
├── lib/
│   ├── supabase/client.ts               # Supabase client with TypeScript types
│   ├── clerk/server.ts                  # Clerk server helpers
│   ├── db/profiles.ts                   # Database operations for profiles
│   └── schemas/profile.ts               # Zod validation schemas
├── actions/                             # Server Actions
│   └── profile.ts                       # Profile-related Server Actions
└── middleware.ts                        # Clerk middleware (currently disabled due to auth().protect() error)
```

### Authentication Flow
1. **Clerk handles all authentication** - users, sessions, passwords, emails
2. **Supabase stores user profiles** - synchronized via Clerk webhooks (`/api/webhooks/clerk`)
3. **Middleware protects routes** - using Clerk's `clerkMiddleware` with public routes defined (note: `auth().protect()` is currently commented out due to function error)
4. **Server Actions verify auth** - using `await auth()` from Clerk before DB operations
5. **Portuguese localization** - Clerk UI and messages in PT-PT

### Data Flow Architecture
1. **User Registration**: Clerk creates user → Webhook triggers `createProfileForUser()` → Profile created in Supabase
2. **User Login**: Clerk authenticates → `await auth()` in Server Components → Profile data fetched from Supabase
3. **Profile Updates**: Form submits to Server Action → `await auth()` verifies user → `updateProfile()` in Supabase
4. **Webhook Sync**: Clerk events (`user.created`, `user.updated`) → Webhook endpoint → Updates Supabase profiles
5. **Profile Data Loading**: Client components call Server Actions → Server Actions return data directly (not `{ data, error }` pattern)

### Database Schema
- `profiles` table with `clerk_user_id` as foreign key to Clerk users (see `supabase/migrations/001_create_profiles_table.sql`)
- Row Level Security (RLS) policies as extra security layer (permissive policies, main security via Clerk)
- Automatic `updated_at` timestamp via PostgreSQL trigger
- Clerk webhook syncs user data to Supabase on `user.created`, `user.updated`
- TypeScript types defined in `src/lib/supabase/client.ts`

### Key File Responsibilities
- `src/lib/supabase/client.ts`: Supabase client configuration and TypeScript types
- `src/lib/db/profiles.ts`: Database operations (CRUD) with `await auth()` verification
- `src/actions/profile.ts`: Server Actions for client-facing profile operations (returns data directly, not `{ data, error }`)
- `src/app/layout.tsx`: Root layout with `ClerkProvider` and Portuguese localization
- `src/app/api/webhooks/clerk/route.ts`: Webhook endpoint for Clerk → Supabase sync

### Important Patterns

1. **Language Separation**
   - Frontend UI: **PT-PT** (Portuguese - Portugal) - comments, UI text, Clerk localization
   - Backend/DB: **EN** (English for tables, columns, functions, variable names)

2. **Security First**
   - Always verify authentication via `await auth()` in Server Actions
   - Use `clerk_user_id` to filter database queries
   - Validate webhook signatures for Clerk → Supabase sync
   - Supabase client configured without auth persistence (Clerk handles auth)

3. **Type Safety**
   - Use TypeScript strictly (no `any` types)
   - Validate all inputs with Zod schemas (`src/lib/schemas/`)
   - Define clear interfaces for data structures (see `Database` type in `client.ts`)

4. **Component Architecture**
   - Server Components for data fetching and DB operations
   - Client Components for interactive UI with `'use client'` directive
   - Use shadcn/ui components for consistent design
   - Skill usage marked with `// ✅ Skill: <skill-name>` comments

5. **Known Issues & Workarounds**
   - `auth().protect()` function error in middleware - **Workaround**: Middleware currently disabled
   - Port 3000 frequently occupied - **Workaround**: Kill processes or use different port
   - **Turbopack CSS compilation error** - **Workaround**: Simplified `globals.css` to avoid complex `@layer` syntax
   - **Portuguese localization import** - **Fixed**: `ptPT` imported from `@clerk/localizations`
   - **Clerk component child errors** - **Workaround**: Use `SignOutButton` instead of custom `UserButton` children
   - **Cookies.delete() TypeError** - **Workaround**: Profile functions return `null` instead of throwing
   - **Auto-profile creation**: `getProfile()` in `lib/db/profiles.ts` creates basic profile if not found
   - **Profile data not showing after update** - **Issue**: `UserProfileForm` incorrectly expects `{ data, error }` pattern from `getCurrentProfile()` but it returns `Profile | null` directly. **Workaround**: Fix form data loading pattern.

### Available Skills

This project has several Claude Code skills available in `.agents/skills/`:

- **clerk/** - Official Clerk + Next.js integration patterns
- **clerk-custom-ui/** - Custom UI components for Clerk
- **clerk-nextjs-patterns/** - Next.js-specific Clerk patterns
- **clerk-setup/** - Clerk setup and configuration
- **clerk-testing/** - Testing Clerk integrations
- **clerk-webhooks/** - Clerk webhook implementations
- **frontend-design/** - UI design with shadcn/ui and accessibility
- **next-best-practices/** - Next.js App Router best practices
- **supabase-postgres-best-practices/** - PostgreSQL optimization and RLS

### Code Generation Rules

When generating code for this project:
1. Use official patterns from available skills when applicable
2. Prioritize Server Components for database operations
3. Validate all inputs with Zod + TypeScript
4. Include Portuguese (PT-PT) comments only for complex logic
5. Follow naming conventions: camelCase for JS/TS, snake_case for SQL
6. Mark skill usage with `// ✅ Skill: <skill-name>` comments
7. Use `@clerk/nextjs` v6.0.0 API patterns (note: `auth().protect()` has issues)
8. Configure Supabase client without auth persistence (Clerk handles auth)
9. Server Actions should return data directly, not `{ data, error }` patterns (see `getCurrentProfile()` vs `UserProfileForm` mismatch)

### Environment Variables

Required environment variables (see `.env.local.example`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Clerk redirect URLs
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Post-auth redirects
- `NEXT_PUBLIC_APP_URL` - Application base URL
- `CLERK_WEBHOOK_SECRET` - Optional for Clerk webhook verification

### Next.js Configuration

- `next.config.js`: Configured for Clerk and Supabase image domains
- Server Actions enabled with 2MB body size limit
- TypeScript path alias `@/*` maps to `src/*`
- Tailwind CSS with `tailwindcss-animate` plugin

### Development Notes

- **Working implementation** - Code exists and runs (with middleware disabled)
- **Clerk v6.0.0 compatibility issues** - `auth().protect()` function error persists across versions
- **Database sync via webhooks** - Clerk → Supabase sync critical for data consistency
- **Portuguese frontend** - All UI text and Clerk localization in PT-PT
- **Port 3000 conflicts** - Frequent port occupation requires killing Node.js processes
- **Turbopack CSS issues** - Complex CSS with `@layer` syntax causes Turbopack crashes. Use simplified CSS.
- **Import corrections needed** - `ptPT` must be imported from `@clerk/localizations`, not `@clerk/nextjs`
- **Clean builds** - Delete `.next` directory when encountering Turbopack compilation errors
- **Server Actions pattern** - Database operations in `lib/db/`, Server Actions in `src/actions/`
- **Clerk component patterns** - `UserButton` and `UserProfile` in v6.0.0 don't accept custom children. Use `SignOutButton` instead for custom logout UI.
- **Cookies API issue** - Clerk v6.0.0 has `cookies().delete()` compatibility problem with Next.js
- **Profile retrieval** - `getCurrentProfile()` returns `Profile | null` for missing/unauthenticated profiles with better error handling
- **Auto-profile creation** - `getProfile()` in `lib/db/profiles.ts` automatically creates basic profile if not found
- **Error handling** - Improved error messages with specific error codes and debugging information
- **Profile form data loading** - `UserProfileForm` incorrectly expects `{ data, error }` pattern from `getCurrentProfile()` but it returns `Profile | null` directly