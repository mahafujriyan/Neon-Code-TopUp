import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();
    const adminUser = await db
      .collection("users")
      .findOne({ userId: decoded.uid });

    if (!adminUser || adminUser.role !== "admin" && adminUser.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { chatId, text } = await req.json();
    if (!chatId || !text?.trim()) {
      return NextResponse.json(
        { error: "chatId and text required" },
        { status: 400 }
      );
    }

    await db.collection("live_chat_messages").insertOne({
      chatId,
      senderRole: "admin",
      type: "text",
      text: text.trim(),
      seen: false,
      createdAt: new Date(),
    });

    await db.collection("live_chats").updateOne(
      { chatId },
      {
        $set: {
          lastMessage: text.trim(),
          lastSender: "admin",
          updatedAt: new Date(),
          status: "open",
        },
        $inc: { unreadForUser: 1 },
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ADMIN REPLY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
