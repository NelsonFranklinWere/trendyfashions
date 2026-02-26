# Database confirmation (schema run complete)

You have run `database/postgres-schema.sql` in the Supabase SQL Editor. This document confirms that the schema and the app are aligned.

## Tables created in Supabase

| Table | Purpose | App usage |
|-------|--------|-----------|
| **images** | Uploaded product images (url, thumbnail, storage_path, category) | `lib/db/images.ts` — getImages, createImage, updateImage, deleteImage |
| **products** | Product catalog (name, price, image, category, tags, featured) | `lib/db/products.ts` — getProducts, createProduct, updateProduct, deleteProduct |
| **orders** | Customer orders (customer_*, shipping_address, status, total_amount) | Ready for checkout/M-Pesa integration |
| **payments** | Payments linked to orders (order_id, provider, amount, status, transaction_reference) | Ready for M-Pesa callbacks |
| **admin_users** | Admin accounts (email, password_hash, role) | `lib/db/admin.ts` — login, createAdminUser, updateAdminUser |
| **admin_sessions** | Admin login sessions (user_id, token, expires_at) | `lib/db/admin.ts` — createAdminSession, getSessionByToken, deleteSession |

## Schema ↔ app alignment

- **images**: All columns used by `createImage` and `ImageRecord` exist in the schema (category, subcategory, filename, url, storage_path, thumbnail_url, uploaded_by, file_size, mime_type, width, height). Optional columns (name, price, description) are present for backward compatibility.
- **products**: All columns used by `createProduct` and `ProductRecord` exist (name, description, price, image, category, subcategory, gender, tags, featured).
- **admin_users / admin_sessions**: Column names and types match `lib/db/admin.ts` (email, password_hash, name, role, is_active, last_login; user_id, token, expires_at).

## Connection

- The app uses **DATABASE_URL** (Supabase Postgres) and connects via `lib/db/postgres.ts` with SSL when the host is `*.supabase.co`.
- No code uses a different database; all reads/writes go through `lib/db` → Supabase.

## Summary

The database is well set: schema has been run, tables and indexes exist, and the app’s DB layer matches the schema. You can use the app (upload images, manage products, admin login) and later wire checkout/M-Pesa to **orders** and **payments**.
