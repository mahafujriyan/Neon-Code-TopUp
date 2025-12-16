
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import { adminDB } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (decoded.role !== "admin" && decoded.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { chatId, text } = await req.json();

    if (!chatId || !text) {
      return NextResponse.json(
        { error: "chatId and text required" },
        { status: 400 }
      );
    }

    // 🔹 Save admin message
    await adminDB
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        senderRole: "admin",
        type: "text",
        text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        seen: false,
      });

    // 🔹 Update chat meta
    await adminDB.collection("chats").doc(chatId).update({
      lastMessage: text,
      unreadForUser: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("ADMIN REPLY ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
