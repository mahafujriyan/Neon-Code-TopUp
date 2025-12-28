import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();

    const history = await db
      .collection("otherCollection") 
      .find({ userUid: decoded.uid || decoded.userId }) 
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ ok: true, data: history });
  } catch (err) {
    console.error("History Fetch Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}