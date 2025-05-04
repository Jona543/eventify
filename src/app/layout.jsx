// src/app/layout.jsx
"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Eventify</title>
        <meta
          name="description"
          content="Browse and manage events with Eventify."
        />
        <meta charSet="UTF-8" />
        {/* Add other global meta tags or links here */}
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
