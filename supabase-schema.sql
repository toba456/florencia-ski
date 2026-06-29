-- Run this in your Supabase project → SQL Editor

-- =============================================
-- 1. Availability slots
-- =============================================
create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  is_booked boolean not null default false,
  created_at timestamptz default now(),
  unique(date, start_time)
);

-- Allow public reads (clients see available slots)
alter table availability_slots enable row level security;
create policy "Public can read availability" on availability_slots
  for select using (true);

-- Only authenticated users (admin) can insert/update/delete
create policy "Admin can manage availability" on availability_slots
  for all using (auth.role() = 'authenticated');

-- =============================================
-- 2. Booking requests
-- =============================================
create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references availability_slots(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text default '',
  service_type text not null check (service_type in ('private', 'kids', 'offPiste', 'group')),
  duration text not null check (duration in ('3h', '4h', 'halfDay', 'fullDay')),
  message text default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

-- Clients can insert booking requests (anonymous ok)
alter table booking_requests enable row level security;
create policy "Anyone can create a booking request" on booking_requests
  for insert with check (true);

-- Only admin can read/update
create policy "Admin can manage bookings" on booking_requests
  for all using (auth.role() = 'authenticated');

-- =============================================
-- 3. Reviews (optional — admin-curated)
-- =============================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  rating smallint check (rating between 1 and 5),
  text text not null,
  approved boolean not null default false,
  created_at timestamptz default now()
);

alter table reviews enable row level security;
create policy "Public can read approved reviews" on reviews
  for select using (approved = true);
create policy "Admin can manage reviews" on reviews
  for all using (auth.role() = 'authenticated');

-- =============================================
-- Notes
-- =============================================
-- After running this SQL:
-- 1. Go to Authentication → Users → Create a new user
-- 2. Use Floriseg@proton.me and set a password
-- 3. This will be Florencia's admin login
