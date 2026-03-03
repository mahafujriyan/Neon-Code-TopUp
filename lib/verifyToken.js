import { getToken } from "next-auth/jwt";

export async function verifyToken(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.uid) return null;

    return {
      uid: token.uid,
      email: token.email,
      role: token.role || "user",
    };
  } catch {
    return null;
  }
}
