
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export async function ensureAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}
