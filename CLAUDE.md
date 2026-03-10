# CLAUDE.md - Project Guide

## Project Overview

CCTV Prakasam Portal - A Hono-based backend API server for a CCTV portal system with authentication, database, email services, and file storage.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Hono + @hono/node-server
- **Language**: TypeScript (strict mode, ESNext target)
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Valibot
- **Auth**: JWT (Hono JWT, HS256, 30d access / 90d refresh tokens)
- **Email**: Brevo API
- **File Storage**: Cloudflare R2
- **Env Management**: @dotenvx/dotenvx

## Commands

- `npm run dev` - Development server (tsx watch)
- `npm start` - Production server
- `npm run build` - TypeScript compilation (`tsc`)
- `npm run lint` - ESLint check
- `npm run lint:fix` - ESLint auto-fix
- `npm run migrations:gen` - Generate Drizzle migrations
- `npm run migrations:apply` - Apply migrations
- `npm run db:studio` - Drizzle Studio UI
- `npm run seed` - Seed database

## Project Structure

```
src/
  index.ts              # Entry point - Hono server setup
  env.ts                # Environment validation (Valibot)
  config/               # App, DB, email, JWT, Google OAuth configs
  constants/            # Message constants
  db/
    configuration.ts    # Drizzle ORM setup
    schema/             # Table definitions (users.ts)
  exceptions/           # Custom exception hierarchy (BaseException -> 400/401/403/404/409/422)
  middlewares/          # Auth middleware (isAuthorized)
  services/
    http.ts             # Fetch wrapper utilities
    db/baseDbService.ts # Comprehensive CRUD operations
    brevo/              # Email service
  types/                # TypeScript types (app.types.ts, db.types.ts)
  utils/                # JWT, DB query builders, response helpers, file naming
  validations/          # Request validation, custom validators
```

## Code Style & Conventions

- **ESLint**: @antfu/eslint-config (flat config)
- **Quotes**: Double quotes
- **Semicolons**: Required
- **Indent**: 2 spaces
- **Filename**: camelCase
- **Imports**: Type imports must use `import type { ... }`
- **Console**: Warns (use proper logging)
- **Process env**: Only access via config files (node/no-process-env enforced)
- **Regex**: Module-scoped (e18e/prefer-static-regex)
- **perfectionist/sort-imports**: Currently disabled due to plugin compatibility issue

## Database

- PostgreSQL with Drizzle ORM
- Migrations in `./migrations/`
- Schema files in `src/db/schema/`
- SSL via `ca.pem`

## Environment Variables

Required (validated at startup via Valibot):

- NODE_ENV, API_VERSION, PORT, COOKIE_DOMAIN
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET, BREVO_API_KEY
- API_BASE_URL, APP_BASE_URL, SCOPE

## Key Patterns

- Standardized error responses via custom exception classes
- `sendSuccessResp()` for consistent success responses
- Base DB service with generic CRUD, pagination, soft delete
- JWT middleware sets `user_payload` in Hono context
- Environment validated at startup - app won't start with missing vars
