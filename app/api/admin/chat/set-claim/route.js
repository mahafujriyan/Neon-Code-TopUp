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
    const requester = await db.collection("users").findOne({ userId: decoded.uid });

    if (!requester || requester.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { targetUid } = await req.json();
    if (!targetUid) {
      return NextResponse.json({ error: "targetUid required" }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { userId: targetUid },
      { $set: { role: "admin", updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SET ROLE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
