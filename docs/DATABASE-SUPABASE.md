# Database: Supabase (confirmed)

The app uses **Supabase** as the database. There is no separate/local PostgreSQL; all data lives in Supabase.

## Connection

- **Driver:** `pg` (node-postgres) — used to connect to Supabase’s PostgreSQL.
- **Config:** `DATABASE_URL` in `.env.local` (and production env) must be the Supabase connection string, e.g.  
  `postgresql://postgres:PASSWORD@db.jlidiwzvdbaiepapzmxj.supabase.co:5432/postgres`  
  (use `%40` for `@` in the password.)
- **SSL:** Enabled automatically when the host is `*.supabase.co` (see `lib/db/postgres.ts`).

## What uses the database

| Layer | Role |
|-------|------|
| `lib/db/postgres.ts` | Single connection pool and `query()` used by all DB access. |
| `lib/db/images.ts` | Images table: `getImages`, `getImageById`, `createImage`, `updateImage`, `deleteImage`. |
| `lib/db/products.ts` | Products table: `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`. |
| `lib/db/admin.ts` | Admin users and sessions: `admin_users`, `admin_sessions`. |

All of the above use `query()` from `postgres.ts` → **Supabase**.

## Categories (all in Supabase)

Categories are stored in the same Supabase tables; slug → DB category mapping is in `lib/server/dbImageProducts.ts`:

- **DB categories:** `officials`, `casual`, `loafers`, `sandals`, `sports`, `vans`, `sneakers`
- **Slug mapping:** e.g. `mens-officials` → `officials`, `mens-casuals` → `casual`, `mens-loafers` → `loafers`

So all category data is read/written in Supabase.

## How products are uploaded

1. **Admin image upload:** `pages/api/admin/images/upload.ts`  
   - Uses `createImage` from `lib/db/images` → writes to Supabase `images` table.  
   - File storage can be DigitalOcean Spaces (or similar); only metadata is in Supabase.

2. **Admin product create/update:** `pages/api/admin/products/index.ts`, `pages/api/admin/products/[id].ts`  
   - Use `createProduct`, `updateProduct`, `deleteProduct` from `lib/db/products` → Supabase `products` table.

So all uploads and product CRUD go to **Supabase**.

## How products are displayed

1. **Home page:** `pages/index.tsx` → `getStaticProps` uses `getDbProducts` / `getDbImageProducts` from `lib/server/dbImageProducts.ts` → `getProducts` / `getImages` from `lib/db` → **Supabase**.

2. **Collection pages:** `pages/collections/[category].tsx` → uses `getOfficialImageProducts`, `getCasualImageProducts`, `getLoafersImageProducts`, `getSportsImageProducts`, `getVansImageProducts`, etc. Each of these (e.g. `lib/server/officialImageProducts.ts`) calls `getDbImageProducts` / `getDbProducts` in `lib/server/dbImageProducts.ts` → **Supabase**.

3. **Admin lists:** `pages/api/admin/products/index.ts`, `pages/api/images/index.ts` use `getProducts` / `getImages` → **Supabase**.

So all product and image display flows read from **Supabase**.

## Schema

Tables live in Supabase: `images`, `products`, `admin_users`, `admin_sessions`.  
To create or migrate them, run `database/postgres-schema.sql` in the Supabase SQL Editor (Dashboard → SQL Editor).

## Summary

- **PostgreSQL package (`pg`):** Still used as the **client** to talk to the database. It was not removed; the database **is** Supabase (hosted PostgreSQL).
- **Database in use:** Only Supabase (no local or other Postgres).
- **Categories:** All category data is in Supabase; slug mapping is in code.
- **Uploads:** Image/product create/update/delete go to Supabase (and optional file storage elsewhere).
- **Display:** Home, collections, and admin all read products and images from Supabase.
