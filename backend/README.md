# Backend — Cabinet Dr Sonia Zouid

Node.js + Express + MongoDB backend for the ophthalmology showcase website.
Handles appointment requests and contact messages: saves them to MongoDB Atlas
and sends French email notifications (to the clinic) and confirmations (to the
patient) via Gmail SMTP.

## Structure

```
backend/
├── server.js                 # App entry: security, CORS, rate limit, routes
├── config/db.js              # MongoDB (Mongoose) connection
├── models/                   # Appointment.js, Contact.js, Admin.js
├── controllers/              # Business logic (appointments, contact, auth)
├── routes/                   # auth.js, appointments.js, contact.js
├── middleware/
│   ├── validate.js           # express-validator rules
│   ├── auth.js               # JWT sign + protect (admin login)
│   └── rateLimiters.js       # form / login / global limiters
├── scripts/createAdmin.js    # seed the first admin  (npm run seed:admin)
├── utils/mailer.js           # Nodemailer + French HTML email templates
├── requests.http             # Ready-to-run endpoint tests (REST Client)
├── .env                      # Secrets (git-ignored) — fill this in
└── .env.example              # Template
```

## Quick start

```powershell
cd backend
npm install
# Fill in .env (see steps below), then:
npm run dev        # development, auto-reloads (nodemon)
# or
npm start          # production
```

The API runs on `http://localhost:5000`.

## API

| Method | Endpoint                  | Auth   | Description                          |
|--------|---------------------------|--------|--------------------------------------|
| GET    | `/api/health`             | public | Health check → `{ status: "OK" }`    |
| POST   | `/api/appointments`       | public | Create an appointment request        |
| POST   | `/api/contact`            | public | Create a contact message             |
| POST   | `/api/auth/login`         | public | Admin login → returns a JWT token    |
| GET    | `/api/auth/me`            | admin  | Current logged-in admin              |
| GET    | `/api/appointments`       | admin  | List all appointments                |
| PATCH  | `/api/appointments/:id`   | admin  | Update status (pending/read/done)    |
| DELETE | `/api/appointments/:id`   | admin  | Delete an appointment                |
| GET    | `/api/contact`            | admin  | List all messages                    |
| DELETE | `/api/contact/:id`        | admin  | Delete a message                     |

Rate limits: 20 form submissions / 15 min, **5 login attempts / 15 min** per
IP (anti brute-force), plus a generous 300/15 min global safety net.

### Admin authentication

The admin is a real account stored in the database with a bcrypt-hashed
password. Credentials come from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`,
optional `ADMIN_NAME`).

**1. Create the admin account** — run once from the backend folder:

```powershell
node scripts/createAdmin.js        # or: npm run seed:admin
```

It creates the account if it doesn't exist (safe to run twice).

**2. Log in** to get a token:

```
POST /api/auth/login   { "email": "...", "password": "..." }
→ { "token": "eyJ...", "admin": { ... } }
```

**3. Call admin endpoints** with the token:

```
Authorization: Bearer <token>
```

Tokens are JWTs signed with `JWT_SECRET`, expiring after `JWT_EXPIRES_IN`
(default 7 days).

**Change the password later:** edit `ADMIN_PASSWORD` in `.env`, then run:

```powershell
node scripts/createAdmin.js --reset
```

> The admin panel lives at **`/admin`** (e.g. http://localhost:5173/admin/login).
> It is disallowed in `robots.txt` so search engines don't index it.

---

## STEP 2 — MongoDB Atlas setup (free)

1. Go to <https://www.mongodb.com/atlas> and **sign up** (free, no card).
2. **Create a cluster** → choose the **M0 (Free)** tier → pick a provider/region
   near Tunisia (e.g. AWS `eu-west-1` Ireland or `eu-south-1` Milan) →
   **Create Deployment**.
3. **Database user** (Security → Database Access → *Add New Database User*):
   - Authentication: *Password*
   - Username: e.g. `drzouid_admin`
   - Password: click *Autogenerate* and **copy it somewhere safe**
   - Role: *Read and write to any database* → **Add User**
4. **Network access** (Security → Network Access → *Add IP Address*):
   - Click **Allow Access from Anywhere** → this fills in `0.0.0.0/0` → **Confirm**.
   - (Required so Render can reach the database in production.)
5. **Connection string** (Cluster → *Connect* → *Drivers* → Node.js):
   - Copy the string, it looks like:
     `mongodb+srv://drzouid_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with the real password.
   - Insert the database name `drzouid` right before the `?`:
     `...mongodb.net/drzouid?retryWrites=true&w=majority`
   - Paste the result into `.env` as `MONGODB_URI`.

> If your password contains special characters (`@ : / ? # & %`), URL-encode
> them (e.g. `@` → `%40`), or just autogenerate a password with only letters
> and digits to avoid the issue.

When it connects you'll see `✅ MongoDB connected: ...` in the terminal.

---

## STEP 3 — Gmail App Password (for sending email)

Gmail no longer allows plain-password SMTP. You need a 16-character **App
Password**, which requires 2-Step Verification.

1. Go to <https://myaccount.google.com/security>.
2. Enable **2-Step Verification** (if not already on) and finish the setup.
3. Open **App Passwords**: <https://myaccount.google.com/apppasswords>
   (or Security → *2-Step Verification* → scroll to *App passwords*).
4. App name: type `Site Dr Zouid` → **Create**.
5. Google shows a **16-character password** (e.g. `abcd efgh ijkl mnop`).
   Copy it and put it in `.env` as `EMAIL_PASS` **without spaces**:
   `EMAIL_PASS=abcdefghijklmnop`
6. Set `EMAIL_USER` to the Gmail address that owns this App Password, and
   `EMAIL_TO` to the clinic inbox that should receive notifications.

On startup you'll see `✅ Email transporter ready (Gmail SMTP)`. If credentials
are wrong you'll see a warning — the API still runs and still saves data, only
the emails fail (by design, so a mail issue never loses an appointment).

---

## STEP 11 — Frontend connection (already done)

`vite.config.ts` was updated with a dev proxy so the React app (port 5173) can
call `/api/...` with **no CORS errors**:

```ts
server: {
  port: 5173,
  proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
},
```

The forms in `src/app/App.tsx` now submit through `src/app/lib/api.ts`, which
maps the French form fields to the API and posts to `/api/appointments` and
`/api/contact`. In development it uses the relative URL (proxied); in production
it uses `VITE_API_URL` (see deployment).

**Run both together (two terminals):**
```powershell
# Terminal 1 — backend
cd backend ; npm run dev
# Terminal 2 — frontend (from project root)
npm install ; npm run dev
```

---

## STEP 12 — Testing the endpoints

**Option A — REST Client (easiest):** open `requests.http` in VS Code (install
the *REST Client* extension) and click *Send Request* above each block.

**Option B — PowerShell** (note: use `Invoke-RestMethod`, not Unix `curl`):

```powershell
# Health
Invoke-RestMethod http://localhost:5000/api/health

# Appointment
$body = @{
  fullName = "Amine Ben Ali"; phone = "20123456"; email = "amine@example.tn"
  motif = "Dépistage glaucome"; preferredDate = "2026-07-15"
  preferredTime = "10:00"; message = "Bonjour"
} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/appointments -Method Post -ContentType "application/json" -Body $body

# Contact
$c = @{ fullName = "Sonia"; email = "sonia@example.tn"; message = "Bonjour, vos horaires le samedi ?" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/contact -Method Post -ContentType "application/json" -Body $c
```

**Option C — curl (Git Bash / macOS / Linux):**

```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Amine Ben Ali","phone":"20123456","motif":"Autre","preferredDate":"2026-07-15"}'
```

Expected: `201` on valid submissions, `400` with an `errors` array on invalid.

---

## STEP 13 — Deploy free on Render.com (backend) + Vercel (frontend)

The repo root has a `render.yaml` **Blueprint** that pre-fills most of this
for you. See the top-level `README.md` for the full step-by-step (GitHub →
Render → Vercel → connect the two) — this section covers the backend-specific
details only.

### Environment variables to set in Render
| Key                | Value                                                          |
|--------------------|-----------------------------------------------------------------|
| `MONGODB_URI`      | your full Atlas SRV string (with the real password)             |
| `EMAIL_USER`       | your Gmail address                                               |
| `EMAIL_PASS`       | your 16-char Gmail App Password                                 |
| `EMAIL_TO`         | `cabinet.drzouid@gmail.com`                                      |
| `JWT_SECRET`       | a long random string (signs admin login tokens)                 |
| `JWT_EXPIRES_IN`   | `7d`                                                             |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | the admin account seed values         |
| `ALLOWED_ORIGINS`  | `http://localhost:5173,https://<your-vercel-url>`                |
| `NODE_ENV`         | `production`                                                     |

Root Directory: `backend` · Build: `npm install` · Start: `node server.js`.

Verify once live: `https://<your-render-url>/api/health` → `{ "status": "OK" }`.

> Free Render services sleep after ~15 min idle; the first request then takes
> ~30–50 s to wake (see the root README for a free UptimeRobot workaround).

### Point the frontend at production
On Vercel, set a build-time env var:
```
VITE_API_URL=https://<your-render-url>
```
`src/app/lib/api.ts` and `src/admin/api/adminApi.ts` read it automatically.
Then update `ALLOWED_ORIGINS` on Render to include the real Vercel URL so
CORS allows it.
