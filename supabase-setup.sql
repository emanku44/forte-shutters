-- ============================================================
-- Forte Shutters — Supabase Database Setup
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- QUOTES table: stores every quote builder submission
create table if not exists quotes (
  id              uuid default gen_random_uuid() primary key,
  created_at      timestamp with time zone default now(),

  -- Step 1
  product_type    text,
  property_type   text,
  location        text,

  -- Step 2
  openings        jsonb,
  material        text,
  colour          text,
  special_notes   text,

  -- Step 3
  motor           text,
  remote_count    integer,
  access_control  text,
  power_supply    text,

  -- Step 4
  addons          text[],
  warranty        text,

  -- Step 5 (customer)
  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text,
  contact_pref    text,
  final_notes     text,

  -- Internal
  status          text default 'new',   -- new | contacted | quoted | closed
  estimated_low   integer,
  estimated_high  integer
);

-- CONTACTS table: stores quick contact form messages
create table if not exists contacts (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamp with time zone default now(),
  name        text,
  phone       text,
  email       text,
  message     text,
  status      text default 'unread'   -- unread | read | replied
);

-- Enable Row Level Security (RLS)
alter table quotes   enable row level security;
alter table contacts enable row level security;

-- Allow anyone to INSERT (public quote/contact submissions)
create policy "Anyone can submit a quote"
  on quotes for insert
  with check (true);

create policy "Anyone can submit a contact message"
  on contacts for insert
  with check (true);

-- Only authenticated users (you, via Supabase dashboard) can SELECT
create policy "Authenticated users can read quotes"
  on quotes for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read contacts"
  on contacts for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update quotes"
  on quotes for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update contacts"
  on contacts for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- Done! Your tables are ready.
-- View submissions: Supabase → Table Editor → quotes / contacts
-- ============================================================
