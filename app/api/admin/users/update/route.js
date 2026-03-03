import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";

const ALLOWED_ROLES = ["user", "manager", "admin"];

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();

    const adminUser = await db.collection("users").findOne({ userId: decoded.uid });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, role, permissions } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updatePayload = { role, updatedAt: new Date() };
    if (permissions) updatePayload.permissions = permissions;

    await db.collection("users").updateOne({ userId }, { $set: updatePayload });

    return NextResponse.json({ ok: true, message: "User role updated successfully" });
  } catch (err) {
    console.error("ROLE UPDATE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
