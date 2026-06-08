# Forte Shutters — Next.js + Supabase

A full-stack marketing and lead-capture website for Forte Shutters, Thika.

## Stack
- **Next.js 14** (App Router) — frontend + API routes
- **Supabase** — Postgres database for quotes and contact submissions
- **Vercel** — hosting and deployment

---

## Setup (one-time)

### 1. Clone and install
```bash
npm install
```

### 2. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to Kenya — e.g. Europe West)
3. Once created, go to **SQL Editor → New Query**
4. Paste the contents of `supabase-setup.sql` and click **Run**
5. Your `quotes` and `contacts` tables are now ready

### 3. Get your Supabase credentials
- Go to **Settings → API** in your Supabase project
- Copy the **Project URL** and **anon public key**

### 4. Set up environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A — Via Vercel dashboard (easiest)
1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy** — done!

### Option B — Via Vercel CLI
```bash
npm i -g vercel
vercel
# Follow prompts, then add env vars in the Vercel dashboard
```

### Custom domain (recommended)
1. Register `forteshutters.co.ke` at [kenic.or.ke](https://kenic.or.ke) (~KES 1,200/yr)
2. In Vercel → your project → **Settings → Domains**
3. Add `forteshutters.co.ke` and follow the DNS instructions

---

## Viewing submissions

Every quote and contact form submission is stored in Supabase.

**To view:**
1. Go to [supabase.com](https://supabase.com) → your project
2. Click **Table Editor**
3. Select `quotes` or `contacts`

**Useful columns in `quotes`:**
- `status` — change to `contacted`, `quoted`, or `closed` to track leads
- `estimated_low` / `estimated_high` — the KES range shown to the customer
- `created_at` — when they submitted

---

## Customisation checklist
- [ ] Update phone number in `components/ContactAndFooter.jsx` and `components/QuoteBuilder.jsx`
- [ ] Update email in `components/ContactAndFooter.jsx`
- [ ] Update address if needed
- [ ] Adjust pricing multipliers in `components/QuoteBuilder.jsx` → `estimateRange()`
- [ ] Add your own photos/images to the `public/` folder
- [ ] Update the stats in `components/Hero.jsx` (installations, years, etc.)

---

## Project structure
```
forte-shutters/
├── app/
│   ├── api/
│   │   ├── quote/route.js       # POST /api/quote → saves to Supabase
│   │   └── contact/route.js     # POST /api/contact → saves to Supabase
│   ├── globals.css
│   ├── layout.js                # Fonts + metadata
│   └── page.js                  # Main page
├── components/
│   ├── Nav.jsx
│   ├── Hero.jsx
│   ├── Products.jsx
│   ├── WhyAndAreas.jsx
│   ├── QuoteBuilder.jsx         # 5-step quote wizard
│   └── ContactAndFooter.jsx
├── lib/
│   └── supabase.js              # Supabase client
├── supabase-setup.sql           # Run once in Supabase SQL editor
├── .env.local.example           # Copy to .env.local
└── package.json
```
