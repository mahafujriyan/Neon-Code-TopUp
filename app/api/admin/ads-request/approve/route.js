import { NextResponse } from "next/server";
import getDB from "@/lib/mongodb";
import { verifyToken } from "@/lib/verifyToken";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDB();

    const admin = await db.collection("users").findOne({ userId: decoded.uid });
    if (!admin || (admin.role !== "admin" && admin.role !== "manager")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, status, MetaAccountID } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid or missing ID" }, { status: 400 });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (MetaAccountID !== undefined) updateData.MetaAccountID = MetaAccountID;


    const result = await db
      .collection("adAccountRequests")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    const updatedDoc = result.value || result;

    if (!updatedDoc) {
      return NextResponse.json(
        { message: "Request not found in database" },
        { status: 404 }
      );
    }

    const historyData = {
      requestId: updatedDoc._id,
      userUid: updatedDoc.userUid,
      type: "Get Meta Account ID",
      title: MetaAccountID ,
      status: updatedDoc.status, 
      updatedAt: new Date(),
    };

    await db.collection("otherCollection").insertOne(historyData);

    return NextResponse.json({
      ok: true,
      message: "Request updated and history recorded",
      data: updatedDoc,
    });

  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}