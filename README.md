# Cabinet Dr Sonia Zouid — Ophthalmology Showcase Website

Full-stack showcase site for Dr Sonia Zouid, ophthalmologist in Téboulba, Tunisia.

The project is split into two independent apps:

```
.
├── frontend/   React + Vite + Tailwind app (the website)
└── backend/    Node.js + Express + MongoDB API (appointments & contact)
```

Each folder has its own `package.json` and is run separately.

## Running locally (two terminals)

**Terminal 1 — backend** (API on http://localhost:5000):
```powershell
cd backend
npm install          # first time only
# fill in backend/.env  (see backend/README.md — MongoDB Atlas + Gmail)
npm run dev
```

**Terminal 2 — frontend** (site on http://localhost:5173):
```powershell
cd frontend
npm install          # first time only
npm run dev
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the
backend, so the appointment and contact forms work with no CORS setup.

> You need **both** running for the forms to submit. The frontend alone shows
> the site; the backend alone serves the API.

## Documentation

- **[backend/README.md](backend/README.md)** — full backend guide: MongoDB Atlas
  setup, Gmail App Password, admin access, and endpoint testing.
- Deploy configs are included: `render.yaml` (backend Blueprint, repo root),
  `frontend/vercel.json` (frontend), `frontend/netlify.toml` (alternative to Vercel).

## Deploying to production (Render + Vercel)

This is a **monorepo**: one Git repo, two deploy targets, each pointed at its
own subfolder.

| App      | Host              | Root Directory | Build            | Start / Output        |
|----------|-------------------|-----------------|------------------|------------------------|
| backend  | Render.com (free) | `backend`       | `npm install`    | `node server.js`      |
| frontend | Vercel (free)     | `frontend`      | `npm run build`  | `dist/`                |

**1. Push this repo to GitHub** (see `git remote add origin ...` / `git push`).

**2. Backend on Render** — New + → **Blueprint** → select the repo (reads
`render.yaml` and pre-fills the service) → fill in the secret env vars it
prompts for (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_*`, `EMAIL_*`) → Deploy.
Note the resulting URL, e.g. `https://dr-zouid-api.onrender.com`.

**3. Frontend on Vercel** — New Project → import the repo → set **Root
Directory** to `frontend` (Framework auto-detects as Vite) → add env var
`VITE_API_URL=<your Render URL>` → Deploy. Note the resulting URL, e.g.
`https://dr-sonia-zouid-website.vercel.app`.

**4. Connect them** — back in Render, update `ALLOWED_ORIGINS` to include the
real Vercel URL (comma-separated with `http://localhost:5173`) → Render
redeploys automatically.

**5. Keep the backend awake (optional)** — Render's free tier sleeps after
~15 min idle. Set up a free [UptimeRobot](https://uptimerobot.com) HTTP
monitor pinging `https://<your-render-url>/api/health` every 5–10 minutes.

**6. Custom domain (optional)** — buy a `.tn` domain (e.g. via
[ati.tn](https://www.ati.tn) or [internames.tn](https://www.internames.tn)),
then in Vercel → Project → Settings → Domains, add it and follow the DNS
records Vercel shows you (usually an `A` record for the bare domain and a
`CNAME` for `www`). SSL is issued automatically once DNS propagates.

See `backend/README.md` for the exact environment variable list and
`backend/requests.prod.http` for a ready-to-run production smoke test.

---

_Original design: [Figma](https://www.figma.com/design/NXtd8u2IB3zico5g0HNFDx/Ophthalmologist-Showcase-Website)._
