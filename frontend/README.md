# The Royal Jewel — Frontend

Luxury hotel website for Hotel The Royal Jewel, Hisar. React 19 + Vite + Tailwind.
Includes a public site and an admin console / CMS for managing room content.

## Run locally

**Prerequisites:** Node.js, and the Go backend running on `:8080` (see [`../backend`](../backend)).

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` and proxies `/api` to the backend on `:8080`.

## Admin

- Console: `http://localhost:3000/admin`
- Default credentials are seeded by the backend migration (see `../backend` config:
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Build

```bash
npm run build   # outputs to dist/
```

For production, the Go backend embeds and serves the built `dist/` on the same origin,
so `/api` resolves without a proxy.
