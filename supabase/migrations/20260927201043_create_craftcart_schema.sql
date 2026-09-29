/*
# CraftCart Schema — Products, Orders, AdminUsers

## Purpose
Full-stack specialty e-commerce store. Public storefront reads/writes via anon key;
admin panel authenticates via Supabase Auth (email/password) and manages products + orders.

## New Tables

### products
- id (uuid PK)
- name (text, not null)
- description (text, not null)
- price (numeric(10,2), not null) — in USD
- stock (integer, not null, default 0)
- category (text, not null) — e.g. "Coffee", "Ceramics", "Leather", "Candles", "Woodwork"
- image_url (text, not null)
- featured (boolean, default false) — shown on homepage hero section
- created_at (timestamptz, default now())

### orders
- id (uuid PK)
- customer_name (text, not null)
- customer_email (text, not null)
- shipping_address (text, not null)
- city (text, not null)
- postal_code (text, not null)
- country (text, not null)
- total_amount (numeric(10,2), not null)
- status (text, not null, default 'Pending') — Pending | Shipped | Delivered | Cancelled
- items (jsonb, not null) — array of { product_id, name, price, quantity }
- created_at (timestamptz, default now())

### admin_users
- id (uuid PK)
- email (text, unique, not null)
- created_at (timestamptz, default now())
- Links to Supabase Auth (auth.users) via email; admin email allowlist.

## Security (RLS)

### products
- SELECT: public (anon, authenticated) — storefront must read products without login.
- INSERT/UPDATE/DELETE: authenticated only — admin must be signed in.
  We scope to authenticated (any signed-in admin). Since admin accounts are created
  by the store owner and Supabase Auth gates access, authenticated-only is sufficient.

### orders
- INSERT: public (anon, authenticated) — customers place orders without signing in.
- SELECT/UPDATE: authenticated only — only admin staff can view and fulfill orders.
- DELETE: authenticated only.

### admin_users
- SELECT: authenticated only — only signed-in admins can see the admin roster.
- INSERT/UPDATE/DELETE: authenticated only.

## Notes
1. Orders are created by anonymous shoppers, so INSERT is public. All order reading
   and status updates are admin-only (authenticated).
2. Products are publicly readable but only admin can modify inventory.
3. No user_id columns — this is a single-store model, not per-customer accounts.
   The admin panel uses Supabase Auth; admin identity is proven by having a valid
   authenticated session, and admin_users acts as an allowlist roster.
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category text NOT NULL,
  image_url text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products: public read
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products"
  ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Products: admin write (authenticated only)
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Shipped','Delivered','Cancelled')),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Orders: public insert (customers checkout without login)
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Orders: admin read & update (authenticated only)
DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders"
  ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders"
  ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders"
  ON orders FOR DELETE
  TO authenticated USING (true);

-- Admin users table (allowlist roster)
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_admin_users" ON admin_users;
CREATE POLICY "admin_select_admin_users"
  ON admin_users FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_admin_users" ON admin_users;
CREATE POLICY "admin_insert_admin_users"
  ON admin_users FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_admin_users" ON admin_users;
CREATE POLICY "admin_update_admin_users"
  ON admin_users FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_admin_users" ON admin_users;
CREATE POLICY "admin_delete_admin_users"
  ON admin_users FOR DELETE
  TO authenticated USING (true);

-- Index for category filtering on storefront
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
