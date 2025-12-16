import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import getDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { db } = await getDB();

    // 🔐 Verify User
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ad_account_id, old_limit, new_limit } = await req.json();

    if (!ad_account_id || new_limit === undefined || old_limit === undefined) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const oldLimit = Number(old_limit);
    const newLimit = Number(new_limit);

    // 🧮 Difference
    const diff = newLimit - oldLimit;

    // 👤 Fetch user (✅ FIXED)
    const userData = await db.collection("users").findOne({
      userId: user.uid,
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const walletBalance = Number(userData.walletBalance || 0);

    // ❌ Wallet check (only increase)
    if (diff > 0 && walletBalance < diff) {
      return NextResponse.json(
        { error: "Insufficient wallet balance. Please top up first." },
        { status: 400 }
      );
    }

    // ✅ Facebook expects TOTAL spend cap
    const spendCap = Math.round(newLimit);

    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/act_${ad_account_id}`,
      {
        method: "POST",
        body: new URLSearchParams({
          access_token: process.env.FB_SYS_TOKEN,
          spend_cap: spendCap.toString(),
        }),
      }
    );

    const fbResult = await fbRes.json();

    if (fbResult.error) {
      return NextResponse.json(
        { error: fbResult.error.message },
        { status: 400 }
      );
    }

    // 💰 Wallet update (✅ FIXED)
    if (diff > 0) {
      await db.collection("users").updateOne(
        { uid: user.uid },
        { $inc: { walletBalance: -diff } }
      );
    }

    // 🧾 Log
    await db.collection("ads_spending_limit_logs").insertOne({
      user_id: user.uid,
      ad_account_id,
      old_limit: oldLimit,
      new_limit: newLimit,
      change_amount: diff,
      wallet_before: walletBalance,
      wallet_after: diff > 0 ? walletBalance - diff : walletBalance,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Spending limit updated",
      new_limit: newLimit,
    });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
