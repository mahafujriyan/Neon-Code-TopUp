import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";
import {
  getDefaultTeamMemberProfile,
  getTeamMemberPublicUrl,
  getTeamMemberQrUrl,
  normalizeTeamMemberUsername,
  sanitizeTeamMemberProfile,
} from "@/lib/teamMemberProfile";

async function getCurrentUser(db, uid) {
  return db.collection("users").findOne({ userId: uid });
}

export async function GET(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();
    const user = await getCurrentUser(db, decoded.uid);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "team_member") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const username = user.teamMemberUsername ?? "";

    return NextResponse.json({
      ok: true,
      data: {
        username,
        profile: sanitizeTeamMemberProfile(user.teamMemberProfile, user),
        publicUrl: getTeamMemberPublicUrl(username),
        qrUrl: getTeamMemberQrUrl(username),
        usernameLocked: Boolean(username),
      },
    });
  } catch (error) {
    console.error("TEAM MEMBER PROFILE GET ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();
    const user = await getCurrentUser(db, decoded.uid);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "team_member") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const incomingUsername = normalizeTeamMemberUsername(body?.username);
    const currentUsername = normalizeTeamMemberUsername(user.teamMemberUsername);

    if (!currentUsername && !incomingUsername) {
      return NextResponse.json({ error: "A unique username is required" }, { status: 400 });
    }

    if (currentUsername && incomingUsername && incomingUsername !== currentUsername) {
      return NextResponse.json({ error: "Username cannot be changed once created" }, { status: 400 });
    }

    const finalUsername = currentUsername || incomingUsername;
    if (finalUsername.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }

    const usernameOwner = await db.collection("users").findOne(
      { teamMemberUsername: finalUsername },
      { projection: { userId: 1 } }
    );

    if (usernameOwner && usernameOwner.userId !== user.userId) {
      return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
    }

    const sanitizedProfile = sanitizeTeamMemberProfile(body?.profile, user);
    const updatePayload = {
      teamMemberUsername: finalUsername,
      teamMemberProfile: sanitizedProfile,
      updatedAt: new Date(),
    };

    await db.collection("users").updateOne({ userId: user.userId }, { $set: updatePayload });

    return NextResponse.json({
      ok: true,
      data: {
        username: finalUsername,
        profile: sanitizedProfile,
        publicUrl: getTeamMemberPublicUrl(finalUsername),
        qrUrl: getTeamMemberQrUrl(finalUsername),
        usernameLocked: true,
      },
    });
  } catch (error) {
    console.error("TEAM MEMBER PROFILE SAVE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
