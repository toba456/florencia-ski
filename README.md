# Florencia Segovia — Ski Instructor Website

Professional website for Florencia Segovia, certified ski instructor based in Japan (Hakuba · Myoko · Shiga Kogen). Built with Next.js 16, Supabase, and Tailwind CSS v4.

## Features

- **Multilingual** — English, Spanish and Thai (next-intl)
- **Booking calendar** — clients see real-time availability and submit lesson requests
- **Admin dashboard** — Florencia manages available days and reviews/confirms bookings
- **Framer Motion** animations throughout
- **Fully responsive** — mobile-first design

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| i18n | next-intl 4 |
| Calendar | react-day-picker v9 |
| Animations | Framer Motion |
| Fonts | Barlow Condensed + Inter (Google Fonts) |
| Deployment | Vercel |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/florencia-ski.git
cd florencia-ski
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication → Users** and create a user with the admin email

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
florencia-ski/
├── app/
│   ├── [locale]/           # Localized pages (en/es/th)
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Locale layout (fonts, i18n provider)
│   │   └── admin/
│   │       ├── login/      # Admin login page
│   │       └── dashboard/  # Availability & bookings management
│   ├── api/
│   │   ├── availability/   # GET available slots
│   │   └── bookings/       # POST booking requests
│   └── globals.css         # Tailwind v4 theme tokens
├── components/
│   ├── sections/           # Homepage sections
│   └── booking/            # Calendar + booking form
├── i18n/                   # next-intl config & routing
├── lib/                    # Supabase client & TypeScript types
├── messages/               # Translation files (en/es/th)
├── public/                 # Images
├── supabase-schema.sql     # Database schema + RLS policies
└── proxy.ts                # next-intl middleware
```

## Admin Panel

Access the admin panel at `/en/admin/login` (or `/es/admin/login`).

**Availability tab** — select days on the calendar, set start/end time, save to Supabase. Saved slots immediately appear on the public booking calendar.

**Bookings tab** — view all client requests with name, email, phone, service type, and selected slot. Confirm or cancel each request. Confirming marks the slot as booked and removes it from the public calendar.

## Database Schema

```sql
availability_slots   -- dates + time ranges Florencia is available
booking_requests     -- client submissions (pending → confirmed/cancelled)
reviews              -- admin-curated testimonials (optional)
```

Row Level Security ensures:
- Anyone can read available slots and approved reviews
- Anyone can submit a booking request
- Only authenticated admin can manage availability and bookings

## Season

December – February · 09:00–16:00 · Minimum 3 hours

## Contact

- Email: Floriseg@proton.me
- WhatsApp: +54 261 610 3962
- Locations: Hakuba · Myoko · Shiga Kogen, Japan
