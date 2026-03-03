import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, type, text, imageUrl } = await req.json();

    if (!chatId) {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    if (!text?.trim() && !imageUrl) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const safeType = imageUrl ? "image" : type || "text";

    const { db } = await getDB();

    await db.collection("live_chats").updateOne(
      { chatId, userId: decoded.uid },
      {
        $set: {
          status: "open",
          lastMessage: text?.trim() || "Image",
          lastSender: "user",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          chatId,
          userId: decoded.uid,
          unreadForAdmin: 0,
          unreadForUser: 0,
          createdAt: new Date(),
        },
        $inc: { unreadForAdmin: 1 },
      },
      { upsert: true }
    );

    await db.collection("live_chat_messages").insertOne({
      chatId,
      senderRole: "user",
      type: safeType,
      text: text?.trim() || "",
      imageUrl: imageUrl || null,
      seen: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CHAT SEND ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

