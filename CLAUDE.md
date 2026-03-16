# CLAUDE.md - Project Guide

## Project Overview

CCTV AP Prakasam Portal - A full-stack digital news YouTube channel website. Hono backend API + React 19 frontend SPA served from the same server. Features YouTube video sync, admin dashboard, role-based access, dark/light theme, and Telugu language support.

## Tech Stack

### Backend

- **Runtime**: Node.js (ESM)
- **Framework**: Hono + @hono/node-server
- **Language**: TypeScript (strict mode, ESNext target)
- **Database**: PostgreSQL via Drizzle ORM (SSL via `ca.pem`)
- **Validation**: Valibot (async-capable schemas)
- **Auth**: JWT (HS256, 30d access / 90d refresh tokens), bcryptjs password hashing
- **Email**: Brevo API (verification, password reset, notifications)
- **File Storage**: Cloudflare R2
- **Env Management**: @dotenvx/dotenvx

### Frontend

- **Framework**: React 19 (strict mode)
- **Routing**: TanStack Router (nested layouts, protected routes)
- **Server State**: TanStack React Query v5
- **Styling**: Tailwind CSS v4 with CSS custom properties for theming
- **Icons**: Lucide React
- **Build**: Vite 6

## Commands

### Backend (project root)

- `npm run dev` - Development server (tsx watch)
- `npm start` - Production server
- `npm run build` - TypeScript compilation (`tsc`)
- `npm run lint` - ESLint check
- `npm run lint:fix` - ESLint auto-fix
- `npm run migrations:gen` - Generate Drizzle migrations
- `npm run migrations:apply` - Apply migrations
- `npm run db:studio` - Drizzle Studio UI
- `npm run seed` - Seed database

### Frontend (`web/`)

- `cd web && npm run dev` - Vite dev server (port 5173, proxies /api to :3000)
- `cd web && npm run build` - TypeScript check + Vite bundle (output: `web/dist/`)

## Project Structure

```
src/                                  # Backend
  index.ts                            # Hono server, CORS, static file serving
  env.ts                              # Environment validation (Valibot)
  routes.ts                           # Central route aggregation
  config/                             # App, DB, email, JWT, YouTube, Google OAuth configs
  constants/appMessages.ts            # All user-facing message constants
  db/
    configuration.ts                  # Drizzle ORM + node-postgres setup
    schema/                           # 7 tables: users, videos, categories,
                                      #   breakingNews, newsletterSubscribers,
                                      #   featuredContent, settings
  exceptions/                         # BaseException -> Bad400/Unauth401/Forbidden403/
                                      #   NotFound404/Conflict409/Unprocessable422/
                                      #   BrevoError/S3Error/GoogleOauth
  middlewares/                        # isAuthorized, isAdmin, isManager
  modules/                            # Feature modules (each has controller/service/routes/validation)
    auth/                             # Register, login, refresh, forgot/reset password, verify email
    videos/                           # CRUD + public listing, channel-stats endpoint
    categories/                       # CRUD + dynamic video_count via SQL subquery
    breakingNews/                     # CRUD for news ticker
    newsletter/                       # Subscribe/unsubscribe management
    featuredContent/                   # Featured sections management
    settings/                         # Key-value app settings
    contact/                          # Contact form + email notification
    dashboard/                        # Stats, user management, role assignment
    youtube/                          # YouTube Data API sync (auto-featured, auto-trending, category counts)
  services/
    http.ts                           # Fetch wrapper (httpGet)
    db/baseDbService.ts               # Generic CRUD, pagination, soft delete, complex queries
    brevo/brevoEmailService.ts        # Transactional email via Brevo API
  types/                              # app.types.ts (User, JWT, Pagination), db.types.ts (query types)
  utils/                              # jwtUtils, respUtils, dbUtils, appUtils
  validations/                        # validateRequest, customValidations, prepareValibotIssue

web/src/                              # Frontend
  main.tsx                            # React 19 root
  App.tsx                             # QueryClient + Router providers
  router.tsx                          # TanStack Router: public layout, admin bare, admin protected
  config/api.ts                       # API_BASE_URL = "/api"
  stores/
    authStore.ts                      # useSyncExternalStore: user info in localStorage
    themeStore.ts                     # Dark/light mode toggle, persisted
  lib/
    apiClient.ts                      # apiGet/Post/Put/Delete, auto JWT, 401 refresh+retry
    auth.ts                           # Token management (localStorage)
    queryClient.ts                    # TanStack Query config (5min stale, 1 retry)
    format.ts                         # Date/number formatting
  hooks/
    useAuth.ts                        # Login, register, logout, forgot/reset password mutations
    useVideos.ts                      # Public video queries (paginated, featured)
    useCategories.ts                  # Category list query
    useBreakingNews.ts                # Breaking news query
    useNewsletter.ts                  # Subscribe mutation
    useAdminDashboard.ts              # Dashboard stats query
    useAdminVideos.ts                 # Video CRUD + YouTube sync mutation
    useAdminCategories.ts             # Category CRUD hooks
    useAdminBreakingNews.ts           # Breaking news CRUD hooks
    useAdminNewsletter.ts             # Newsletter management hooks
    useAdminFeatured.ts               # Featured content hooks
    useAdminUsers.ts                  # User management hooks
    useAdminSettings.ts               # Settings hooks
  components/
    admin/                            # AdminLayout, AdminSidebar (role-filtered), BarChart, StatsCard, DataTable
    layout/                           # Navbar (login/logout/dashboard), Footer, BreakingTicker
    ui/                               # VideoCard, SectionHead, ThemeToggle
  pages/
    Home.tsx                          # Featured Story, Latest Updates, Browse Categories, Trending
    Videos.tsx                        # Paginated grid with category filter
    VideoDetail.tsx                   # Video detail + share buttons + related videos
    About.tsx                         # Real YouTube channel stats from API
    Contact.tsx                       # Contact form with validation
    Register.tsx, ForgotPassword.tsx, ResetPassword.tsx
    admin/
      Login.tsx                       # Admin login
      Dashboard.tsx                   # Stats cards + weekly video chart
      ManageVideos.tsx                # Card/table view toggle, YouTube sync
      ManageCategories.tsx, ManageBreakingNews.tsx, ManageNewsletter.tsx
      ManageUsers.tsx                 # User list with role badges
      FeaturedContent.tsx, Settings.tsx
  styles/globals.css                  # CSS variables for light/dark themes
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

## Database Schema

7 tables in `src/db/schema/`:

- **users** - id, customer_id, first_name, last_name, email, phone, password_hash, user_type (CUSTOMER/MANAGER/ADMIN), active, is_verified, verification_token, reset_token, profile_pic, date_of_birth, gender, aadhaar, address, state, occupation, bio, timestamps, deleted_at (soft delete)
- **videos** - id, youtube_id (unique), title, title_te (Telugu), description, category_id (FK), thumbnail_url, duration, view_count, published_at, is_featured, is_trending, is_active, timestamps
- **categories** - id, name, name_te, slug (unique), icon, color, video_count, sort_order, is_active, timestamps
- **breakingNews** - id, text, text_te, is_active, sort_order, timestamps
- **newsletterSubscribers** - id, email (unique), status, timestamps
- **featuredContent** - id, type, video_id (FK), title, is_active, sort_order, timestamps
- **settings** - id, key (unique), value, description, timestamps

## API Routes

```
Public:
  POST /api/auth/register|login|refresh-token|forgot-password|reset-password|verify-email|logout
  GET  /api/videos?page=&page_size=&category=&sort=       # Paginated, filterable
  GET  /api/videos/:id
  GET  /api/videos/channel-stats                           # Real YouTube subscriber/view/video counts
  GET  /api/categories
  GET  /api/breaking-news
  GET  /api/settings
  POST /api/contact
  POST /api/newsletter/subscribe

Admin (isAuthorized + isManager):
  GET/POST/PUT/DELETE /api/admin/videos
  GET/POST/PUT/DELETE /api/admin/categories
  GET/POST/PUT/DELETE /api/admin/breaking-news
  GET/POST/PUT/DELETE /api/admin/newsletter
  GET/POST/PUT/DELETE /api/admin/featured-content
  GET/PUT              /api/admin/settings
  GET  /api/admin/dashboard/stats
  GET  /api/admin/dashboard/users
  PUT  /api/admin/dashboard/users/:id/role
  POST /api/admin/youtube/sync-youtube                     # Sync videos from YouTube channel
```

## Environment Variables

Required (validated at startup via Valibot):

- NODE_ENV, API_VERSION, PORT, COOKIE_DOMAIN
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- JWT_SECRET, BREVO_API_KEY
- API_BASE_URL, APP_BASE_URL, SCOPE
- YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID

## Key Patterns

- **Error responses**: Custom exception classes (400-422) with standardized JSON format
- **Success responses**: `sendSuccessResp()` helper for consistent structure
- **Base DB service**: Generic CRUD with pagination, soft delete, complex WHERE/ORDER BY builders
- **JWT auth flow**: isAuthorized middleware sets `user_payload` in Hono context; isManager/isAdmin for role checks
- **Token refresh**: Frontend apiClient auto-retries on 401 with refreshed token
- **Auth store**: `useSyncExternalStore` pattern persisting user info to localStorage (no Redux/Zustand)
- **Theme**: CSS custom properties in globals.css, toggled via themeStore
- **YouTube sync**: Fetches channel videos via YouTube Data API, auto-sets featured (6 most recent), trending (6 highest views), updates category video_count
- **Category counts**: Dynamic SQL subquery in categories service (not static column)
- **Frontend serves from backend**: Static files from `./web/dist` with SPA fallback in production
- **Roles**: CUSTOMER, MANAGER, ADMIN - sidebar nav items filtered by role
- **Telugu support**: title_te, name_te, text_te fields for bilingual content
