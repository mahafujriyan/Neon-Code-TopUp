"use client";

import { SessionProvider } from "next-auth/react";
import { FirebaseAuthProvider } from "@/hooks/useFirebaseAuth";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </SessionProvider>
  );
}
