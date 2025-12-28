import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, message, screenshots = [] } = await req.json();
    const { db } = await getDB();

    const user = await db.collection("users").findOne({ userId: decoded.uid });

    // ১. টিকেটের মূল অবজেক্ট তৈরি
    const ticket = {
      ticketId: "TKT-" + Date.now(),
      userId: decoded.uid,
      subject,
      status: "open",
      messages: [
        {
          senderType: "user",
          senderId: decoded.uid,
          senderName: user?.name || "User",
          senderRole: "user",
          senderPhoto: user?.photo || "",
          text: message,
          screenshots,
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };


    const res = await db.collection("tickets").insertOne(ticket);

    const historyData = {
      userUid: decoded.uid,
      type: "SUPPORT_TICKET", 
      title: subject,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("otherCollection").insertOne(historyData);

    return NextResponse.json({ 
      ok: true, 
      message: "Ticket created and history recorded",
      ticketId: res.insertedId 
    });

  } catch (err) {
    console.error("Ticket Error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}