# The Royal Jewel — Change Log

Summary of the work done on top of the original AI Studio landing-page template:
added a real backend with an admin console + CMS, removed all Google AI Studio
scaffolding, and deployed to Railway.

Date: 2026-07-08

---

## 4. Basic pages, working buttons, lead capture, image upload, mobile responsive

Built via an orchestrated understand → implement → adversarial-review → live-verify
flow. **Live:** https://the-royal-jewel-production.up.railway.app

### New public pages (routes in `App.tsx`)
- `/faq` — accordion (native `<details>`, accessible).
- `/privacy`, `/terms`, `/cancellation` — legal pages via shared `components/LegalDoc.tsx` + `InnerHero.tsx`.
- `/book` — booking form; stores a `booking` lead; prefills room from `?room=slug`.
- `/admin/leads` — admin inbox: view enquiries/bookings, change status (new/contacted/closed), delete.

### Every button/link now works (was: dead `#`, noop, or no handler)
- Navbar: **real mobile drawer** (was a fake hamburger), "Book Now" → `/book`.
- Hero: Book Now → `/book`, View Rooms → `/rooms`, Call Us → `tel:`.
- Rooms page: "Book This Room" → `/book?room=slug`, "Enquire" → `/contact`.
- Rooftop: "Inquire for Events" → `/contact?subject=Events`.
- Location: "Get Directions" → Google Maps; phone/email → `tel:`/`mailto:`.
- Gallery: "View Full Gallery" → SPA `<Link>` (was full reload).
- Footer: FAQ/Privacy/Terms/Cancellation → real routes; social → platforms (new tab); phone/email clickable.
- Contact form: wired → stores a `contact` lead, with validation + success state (was `preventDefault` no-op).

### Leads stored in admin (Postgres, survives redeploys)
- `Lead` model; public `POST /api/leads`; admin `GET/PATCH/DELETE /api/admin/leads`.
- Server-controlled `status`; DTO binding (no mass-assignment); field length caps + email validation.

### Image upload from device (CMS)
- `Image` model (bytes in Postgres); admin `POST /api/admin/images` (multipart); public `GET /api/images/:id`.
- CMS room editor: "Upload from device" → thumbnails → into gallery (URL entry still supported).

### Mobile responsive
- Working mobile nav; forms stack (`grid-cols-1 sm:grid-cols-2`); modal scrolls; rating pill wraps;
  full-width stacked CTAs; ≥44px tap targets; long emails wrap; responsive section spacing/headings.

### Adversarial review — 17 findings confirmed and fixed before/at deploy
- **CRITICAL** unauthenticated SQL injection: `GET /api/images/:id` (and lead/room id handlers) passed the
  raw `:id` string to GORM, which emits non-numeric strings as raw SQL. Fixed: `strconv.ParseUint` + typed
  primary-key lookups everywhere.
- **HIGH** stored XSS via `image/svg+xml` served inline: now server-sniffs bytes
  (`http.DetectContentType`), raster allow-list only (png/jpeg/gif/webp), `X-Content-Type-Options: nosniff`.
- Upload DoS: `http.MaxBytesReader` caps the body before parsing (5 MB).
- Mass assignment on public leads/rooms create; `DeleteLead`/`DeleteRoom` now 404 on missing (RowsAffected).
- Frontend: CMS thumbnail error state made controlled (keyed by URL); `mainImage` tracks gallery;
  AdminConsole redirects on expired token; Rooms guards empty image src; tap-target sizes.

### Live verification (all passed)
- All SPA routes 200; injection `?id=1 OR 1=1` → 404; leads validation matrix; mass-assignment blocked
  (`status:closed`/`ID:99999` → stored `new`/real id); PNG upload 201 + `nosniff`; SVG upload 400;
  unauth upload 401; PATCH/DELETE + invalid-id(400)/missing(404); rooms still seeded (3). Test data cleaned.

### Notes / not done
- One 1×1-px test image (`/api/images/1`) remains from verification — harmless; no image-delete endpoint exists.
- Home "featured rooms" card anchors are still hardcoded (`#deluxe` etc.); work with seeded slugs, degrade
  gracefully if an admin renames a slug.
- Admin token still in `localStorage` (24h JWT) — fine given no stored-XSS sink remains; httpOnly cookie is a future hardening.
- Anti-bot (CAPTCHA) not added to the public lead endpoint; length caps + rate limiter mitigate spam.

---

## 1. Admin Console + CMS

The site's room content is now managed through a login-protected admin area
instead of being hardcoded in the frontend.

### Backend (Go / Gin — `backend/`)

Built on the existing `imagine_backend` template (JWT utils, middleware, GORM,
embedded SPA server were reused as-is).

| File | Change |
|------|--------|
| `internal/models/models.go` | **New.** `User` (admin) and `Room` models. Room slices (`gallery`, `amenities`, `features`) stored as JSON columns via GORM's `serializer:json`. |
| `internal/utils/password.go` | **New.** bcrypt hash/verify (uses `golang.org/x/crypto`, already vendored — no new dependency). |
| `internal/handler/auth.go` | **New.** `POST /api/admin/login` → validates credentials, returns a 24h JWT. |
| `internal/handler/rooms.go` | **New.** Public `GET /api/rooms` and `/api/rooms/:slug`; admin `POST/PUT/DELETE /api/admin/rooms`. |
| `internal/server/routes.go` | Registered the routes; admin write routes sit behind the existing `AuthMiddleware`. |
| `cmd/migration/main.go` | Migrates `User` + `Room`, seeds the admin user and the original 3 rooms (idempotent — skips if data exists). |
| `config/config.go` | Added `ADMIN_EMAIL` / `ADMIN_PASSWORD` (with defaults). |
| `internal/utils/utils_test.go` | **New.** Unit tests for bcrypt + JWT round-trip (incl. forged-token rejection). |
| `.env.example` | **New.** Documents required env vars. |
| `.gitignore` | Added `!.env.example` exception. |
| `.gitattributes` | **New.** Forces `*.sh eol=lf` (see deploy note below). |

**API surface**

```
GET    /api/health
GET    /api/rooms            (public)
GET    /api/rooms/:slug      (public)
POST   /api/admin/login      -> { token }
POST   /api/admin/rooms      (JWT)
PUT    /api/admin/rooms/:id  (JWT)
DELETE /api/admin/rooms/:id  (JWT)
```

### Frontend (React / Vite — `frontend/`)

| File | Change |
|------|--------|
| `src/lib/api.ts` | **New.** Fetch client + localStorage token handling. |
| `src/pages/AdminLogin.tsx` | **New.** `/admin/login` — login form. |
| `src/pages/AdminConsole.tsx` | **New.** `/admin` — dashboard (room count, links). |
| `src/pages/AdminCMS.tsx` | **New.** `/admin/cms` — rooms table + create/edit/delete modal. |
| `src/App.tsx` | Added admin routes + `RequireAuth` guard; hides public Navbar/Footer on `/admin`. |
| `src/pages/Rooms.tsx` | Now **fetches rooms from the API** instead of a hardcoded array. Icon keys (`wind`/`wifi`/`tv`/`coffee`) map to lucide icons. |
| `vite.config.ts` | Dev proxy `/api → localhost:8080`. |

**How it connects:** editing a room in `/admin/cms` writes to the DB; the public
`/rooms` page reads the same API. End-to-end.

---

## 2. Removed Google AI Studio scaffolding

- Deleted `metadata.json` (AI Studio manifest, claimed a nonexistent Gemini backend).
- Deleted `.env.example` (documented an unused `GEMINI_API_KEY`) and `assets/.aistudio/`.
- Rewrote `README.md` (was "Run and deploy your AI Studio app").
- `package.json`: renamed `react-example` → `the-royal-jewel`; removed unused deps
  `@google/genai`, `express`, `dotenv`, `@types/express`, `tsx`; dropped the AI-Studio
  `clean` script.
- `vite.config.ts`: removed AI Studio HMR/DISABLE_HMR comments and logic.
- Verified: no `gemini` / `genai` / `ai studio` / `@google` references remain in source or lockfile.

---

## 3. Deployment (Railway)

Deployed as a **single service** (Go backend serves the API *and* the embedded
built frontend) plus a **Postgres** database.

- **Project:** `The-Royal-Jewel`
- **Service:** `the-royal-jewel` (Docker build from `backend/Dockerfile`)
- **Database:** Postgres (Railway plugin)
- **Live URL:** https://the-royal-jewel-production.up.railway.app
- **Admin:** https://the-royal-jewel-production.up.railway.app/admin
  - Email: `admin@theroyaljewel.com`
  - Password: `a30eaba37be72ec6`  *(generated — change it: `railway variables --set "ADMIN_PASSWORD=..."` then rerun migration/redeploy, and change the seeded user's hash)*

Env vars set on the service: `ENV`, `DB_*` (referencing `${{Postgres.*}}`),
`DB_SCHEMA=public`, `JWT_SECRET` (generated), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
`PORT` is injected by Railway.

### Build/deploy flow

The backend embeds the frontend via `//go:embed all:dist`, so the built SPA must be
staged into `backend/internal/dist` before deploying:

```bash
cd frontend && npm run build
rm -rf ../backend/internal/dist && mkdir -p ../backend/internal/dist
cp -r dist/* ../backend/internal/dist/

cd ../backend && railway up --service the-royal-jewel
```

### Deploy note — start.sh line endings

First deploy 502'd with `exec /app/./start.sh: no such file or directory`. Cause:
`start.sh` had Windows CRLF line endings, so the `#!/bin/sh` shebang resolved to
`/bin/sh\r`. Fixed by converting to LF and adding `.gitattributes` (`*.sh eol=lf`)
to prevent regression.

### Verified live

- `GET /api/health` → `{"status":"ok"}`
- `GET /api/rooms` → 3 seeded rooms
- `GET /` → SPA served (200)
- Login (correct) → token; (wrong) → 401
- Admin write without token → 401; with token → 201 create / 204 delete

---

## Not done (out of scope / follow-ups)

- **CMS manages Rooms only.** Other sections (story, testimonials, amenities, gallery)
  are still hardcoded. Same pattern extends per entity.
- Booking / "Call Us" CTAs and the mobile nav menu are still non-functional (pre-existing).
- Amenity icons limited to `wind`/`wifi`/`tv`/`coffee` (extend the map in `Rooms.tsx`).
- No refresh tokens (24h JWT) and no admin-user management UI (single seeded admin).
- `/ImagineboIcon.svg` (footer watermark) 404s under the embedded server, which only
  routes `/assets/*` + SPA fallback. Add a static route if the watermark icon matters.
