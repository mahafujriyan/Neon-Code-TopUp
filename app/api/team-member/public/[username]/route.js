import { NextResponse } from "next/server";
import { getPublicTeamMemberByUsername } from "@/lib/teamMemberPublic";

export async function GET(req, { params }) {
  try {
    const { username } = await params;
    const data = await getPublicTeamMemberByUsername(username);

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("TEAM MEMBER PUBLIC API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
