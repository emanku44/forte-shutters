-- ============================================================
-- Forte Shutters — Admin Pricing Tables
-- Run this in Supabase → SQL Editor → New Query
-- Run AFTER supabase-setup.sql
-- ============================================================

-- Product base pricing
create table if not exists pricing (
  id           uuid default gen_random_uuid() primary key,
  updated_at   timestamp with time zone default now(),
  product_type text unique not null,
  base_price   integer not null default 0,
  price_per_sqm integer not null default 0,
  notes        text
);

-- Motor pricing
create table if not exists motor_pricing (
  id         uuid default gen_random_uuid() primary key,
  motor_type text unique not null,
  price      integer not null default 0
);

-- Addon pricing
create table if not exists addon_pricing (
  id            uuid default gen_random_uuid() primary key,
  addon_name    text unique not null,
  price         integer not null default 0,
  price_display text not null default ''
);

-- Labour rates per town
create table if not exists labour_rates (
  id          uuid default gen_random_uuid() primary key,
  updated_at  timestamp with time zone default now(),
  town        text unique not null,
  flat_charge integer not null default 0,
  multiplier  numeric not null default 1.0,
  notes       text
);

-- ── Disable RLS (public read for quote builder, admin writes via service) ──
alter table pricing      disable row level security;
alter table motor_pricing disable row level security;
alter table addon_pricing disable row level security;
alter table labour_rates  disable row level security;

-- ── Seed default product pricing ──
insert into pricing (product_type, base_price, price_per_sqm, notes) values
  ('Security Shutter',   55000, 5500, 'Heavy gauge galvanised steel'),
  ('Shop Front Shutter', 45000, 4500, 'Powder-coated commercial grade'),
  ('Garage Shutter',     40000, 4000, 'Aluminium or steel'),
  ('Industrial Shutter', 95000, 7500, 'Heavy duty high-cycle'),
  ('Electric Gate',      85000, 6000, 'Includes motor and remote'),
  ('Window Shutter',     25000, 3500, 'Spring-assisted aluminium')
on conflict (product_type) do nothing;

-- ── Seed motor pricing ──
insert into motor_pricing (motor_type, price) values
  ('Manual (no motor)',          0),
  ('Standard Electric Motor',    12000),
  ('Heavy-Duty 3-Phase Motor',   30000),
  ('Smart Motor with App Control', 22000)
on conflict (motor_type) do nothing;

-- ── Seed addon pricing ──
insert into addon_pricing (addon_name, price, price_display) values
  ('Professional Installation',   0,     'Included'),
  ('Annual Maintenance Plan',     8500,  'KES 8,500/yr'),
  ('Powder-Coat Colour Upgrade',  4500,  'KES 4,500'),
  ('Battery Backup Unit',         12000, 'KES 12,000'),
  ('CCTV / Intercom Integration', 15000, 'From KES 15,000')
on conflict (addon_name) do nothing;

-- ── Seed labour rates ──
insert into labour_rates (town, flat_charge, multiplier, notes) values
  ('Thika',    0,    1.0,  'Local — no travel cost'),
  ('Nairobi',  2500, 1.05, 'Day trip, minor fuel'),
  ('Kiambu',   1500, 1.03, 'Short distance'),
  ('Ruiru',    1500, 1.03, 'Short distance'),
  ('Juja',     1500, 1.03, 'Short distance'),
  ('Muranga',  3000, 1.08, 'Half-day travel'),
  ('Nyeri',    5000, 1.12, 'Overnight may be required'),
  ('Nakuru',   6000, 1.15, 'Overnight accommodation'),
  ('Machakos', 4000, 1.10, 'Half-day travel'),
  ('Mombasa',  15000, 1.25, 'Flights or overnight + accommodation'),
  ('Westlands', 2500, 1.05, 'Nairobi suburb'),
  ('Karen',    3000, 1.06, 'Nairobi suburb')
on conflict (town) do nothing;

-- ============================================================
-- Done! Visit /admin on your site to manage pricing.
-- ============================================================
