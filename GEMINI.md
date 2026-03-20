# fundraise.bio Context

This project is a modern, full-stack web application for creating charity impact profiles.

## Technologies
- **Framework:** Next.js (App Router, TypeScript)
- **Database:** PostgreSQL with Prisma
- **Auth:** NextAuth.js (Email Magic Links)
- **Styling:** Vanilla CSS (CSS Modules)
- **Icons:** Lucide-React

## Key Features
- **User Profiles:** Custom `/[username]` subpages.
- **Pre-vetted Charities:** Curated list from GiveWell and CharityWatch.
- **Analytics:** Tracks views and clicks on charities per profile.
- **Self-Reporting:** Visitors can report their donations on profile pages.

## Getting Started
1. `cd fundraise`
2. `npm install`
3. `cp .env.example .env` (and fill in values)
4. `npx prisma migrate dev`
5. `npx prisma db seed`
6. `npm run dev`

## Project Structure
- `src/app/`: App Router pages and API routes.
- `src/components/`: Reusable React components (CharityCard, Providers).
- `src/lib/`: Shared logic (Prisma, Auth).
- `prisma/`: Schema and seed data.
