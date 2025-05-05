This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Eventify

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deployed on Vercel

Deployed site link: https://eventify-taupe-alpha.vercel.app

## Prerequisites

- Node.js >= 20.x.x
- MongoDB instance (can be a local or cloud database)

## Environment Variables

Create a `.env.local` file and add the following variables:

- `MONGODB_URI`: Your MongoDB connection URI.
- `NEXTAUTH_URL` : http://localhost:3000
- `NEXTAUTH_SECRET`: A secret key for signing JWT tokens (generate using `openssl rand -base64 32`).
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
- `NEXTAUTH_DEBUG` : false

## Notes

📄 Eventify Project Summary
Project Name: Eventify
Stack: Next.js (App Router), MongoDB (via Mongoose), NextAuth.js for authentication (Credentials + Google Provider)

Key Features:

User authentication (sign in with email/password + Google)

Staff/Admin roles (admin can promote users)

Create, edit, delete events (staff only)

Users can register or unregister for events

Add events to Google Calendar (prevent duplicate adding)

Filtering events by topic

Account page (view email, change password, delete account)

Special Behaviors:

Only staff/admins can access /events/create

Google Calendar integration uses access token via getServerSession

When creating events:

End date defaults to one hour after start date but can be edited manually

Admin dashboard exists to manage users (e.g., promote to staff)

Components:

CreateEvent form

EventCard (displays event info, shows Edit/Delete/Register buttons based on role)

EventsList (lists EventCards)

Authentication Notes:

MongoDBAdapter for NextAuth

Roles are stored inside the JWT

Protected API routes for sensitive actions
