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
  setup, Gmail App Password, admin access, endpoint testing, and free
  deployment on Render.com.
- Frontend deploy configs are included for **Netlify** (`frontend/netlify.toml`)
  and **Vercel** (`frontend/vercel.json`).

## Deployment overview

| App      | Host              | Notes                                             |
|----------|-------------------|---------------------------------------------------|
| backend  | Render.com (free) | Root directory `backend`; add env vars in the UI  |
| frontend | Netlify / Vercel  | Base/Root directory `frontend`; set `VITE_API_URL`|

See the backend README for step-by-step instructions.

---

_Original design: [Figma](https://www.figma.com/design/NXtd8u2IB3zico5g0HNFDx/Ophthalmologist-Showcase-Website)._
