import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import { currentUser } from "@/utils/currentUser";

export async function GET(req) {
  await dbConnect();

  try {
    const user = await currentUser(req);

    if (!user?._id) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    console.log("************Orders fetched for user ID:", user._id, orders);
    return NextResponse.json({ orders });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
