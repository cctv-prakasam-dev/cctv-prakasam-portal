# CCTV PRAKASAM — COMPLETE BUILD INSTRUCTIONS FOR CLAUDE CODE

# ═══════════════════════════════════════════════════════════

# This is the SINGLE SOURCE OF TRUTH for building this project.

# Read this file completely before starting any task.

# Execute tasks in the exact order listed under STEP-BY-STEP BUILD.

# The approved UI prototype is at: prototype/cctv-prakasam-v5-final.jsx

# Match every visual detail from that prototype.

# ═══════════════════════════════════════════════════════════

# 1. PROJECT OVERVIEW

# ═══════════════════════════════════════════════════════════

Project: CCTV Prakasam — Digital News YouTube Channel Website
Channel: https://www.youtube.com/@CctvPrakasam
Phone: +91 9032266619
Email: cctvprakasam@gmail.com
Office: RTC Bus Stand Backside, Mulaguntapadu, Singarayakonda,
Prakasam District, Andhra Pradesh, India — 523101

Categories: General News, Political News, Entertainment News,
Devotional News, Local News, Sports

# ═══════════════════════════════════════════════════════════

# 2. TECH STACK

# ═══════════════════════════════════════════════════════════

Backend (src/):

- Runtime: Node.js (ESM)
- Framework: Hono + @hono/node-server
- Language: TypeScript (strict)
- Database: PostgreSQL + Drizzle ORM
- Validation: Valibot
- Auth: JWT (HS256, 30d access / 90d refresh)
- Email: Brevo API
- File Storage: NOT NEEDED — YouTube hosts all video thumbnails,
  logo and CEO photo are static assets in web/src/assets/.
  The existing R2/S3 config in the codebase can stay but is unused.
- Env: @dotenvx/dotenvx

Frontend (web/):

- Framework: React 19
- Routing: TanStack Router
- Data Fetching: TanStack Query
- Styling: Tailwind CSS v4
- Icons: Lucide React
- Build: Vite

Both live in the SAME repository. In production, Hono serves
the built React app + API from a single port.

# ═══════════════════════════════════════════════════════════

# 3. EXISTING BACKEND STRUCTURE (DO NOT MODIFY THESE FILES)

# ═══════════════════════════════════════════════════════════

The following files ALREADY EXIST and are working. Use their patterns
for all new code. Do NOT modify them unless explicitly asked.

```
src/
├── index.ts                        # Server entry point
├── env.ts                          # Env validation (Valibot)
│
├── config/
│   ├── appConfig.ts
│   ├── dbConfig.ts
│   ├── emailConfig.ts
│   ├── jwtConfig.ts
│   └── googleScopeConfig.ts
│
├── constants/
│   └── appMessages.ts
│
├── db/
│   ├── configuration.ts            # Drizzle ORM + SSL
│   └── schema/
│       └── users.ts                # Only table so far
│
├── exceptions/
│   ├── baseException.ts
│   ├── badRequestException.ts      # 400
│   ├── unauthorizedException.ts    # 401
│   ├── forbiddenException.ts       # 403
│   ├── notFoundException.ts        # 404
│   ├── conflictException.ts        # 409
│   ├── unprocessableContentException.ts  # 422
│   ├── brevoErrorException.ts
│   ├── s3ErrorException.ts
│   └── googleOauthRequiredException.ts
│
├── middlewares/
│   └── isAuthorized.ts             # JWT auth middleware
│
├── services/
│   ├── http.ts                     # Fetch wrapper
│   ├── db/
│   │   └── baseDbService.ts        # Generic CRUD, pagination, soft delete
│   └── brevo/
│       └── brevoEmailService.ts
│
├── types/
│   ├── app.types.ts
│   └── db.types.ts
│
├── utils/
│   ├── jwtUtils.ts                 # Token generation/verification
│   ├── dbUtils.ts
│   ├── respUtils.ts                # sendSuccessResp()
│   └── appUtils.ts
│
└── validations/
    ├── validateRequest.ts
    ├── customValidations.ts
    └── prepareValibotIssue.ts
```

KEY PATTERNS TO FOLLOW:

- Use baseDbService for all database operations
- Use exception classes for error handling (BadRequestException, etc.)
- Use respUtils.sendSuccessResp() for all success responses
- Use validateRequest.ts + Valibot schemas for request validation
- Use isAuthorized.ts middleware for protected routes
- Use jwtUtils.ts for token operations
- Use brevoEmailService.ts for sending emails
- Config files are the ONLY place process.env is accessed

# ═══════════════════════════════════════════════════════════

# 4. TARGET PROJECT STRUCTURE (what to build)

# ═══════════════════════════════════════════════════════════

```
cctv-prakasam/
│
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── .env
├── PROJECT_BUILD.md                 # THIS FILE
│
├── prototype/
│   ├── cctv-prakasam-v5-final.jsx   # Approved UI prototype
│   └── assets/
│       ├── logo.png
│       └── ceo-photo.jpg
│
├── src/                             # ══ BACKEND ══
│   ├── index.ts                     # ✅ EXISTS — update to serve frontend
│   ├── env.ts                       # ✅ EXISTS
│   ├── routes.ts                    # NEW — mount all module routes
│   │
│   ├── config/                      # ✅ EXISTS + 1 new file
│   │   └── youtubeConfig.ts         # NEW
│   │
│   ├── db/schema/                   # ✅ users.ts exists + 7 new
│   │   ├── categories.ts            # NEW
│   │   ├── videos.ts                # NEW
│   │   ├── newsletterSubscribers.ts # NEW
│   │   ├── settings.ts              # NEW
│   │   ├── breakingNews.ts          # NEW
│   │   ├── featuredContent.ts       # NEW
│   │   └── index.ts                 # NEW — barrel export
│   │
│   ├── middlewares/
│   │   └── isAdmin.ts              # NEW — admin role check
│   │
│   └── modules/                     # NEW — all feature modules
│       ├── auth/
│       │   ├── auth.routes.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.validation.ts
│       ├── categories/
│       │   ├── categories.routes.ts
│       │   ├── categories.controller.ts
│       │   ├── categories.service.ts
│       │   └── categories.validation.ts
│       ├── videos/
│       │   ├── videos.routes.ts
│       │   ├── videos.controller.ts
│       │   ├── videos.service.ts
│       │   └── videos.validation.ts
│       ├── newsletter/
│       │   ├── newsletter.routes.ts
│       │   ├── newsletter.controller.ts
│       │   ├── newsletter.service.ts
│       │   └── newsletter.validation.ts
│       ├── breakingNews/
│       │   ├── breakingNews.routes.ts
│       │   ├── breakingNews.controller.ts
│       │   ├── breakingNews.service.ts
│       │   └── breakingNews.validation.ts
│       ├── featuredContent/
│       │   ├── featuredContent.routes.ts
│       │   ├── featuredContent.controller.ts
│       │   ├── featuredContent.service.ts
│       │   └── featuredContent.validation.ts
│       ├── settings/
│       │   ├── settings.routes.ts
│       │   ├── settings.controller.ts
│       │   ├── settings.service.ts
│       │   └── settings.validation.ts
│       ├── youtube/
│       │   ├── youtube.routes.ts
│       │   ├── youtube.controller.ts
│       │   └── youtube.service.ts
│       ├── contact/
│       │   ├── contact.routes.ts
│       │   ├── contact.controller.ts
│       │   └── contact.validation.ts
│       └── dashboard/
│           ├── dashboard.routes.ts
│           ├── dashboard.controller.ts
│           └── dashboard.service.ts
│
├── web/                             # ══ FRONTEND ══
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── router.tsx
│       ├── config/
│       │   └── api.ts
│       ├── lib/
│       │   ├── apiClient.ts
│       │   ├── queryClient.ts
│       │   └── auth.ts
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useVideos.ts
│       │   ├── useCategories.ts
│       │   ├── useBreakingNews.ts
│       │   ├── useNewsletter.ts
│       │   └── useTheme.ts
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── BreakingTicker.tsx
│       │   │   └── MobileMenu.tsx
│       │   ├── ui/
│       │   │   ├── VideoCard.tsx
│       │   │   ├── SectionHead.tsx
│       │   │   ├── CategoryCard.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   └── ThemeToggle.tsx
│       │   └── admin/
│       │       ├── AdminSidebar.tsx
│       │       ├── AdminLayout.tsx
│       │       ├── StatsCard.tsx
│       │       ├── DataTable.tsx
│       │       └── BarChart.tsx
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Videos.tsx
│       │   ├── VideoDetail.tsx
│       │   ├── About.tsx
│       │   ├── Contact.tsx
│       │   └── admin/
│       │       ├── Login.tsx
│       │       ├── Dashboard.tsx
│       │       ├── ManageVideos.tsx
│       │       ├── ManageCategories.tsx
│       │       ├── ManageNewsletter.tsx
│       │       ├── ManageUsers.tsx
│       │       ├── FeaturedContent.tsx
│       │       └── Settings.tsx
│       ├── stores/
│       │   └── themeStore.ts
│       ├── styles/
│       │   └── globals.css
│       └── assets/
│           ├── logo.png
│           └── ceo-photo.jpg
│
└── drizzle/
    └── migrations/
```

# ═══════════════════════════════════════════════════════════

# 5. DATABASE SCHEMA DEFINITIONS

# ═══════════════════════════════════════════════════════════

Follow the exact pattern of the existing src/db/schema/users.ts.
Use Drizzle ORM pgTable, serial/uuid, varchar, text, boolean,
timestamp, integer, etc.

TABLE: categories

- id: serial primary key
- name: varchar(100) not null — "General News"
- nameTe: varchar(200) — "జనరల్ న్యూస్" (Telugu)
- slug: varchar(100) unique not null — "general-news"
- icon: varchar(10) — "📰" (emoji)
- color: varchar(7) — "#0891B2" (hex)
- videoCount: integer default 0
- sortOrder: integer default 0
- isActive: boolean default true
- createdAt: timestamp defaultNow
- updatedAt: timestamp defaultNow

TABLE: videos

- id: serial primary key
- youtubeId: varchar(20) unique not null
- title: varchar(500) not null
- titleTe: varchar(500) — Telugu title
- description: text
- categoryId: integer references categories(id)
- thumbnailUrl: varchar(500) — YouTube-hosted URL, e.g.:
  https://i.ytimg.com/vi/{ID}/hqdefault.jpg
  (NO local storage needed — YouTube hosts these)
- duration: varchar(10) — "14:32"
- viewCount: varchar(20) — "12.4K"
- publishedAt: timestamp
- isFeatured: boolean default false
- isTrending: boolean default false
- isActive: boolean default true
- createdAt: timestamp defaultNow
- updatedAt: timestamp defaultNow

TABLE: newsletterSubscribers

- id: serial primary key
- email: varchar(255) unique not null
- status: varchar(20) default 'active' — active | unsubscribed
- subscribedAt: timestamp defaultNow
- unsubscribedAt: timestamp

TABLE: settings

- id: serial primary key
- key: varchar(100) unique not null
- value: text not null
- description: varchar(500)
- updatedAt: timestamp defaultNow

TABLE: breakingNews

- id: serial primary key
- text: varchar(500) not null
- textTe: varchar(500)
- isActive: boolean default true
- sortOrder: integer default 0
- createdAt: timestamp defaultNow

TABLE: featuredContent

- id: serial primary key
- type: varchar(50) not null — hero_video | trending | banner
- videoId: integer references videos(id)
- title: varchar(200)
- isActive: boolean default true
- sortOrder: integer default 0
- createdAt: timestamp defaultNow
- updatedAt: timestamp defaultNow

# ═══════════════════════════════════════════════════════════

# 6. API ENDPOINTS

# ═══════════════════════════════════════════════════════════

All routes are prefixed with /api.
Public routes need no auth.
Admin routes require isAuthorized + isAdmin middlewares.

PUBLIC ENDPOINTS:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
POST /api/auth/logout

GET /api/categories
GET /api/videos?category=&page=&limit=&sort=
GET /api/videos/:id
GET /api/videos/featured
GET /api/videos/trending
GET /api/breaking-news
GET /api/featured-content
GET /api/settings/:key
POST /api/newsletter/subscribe
POST /api/contact

ADMIN ENDPOINTS (require auth + admin role):
POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id

POST /api/admin/videos
PUT /api/admin/videos/:id
DELETE /api/admin/videos/:id
POST /api/admin/videos/sync-youtube

GET /api/admin/newsletter
DELETE /api/admin/newsletter/:id

POST /api/admin/breaking-news
PUT /api/admin/breaking-news/:id
DELETE /api/admin/breaking-news/:id

POST /api/admin/featured-content
PUT /api/admin/featured-content/:id
DELETE /api/admin/featured-content/:id

GET /api/admin/settings
PUT /api/admin/settings/:id

GET /api/admin/dashboard/stats
GET /api/admin/users
PUT /api/admin/users/:id

# ═══════════════════════════════════════════════════════════

# 7. DESIGN SYSTEM (from approved prototype)

# ═══════════════════════════════════════════════════════════

COLORS — Light Theme:
Primary (Sky Blue): #0891B2
Primary Dark: #0E7490
Primary Light: #22D3EE
Primary BG: #ECFEFF
Primary Gradient: linear-gradient(135deg, #0891B2, #06B6D4)
Primary Gradient Bold: linear-gradient(135deg, #0E7490, #0891B2)

Accent (Pink): #DB2777 — used ONLY for: - Breaking news "BREAKING" badge background - "Subscribe" YouTube button in navbar - Minor accent labels

Background: #FFFFFF
Surface 1: #F8FAFC
Surface 2: #F1F5F9
Card: #FFFFFF
Text Primary: #0F172A
Text Secondary: #475569
Text Muted: #94A3B8
Border: #E2E8F0
Navbar Background: #0C1A2B (dark navy)
Footer Background: #0C1A2B

Live/Error: #DC2626
Success: #059669
Warning: #D97706

COLORS — Dark Theme:
Primary: #22D3EE
Background: #0B1121
Surface 1: #0F172A
Card: #15203A
Text Primary: #F1F5F9
Text Secondary: #94A3B8
Navbar: #070D1A
Footer: #060C18

CATEGORY COLORS:
General News: #0891B2
Political: #6D28D9
Entertainment: #D97706
Devotional: #DB2777
Local News: #059669
Sports: #2563EB

TYPOGRAPHY:
Display/Headlines: 'Oswald', sans-serif
UI Headings: 'DM Sans', sans-serif
Body Text: 'Nunito Sans', sans-serif
Telugu Text: 'Noto Sans Telugu', sans-serif
Monospace/Data: 'IBM Plex Mono', monospace

Load via Google Fonts:
https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Nunito+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap

LAYOUT:
Max content width: 1360px
Navbar height: 60px
Responsive breakpoint: 900px (below = mobile layout)
Border radius cards: 12px
Border radius buttons: 6-8px

# ═══════════════════════════════════════════════════════════

# 8. PAGE SPECIFICATIONS (match prototype exactly)

# ═══════════════════════════════════════════════════════════

HOME PAGE — Sections in order:

1. Breaking News Ticker
   - Sky blue gradient bar (pGrB)
   - Pink "BREAKING" badge on left (#DB2777 background)
   - White pulsing red dot + "BREAKING" text
   - Telugu news text scrolling right to left
2. Hero Section
   - Left: "FEATURED STORY" label + large VideoCard
   - Right: "LATEST UPDATES" label + 4 horizontal video items
   - Grid: 1.6fr 1fr
3. Categories Grid
   - 6 cards, each with colored top border (3px)
   - Icon, name, Telugu name, video count
4. Trending Section
   - "TRENDING NOW" heading with red accent bar
   - 5 VideoCards in responsive grid
5. CEO Section
   - Card with sky blue gradient top border
   - Left: CEO photo (aspect 3:4)
   - Right: "Meet Our Founder" + description + YouTube link button
6. Newsletter Section
   - Email input + Subscribe button
   - Sky blue gradient background
7. Latest Videos
   - 8 VideoCards in grid
   - "View All Videos →" button at bottom

VIDEOS PAGE:

- Header with "ALL VIDEOS" title
- Sticky category filter pills (All, General, Political, etc.)
- Video grid (responsive)
- Clicking a video shows VIDEO DETAIL view:
  - YouTube player placeholder
  - Title (Telugu + English)
  - Category badge, trending badge
  - Views, date, duration stats
  - Description
  - Social share buttons (Facebook, Twitter, WhatsApp, Copy Link)
  - "UP NEXT" sidebar with 6 related videos

ABOUT PAGE:

- Stats row (Subscribers 50K+, Videos 1200+, Views 500K+, Years 5+)
- CEO section (photo + description)
- Mission & Vision cards (2 columns)

CONTACT PAGE:

- Left: Contact form (name, email, phone, subject, message)
- Right: Contact info cards (phone, email, office, YouTube) + Google Maps placeholder

ADMIN PAGES:

- Login page (centered card, logo, email/password, sign in)
- Dashboard layout: 210px sidebar + content area
- Sidebar tabs: Dashboard, Videos, Featured, Categories, Newsletter, Users, Settings
- Dashboard tab: 4 stat cards + weekly views bar chart + top categories progress bars + recent activity list
- Videos tab: Table with #, Title, Category, Views, Date, Edit button + Sync/Add buttons
- Featured tab: 4 cards (Hero Video, Breaking News, Trending, Newsletter) with preview + configure
- Categories tab: Cards with icon, name, count, edit + "Add" card
- Newsletter tab: Table with #, Email, Date, Status
- Users tab: Table with #, Name, Joined, Role, Edit
- Settings tab: List of setting items (YouTube API, SEO, Contact, Social, Theme) with edit buttons

NAVBAR (all pages):

- Dark background (#0C1A2B)
- Left: Channel logo (transparent PNG)
- Center: Home, Videos, About, Contact links
- Right: Theme toggle (moon/sun) + "Subscribe" button (pink, links to YouTube) + "Dashboard" button (sky blue)
- Mobile: Hamburger menu

FOOTER (all pages):

- Dark background (#0C1A2B)
- Sky blue top border (3px)
- 4 columns: Logo+socials, Quick Links, Categories, Contact
- Copyright bar

# ═══════════════════════════════════════════════════════════

# 9. DEV SETUP — HOW FRONTEND + BACKEND WORK TOGETHER

# ═══════════════════════════════════════════════════════════

DEVELOPMENT (two terminals):
Terminal 1: npm run dev → Hono backend on port 3000
Terminal 2: cd web && npm run dev → Vite frontend on port 5173

web/vite.config.ts must proxy /api to localhost:3000

PRODUCTION (single server):

1. cd web && npm run build → Outputs to web/dist/
2. npm start → Hono serves API + frontend

In src/index.ts (after all API routes): - Serve static from web/dist/ - SPA fallback: serve index.html for non-API routes

ROOT package.json scripts:
"dev": "dotenvx run -- tsx watch src/index.ts"
"start": "dotenvx run -- tsx src/index.ts"
"build:web": "cd web && npm install && npm run build"
"build": "npm run build:web"
"db:generate": "drizzle-kit generate"
"db:migrate": "drizzle-kit migrate"

# ═══════════════════════════════════════════════════════════

# 10. ENV VARIABLES NEEDED

# ═══════════════════════════════════════════════════════════

# Existing (should already be in .env)

DATABASE_URL=postgresql://user:pass@host:5432/cctv_prakasam
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
BREVO_API_KEY=

# R2/S3 NOT NEEDED — remove these or leave them, they won't be used:

# R2_ACCESS_KEY=

# R2_SECRET_KEY=

# R2_BUCKET=

# R2_ENDPOINT=

# YouTube Data API v3 (required)

YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
PORT=3000

# ═══════════════════════════════════════════════════════════

# 11. STEP-BY-STEP BUILD (execute in this exact order)

# ═══════════════════════════════════════════════════════════

STEP 1: AUTH MODULE
───────────────────
Read the existing code at src/ to understand all patterns — how
exceptions, baseDbService, jwtUtils, brevoEmailService, validateRequest,
respUtils, and isAuthorized work.

Then create src/modules/auth/ with these files:

- auth.routes.ts — Hono routes: POST register, login, refresh-token,
  forgot-password, reset-password, verify-email, logout
- auth.controller.ts — Request handlers calling auth.service
- auth.service.ts — Business logic: hash passwords with bcryptjs,
  generate JWT tokens with jwtUtils, send verification/reset emails
  with brevoEmailService, user CRUD with baseDbService
- auth.validation.ts — Valibot schemas for each endpoint body

Install bcryptjs and @types/bcryptjs if not already installed.
Wire auth routes in src/index.ts or a new src/routes.ts.

STEP 2: DATABASE SCHEMAS
─────────────────────────
Create the 6 new table schemas listed in section 5 above.
Follow the exact same Drizzle ORM pattern as src/db/schema/users.ts.
Create src/db/schema/index.ts that barrel-exports all schemas.
Run drizzle-kit generate and drizzle-kit migrate.

STEP 3: isAdmin MIDDLEWARE
──────────────────────────
Create src/middlewares/isAdmin.ts.
It runs AFTER isAuthorized. It checks if the authenticated user
has role === 'admin'. If not, throw ForbiddenException.

STEP 4: CATEGORIES MODULE
──────────────────────────
Create src/modules/categories/ with routes, controller, service, validation.
Public: GET /api/categories — returns all active categories sorted by sortOrder.
Admin: POST /api/admin/categories — create (protected by isAuthorized + isAdmin).
Admin: PUT /api/admin/categories/:id — update.
Admin: DELETE /api/admin/categories/:id — soft delete (set isActive=false).
Use baseDbService for all DB operations.

STEP 5: VIDEOS MODULE
─────────────────────
Create src/modules/videos/ with routes, controller, service, validation.
Public:
GET /api/videos?category=&page=&limit=&sort= — paginated list with filters.
GET /api/videos/:id — single video by id.
GET /api/videos/featured — videos where isFeatured=true.
GET /api/videos/trending — videos where isTrending=true.
Admin:
POST /api/admin/videos — create.
PUT /api/admin/videos/:id — update.
DELETE /api/admin/videos/:id — soft delete.

STEP 6: NEWSLETTER MODULE
──────────────────────────
Create src/modules/newsletter/.
Public: POST /api/newsletter/subscribe — add email (check duplicate, send welcome via Brevo).
Admin: GET /api/admin/newsletter — list all subscribers.
Admin: DELETE /api/admin/newsletter/:id — remove subscriber.

STEP 7: BREAKING NEWS MODULE
─────────────────────────────
Create src/modules/breakingNews/.
Public: GET /api/breaking-news — returns active breaking news sorted by sortOrder.
Admin: POST/PUT/DELETE /api/admin/breaking-news — CRUD.

STEP 8: FEATURED CONTENT MODULE
────────────────────────────────
Create src/modules/featuredContent/.
Public: GET /api/featured-content — returns active featured content.
Admin: POST/PUT/DELETE /api/admin/featured-content — CRUD.

STEP 9: SETTINGS MODULE
────────────────────────
Create src/modules/settings/.
Public: GET /api/settings/:key — get single setting value.
Admin: GET /api/admin/settings — list all. PUT /api/admin/settings/:id — update.

STEP 10: YOUTUBE SYNC MODULE (CORE FEATURE)
─────────────────────────────────────────────
This is the most important feature — it fetches REAL published videos
from the CCTV Prakasam YouTube channel and stores them in the database.
No file storage (R2/S3) is needed — YouTube hosts all thumbnails.

Create src/config/youtubeConfig.ts — reads YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID from env.
Create src/modules/youtube/ with routes, controller, service.

youtube.service.ts must implement this exact flow:

FLOW A — Get channel's upload playlist ID:
Call: GET https://www.googleapis.com/youtube/v3/channels
Params: ?part=contentDetails&id={CHANNEL_ID}&key={API_KEY}
Extract: response.items[0].contentDetails.relatedPlaylists.uploads
(This gives the "uploads" playlist ID — it starts with "UU" instead of "UC")

FLOW B — Get all video IDs from the uploads playlist:
Call: GET https://www.googleapis.com/youtube/v3/playlistItems
Params: ?part=snippet&playlistId={UPLOADS_PLAYLIST_ID}
&maxResults=50&key={API_KEY}&pageToken={nextPageToken}
Loop through all pages using nextPageToken until no more pages.
Collect all video IDs from: items[].snippet.resourceId.videoId

FLOW C — Get full details for each video:
Call: GET https://www.googleapis.com/youtube/v3/videos
Params: ?part=snippet,contentDetails,statistics
&id={comma_separated_video_ids_max_50}&key={API_KEY}
For each video extract and map to our videos table:
youtubeId: item.id
title: item.snippet.title
description: item.snippet.description
thumbnailUrl: item.snippet.thumbnails.high.url
(YouTube hosts these images — NO storage bucket needed!)
duration: item.contentDetails.duration (ISO 8601 like "PT14M32S")
→ convert to readable format "14:32" using a helper function
viewCount: item.statistics.viewCount (raw number)
→ format to "12.4K" or "1.2M" using a helper function
publishedAt: item.snippet.publishedAt

Upsert into videos table:
If youtubeId already exists → UPDATE title, description, viewCount, thumbnailUrl
If youtubeId is new → INSERT as new video row

IMPORTANT:

- YouTube API free quota is 10,000 units/day.
  playlistItems.list = 1 unit, videos.list = 1 unit (cheap!).
  Do NOT use search.list (costs 100 units per call).
- Thumbnails are hosted by YouTube — just store the URL string.
  Example: https://i.ytimg.com/vi/{VIDEO_ID}/hqdefault.jpg
- Use the existing src/services/http.ts fetch wrapper for all API calls.
- Write ISO 8601 duration parser: "PT1H14M32S" → "1:14:32", "PT14M32S" → "14:32"
- Write view count formatter: 1200 → "1.2K", 1500000 → "1.5M"

Admin route: POST /api/admin/videos/sync-youtube
Protected by isAuthorized + isAdmin.
Returns: { newVideos: number, updatedVideos: number, totalVideos: number }

HOW USER GETS YOUTUBE API KEY (document this in README):

1. Go to https://console.cloud.google.com
2. Create project → Enable "YouTube Data API v3"
3. Credentials → Create API Key → copy to .env YOUTUBE_API_KEY

HOW USER GETS CHANNEL ID:
Channel: https://www.youtube.com/@CctvPrakasam
Use API: GET https://www.googleapis.com/youtube/v3/channels
?part=id&forHandle=CctvPrakasam&key={API_KEY}
Copy the returned ID to .env YOUTUBE_CHANNEL_ID

STEP 11: CONTACT MODULE
────────────────────────
Create src/modules/contact/.
Public: POST /api/contact — validates form data, sends email via brevoEmailService.

STEP 12: DASHBOARD MODULE
──────────────────────────
Create src/modules/dashboard/.
Admin: GET /api/admin/dashboard/stats — returns counts for videos, subscribers,
newsletter, users + recent activity list.
Admin: GET /api/admin/users — list users. PUT /api/admin/users/:id — update role.

STEP 13: MOUNT ALL ROUTES
─────────────────────────
Create src/routes.ts that imports all module routes and creates a main Hono app.
Update src/index.ts to mount routes under /api prefix.
Add CORS middleware for the frontend origin.

STEP 14: FRONTEND SETUP
────────────────────────
Create web/ folder with:

- package.json: react, react-dom, @tanstack/react-router, @tanstack/react-query,
  tailwindcss, @tailwindcss/vite, lucide-react
- vite.config.ts: proxy /api → localhost:3000
- tsconfig.json
- index.html with Google Fonts link
- src/main.tsx, App.tsx, router.tsx
- src/styles/globals.css with Tailwind imports + CSS variables for theme
- src/stores/themeStore.ts for dark/light toggle state

Copy logo.png and ceo-photo.jpg to web/src/assets/.

STEP 15: FRONTEND — LAYOUT COMPONENTS
──────────────────────────────────────
Read the prototype JSX file. Build these matching exactly:

- web/src/components/layout/Navbar.tsx
  Dark navbar (#0C1A2B), logo, nav links, theme toggle, pink Subscribe
  button (href to YouTube), sky blue Dashboard button.
  Mobile hamburger at 900px breakpoint.
- web/src/components/layout/Footer.tsx
  Dark footer, 4 columns, sky blue top border.
- web/src/components/layout/BreakingTicker.tsx
  Sky blue gradient bar, pink BREAKING badge, scrolling Telugu text.
- web/src/components/ui/VideoCard.tsx
  Thumbnail area, category badge, trending badge, duration, title, views, date.
- web/src/components/ui/SectionHead.tsx
  Colored left bar + uppercase Oswald title.
- web/src/components/ui/ThemeToggle.tsx

STEP 16: FRONTEND — API CLIENT & HOOKS
───────────────────────────────────────

- web/src/lib/apiClient.ts — fetch wrapper, attaches JWT from localStorage
- web/src/lib/queryClient.ts — TanStack Query client
- web/src/lib/auth.ts — getToken, setToken, removeToken, isAuthenticated
- web/src/hooks/useAuth.ts — login/register mutations
- web/src/hooks/useVideos.ts — useQuery for video list, detail, featured, trending
- web/src/hooks/useCategories.ts — useQuery for categories
- web/src/hooks/useBreakingNews.ts — useQuery for breaking news
- web/src/hooks/useNewsletter.ts — useMutation for subscribe

STEP 17: FRONTEND — PUBLIC PAGES
─────────────────────────────────
Build each page matching the prototype pixel by pixel.
Use TanStack Query hooks to fetch real data from the API.
Add loading skeletons and error states.

- web/src/pages/Home.tsx
- web/src/pages/Videos.tsx
- web/src/pages/VideoDetail.tsx
- web/src/pages/About.tsx
- web/src/pages/Contact.tsx

STEP 18: FRONTEND — ADMIN PAGES
────────────────────────────────
Build admin components:

- web/src/components/admin/AdminSidebar.tsx
- web/src/components/admin/AdminLayout.tsx (sidebar + content wrapper)
- web/src/components/admin/StatsCard.tsx
- web/src/components/admin/DataTable.tsx
- web/src/components/admin/BarChart.tsx

Build admin pages:

- web/src/pages/admin/Login.tsx — centered card, logo, form, calls POST /api/auth/login
- web/src/pages/admin/Dashboard.tsx — stats, charts, activity
- web/src/pages/admin/ManageVideos.tsx — table + sync + add
- web/src/pages/admin/ManageCategories.tsx — cards + add
- web/src/pages/admin/ManageNewsletter.tsx — table
- web/src/pages/admin/ManageUsers.tsx — table
- web/src/pages/admin/FeaturedContent.tsx — cards with configure
- web/src/pages/admin/Settings.tsx — settings list

Add admin route guard: redirect to /admin/login if no valid token.

STEP 19: ROUTER SETUP
──────────────────────
Configure TanStack Router in web/src/router.tsx:
/ → Home
/videos → Videos
/videos/:id → VideoDetail
/about → About
/contact → Contact
/admin/login → admin Login
/admin → admin Dashboard (protected)
/admin/videos → ManageVideos (protected)
/admin/categories → ManageCategories (protected)
/admin/newsletter → ManageNewsletter (protected)
/admin/users → ManageUsers (protected)
/admin/featured → FeaturedContent (protected)
/admin/settings → Settings (protected)

STEP 20: SERVE FRONTEND FROM HONO
──────────────────────────────────
Update src/index.ts:

1. Install @hono/node-server serve-static
2. After all /api routes, add: app.use('/\*', serveStatic({ root: './web/dist' }))
3. SPA fallback: app.get('\*', serve web/dist/index.html)
4. Test: cd web && npm run build, then npm start — single port serves everything.

# ═══════════════════════════════════════════════════════════

# END OF BUILD INSTRUCTIONS

# ═══════════════════════════════════════════════════════════

# To start: tell Claude Code "Read PROJECT_BUILD.md and the prototype

# at prototype/cctv-prakasam-v5-final.jsx. Start from STEP 1."

# After each step completes, say "Continue to STEP N" for the next one.
