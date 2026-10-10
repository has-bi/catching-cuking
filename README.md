# Catching Cuking 🐱

Mobile-first webapp for Nadya's collection of cat photos around Jakarta.

- **Galeri**: grid of every cat, newest first
- **Peta**: map of Jakarta with every cat as a photo pin (Leaflet + OpenStreetMap)
- **Detail**: photo, name, area, date, notes, link to Google Maps
- **Tambah** (Nadya only): take or pick a photo, location comes from photo EXIF → phone GPS → tap on map. Photos are compressed in the browser (≈400 KB full + ≈60 KB thumbnail) before upload.

Stack: Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage) · Vercel.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (region: Singapore is closest to Jakarta).
2. **SQL Editor** → paste and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `cats` table, RLS policies and the public `cat-photos` storage bucket.
3. **Authentication → Users → Add user**: create Nadya's account (email + password, tick *Auto Confirm User*).
4. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up". This matters: any signed-in user can add or delete cats, so Nadya must be the only one.
5. **Project Settings → API Keys**: copy the Project URL and the publishable key.

### 2. Run locally

```bash
cp .env.example .env.local   # fill in the two values
npm install
npm run dev
```

Open http://localhost:3000. To test on a phone on the same Wi-Fi, use the network URL that `next dev` prints. Note: phone GPS (`navigator.geolocation`) only works on HTTPS or localhost, so use the deployed URL for location testing.

### 3. Deploy to Vercel

1. Import this repo at [vercel.com/new](https://vercel.com/new).
2. Add the same two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
3. Deploy. Every push to `main` redeploys automatically.

On iPhone: open the site in Safari → Share → *Add to Home Screen* to use it like an app.

## How it works

| Piece | File |
| --- | --- |
| Database schema, RLS, storage bucket | `supabase/schema.sql` |
| Cached data reads (`"use cache"`, tag `cats`) | `src/lib/cats.ts` |
| Cache refresh after upload/delete | `src/app/actions.ts` |
| EXIF reading + compression | `src/lib/image.ts` |
| Upload form | `src/components/UploadForm.tsx` |
| Map with photo pins | `src/components/CatMap.tsx` |

Reads run on the server and are cached for about a minute. Writes (upload, delete) run in the browser with Nadya's Supabase session; RLS rejects writes from anyone not signed in.

## Ideas for later

- Filter by area or by colour (oren, belang, hitam, telon)
- Several sightings of the same cat
- Auto-fill area from coordinates (reverse geocoding)
- Edit existing entries
