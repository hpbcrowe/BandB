import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import { currentUser } from "@/utils/currentUser";
import mongoose from "mongoose";

/**
 * Fetch a single order by ID, scoped to the current user (ownership-checked).
 *
 * @param {Request} req - The incoming request object.
 * @param {Object} context - The context object containing route parameters.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req, context) {
  await dbConnect();

  const { orderid: orderId } = await context.params;

  try {
    const user = await currentUser(req);

    if (!user?._id) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { err: `Invalid order ID format: ${orderId}` },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ err: "Order not found" }, { status: 404 });
    }

    if (order.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.error("Error fetching order:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
