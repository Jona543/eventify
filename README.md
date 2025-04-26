This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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