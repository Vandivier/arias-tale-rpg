"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

interface RootLayoutProps {
  children: ReactNode;
  session: Session | null;
}

function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}

export default api.withTRPC(RootLayout);
