# Eventify

## Getting Started

Start by cloning the project: git clone https://github.com/Jona543/eventify.git

Access the project: cd eventify

Install dependencies: npm install

Create a .env.local file in the root of the project, then copy the example environment file included: cp .env.local.example .env.local

Go to Google Cloud Console, create a new project. Go to API's and Services -> Credentials. Create an OAuth 2.0 Client ID -> Application Type: Web Application -> Authorised redirect URI: http://localhost:3000/api/auth/callback/google -> Save your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and add them to your .env.local file.

Get a MongoDB URI: Sign up at MongoDB Atlas or run MongoDB locally -> create a cluster and database -> whitelist your IP and create a user -> get your connection string and paste it into MONGODB_URI.

Generate a NextAuth secret using: openssl rand -base64 32 -> Paste the output into NEXTAUTH_SECRET.

Seed your new database with the provided sample data using: node scripts/seed.js

Make sure your .env.local contains MONGODB_URI so the script can connect.

Then. run the development server:

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

## Deployed on Vercel

Deployed site link: https://eventify-taupe-alpha.vercel.app

For testing, please log in using one of the following profiles:

Standard Customer: test1@test.com / password: testing

Standard Admin: admin@admin.com / password: testing

Google Customer: eventify44@gmail.com / password: eventify7813

## Prerequisites

- Node.js >= 20.x.x
- MongoDB instance (can be a local or cloud database)

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
