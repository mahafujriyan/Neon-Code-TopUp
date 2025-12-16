
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  const admin = await verifyToken(req);
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId, userId, transcript } = await req.json();
  const { db } = await getDB();

  await db.collection("tickets").insertOne({
    userId,
    chatId,
    source: "live_chat",
    transcript,
    status: "resolved",
    createdAt: new Date(),
  });

  return Response.json({ ok: true });
}
