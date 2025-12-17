
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/verifyToken";
import getDB from "@/lib/mongodb";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    // requester verify
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();
    const requester = await db
      .collection("users")
      .findOne({ userId: decoded.uid });

    if (!requester || requester.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // target user
    const { targetUid } = await req.json();
    if (!targetUid) {
      return NextResponse.json({ error: "targetUid required" }, { status: 400 });
    }

    // 🔥 THIS IS THE REAL PART
    await adminAuth.setCustomUserClaims(targetUid, {
      role: "admin",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SET CLAIM ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
