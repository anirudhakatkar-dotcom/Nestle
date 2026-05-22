# 🏡 Nestle

Your home, organised — a shared household PWA for two.

## Features
- **Home Stock** — track items, mark out of stock, one-tap shopping list
- **Meal Planner** — weekly grid with daily WhatsApp reminder at 9 PM IST
- **Watch List** — movies & shows with whose pick, archive on watch

## Setup

### 1. Supabase
Run `schema.sql` in your Supabase SQL editor.

### 2. Local dev
```bash
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

### 3. GitHub Secrets
Add these in your repo → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `GREEN_API_INSTANCE` | e.g. `1101XXXXXXX` |
| `GREEN_API_TOKEN` | Your Green API token |
| `WHATSAPP_GROUP_ID` | e.g. `120363XXXXXXXXXX@g.us` |

### 4. GitHub Pages
- Go to repo Settings → Pages → Source → `gh-pages` branch
- Push to `main` → auto-deploys

### 5. PWA Icons
Add `icon-192.png` and `icon-512.png` to the `public/` folder for home screen install support.

## Default PIN
`1234` — change it by deleting the settings row in Supabase and setting a new one on first launch.
