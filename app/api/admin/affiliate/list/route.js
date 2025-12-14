
import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req) {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await getDB();

    const admin = await db
      .collection("users")
      .findOne({ userId: decoded.uid });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }
    
  const requests = await db
    .collection("referral_withdraw_requests")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ ok: true, data: requests });
}
