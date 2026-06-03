# Deployment Guide — Assure Logistics

This monorepo has three deployable pieces. Each can be hosted independently.

---

## Marketing Site → Vercel

**Directory:** `artifacts/assure-marketing`

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `artifacts/assure-marketing`
4. Vercel auto-detects `vercel.json` — no further config needed
5. Click **Deploy**
6. To attach your custom domain: Project Settings → Domains → Add domain

**No env vars required** (the marketing site calls `/api/*` which you'll point at your API server — see below).

---

## Logistics Dashboard → Vercel

**Directory:** `artifacts/assure-logistics`

Same steps as above, but set Root Directory to `artifacts/assure-logistics`.

Add one environment variable in Vercel:

| Key | Value |
|---|---|
| `VITE_API_URL` | Your API server URL (e.g. `https://assure-api.onrender.com`) |

---

## API Server → Render (recommended free option)

**Directory:** `artifacts/api-server`

1. Go to [render.com](https://render.com) and click **New → Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to the repo root (not the artifact subfolder)
4. Render reads `artifacts/api-server/render.yaml` automatically
5. Add these environment variables in the Render dashboard:

| Key | Description |
|---|---|
| `DATABASE_URL` | Your Postgres connection string |
| `SESSION_SECRET` | Any long random string |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Your 16-char Gmail App Password |
| `CONTACT_NOTIFY_EMAIL` | (optional) email to receive inquiry notifications |

### Alternative: Railway

`artifacts/api-server/railway.toml` is also included. Deploy via [railway.app](https://railway.app) with the same env vars above.

---

## Custom Domain

Once both sites and the API are deployed:

1. Point your domain's DNS to Vercel (they provide the records)
2. Set the marketing site as your root domain (e.g. `assurelogisticsservices.com`)
3. Set the dashboard on a subdomain (e.g. `app.assurelogisticsservices.com`)
4. Update `VITE_API_URL` on the dashboard to your Render/Railway API URL
