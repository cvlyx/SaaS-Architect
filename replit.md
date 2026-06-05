# Organization OS — Multi-tenant SaaS Platform

Industry-pack dashboards with organizations, users, subscriptions, and role-based access control.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 3001)
- `pnpm --filter @workspace/org-os run dev` — run the frontend (port 5174)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema to Turso (dev only)
- `pnpm --filter @workspace/db run seed` — seed industry packs and subscription plans

## Required env vars

| Variable | Description |
|---|---|
| `DATABASE_URL` | Turso/libSQL connection string (e.g. `libsql://org-name.aws-region.turso.io`) |
| `TURSO_AUTH_TOKEN` | Turso database auth token |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CORS_ORIGIN` | Allowed CORS origin (default: http://localhost:5174) |

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 with helmet, rate-limit, CORS
- DB: Turso (libSQL/SQLite) + Drizzle ORM
- Auth: JWT (jsonwebtoken), bcryptjs password hashing
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React 19, Vite, Tailwind CSS, shadcn/ui, framer-motion, wouter, TanStack Query

## Where things live

| Path | Contents |
|---|---|
| `artifacts/api-server/src/` | Express app, routes, middleware |
| `artifacts/org-os/src/` | React frontend |
| `lib/db/src/schema/` | Drizzle ORM table definitions (SQLite) |
| `lib/api-spec/` | OpenAPI specification + Orval codegen |
| `lib/api-zod/` | Shared Zod schemas extracted from spec |
| `lib/api-client-react/` | Generated React Query hooks |

## Auth

- POST `/api/auth/register` — create account, returns `{ token, user }`
- POST `/api/auth/login` — authenticate, returns `{ token, user }`
- Token stored in localStorage, passed as `Authorization: Bearer <token>` header
- Protected routes use `authMiddleware` JWT verification
- Role-based access via `requireRole(...roles)` middleware

## Architecture decisions

- Foreign keys defined in Drizzle schema with `references()` for DB-level integrity
- Industry pack ID set from org auto-selection during registration
- Skeleton loading replaces spinner spinners for perceived performance
- Optimistic updates on create mutations with rollback on error

## Gotchas

- Always run `drizzle-kit push` after schema changes to sync the database
- JWT_SECRET must be set in production; dev fallback is `"dev-secret-change-in-production"`
