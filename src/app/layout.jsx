// src/app/layout.jsx
'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/app/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}

