"use client";

import { SessionProvider } from "next-auth/react";
import AuthRouteGuard from "../components/AuthRouteGuard";

export default function Provider({ children }) {
  return (
    <SessionProvider>
      <AuthRouteGuard>
        {children}
      </AuthRouteGuard>
    </SessionProvider>
  );
}
