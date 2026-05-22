-- ╔══════════════════════════════════════╗
-- ║   NESTLE — Run in Supabase SQL Editor ║
-- ╚══════════════════════════════════════╝

create extension if not exists "uuid-ossp";

-- Categories (pre-seeded, fixed)
create table categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  emoji      text not null,
  sort_order int  default 0,
  created_at timestamptz default now()
);

-- Items
create table items (
  id              uuid primary key default uuid_generate_v4(),
  category_id     uuid references categories(id) on delete cascade,
  name            text not null,
  last_quantity   text default '',
  last_unit       text default '',
  is_out_of_stock boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Meal plan
create table meal_plan (
  id              uuid primary key default uuid_generate_v4(),
  week_start_date date not null,
  day_of_week     text not null check (day_of_week in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  meal_type       text not null check (meal_type in ('breakfast','lunch','dinner','other')),
  content         text default '',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(week_start_date, day_of_week, meal_type)
);

-- Watchlist
create table watchlist (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  type         text not null check (type in ('Movie','Series')),
  platform     text default '',
  genre        text default '',
  whose_choice text not null check (whose_choice in ('Aru Baby','Ruru Baby')),
  is_watched   boolean default false,
  watched_at   timestamptz,
  created_at   timestamptz default now()
);

-- App settings (single row, PIN lives here)
create table settings (
  id       int  primary key default 1 check (id = 1),
  pin_hash text not null
);

-- Seed categories
insert into categories (name, emoji, sort_order) values
  ('Kitchen',       '🍳', 1),
  ('Bathroom',      '🚿', 2),
  ('Medicines',     '💊', 3),
  ('Cleaning',      '🧹', 4),
  ('Snacks',        '🍿', 5),
  ('Beverages',     '☕', 6),
  ('Personal Care', '🧴', 7),
  ('Others',        '📦', 8);

-- Default PIN: 1234  (SHA-256 hash — change after first login if you want)
insert into settings (id, pin_hash) values (
  1,
  '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'
);
