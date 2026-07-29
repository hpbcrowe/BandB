import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";
import queryString from "query-string";
import mongoose from "mongoose";

/**
 * Update the delivery status of an order.
 *
 * @param {Request} req - The incoming request object.
 * @param {Object} context - The context object containing route parameters.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function PUT(req, context) {
  await dbConnect();

  const { delivery_status } = await req.json();
  const { orderid: orderId } = await context.params;

  try {
    console.log(
      `PUT request received with orderId: "${orderId}" (type: ${typeof orderId}, length: ${orderId?.length})`,
    );
    console.log(`Delivery status: ${delivery_status}`);

    // Validate orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log(`Invalid order ID format: "${orderId}"`);
      return NextResponse.json(
        { err: `Invalid order ID format: ${orderId}` },
        { status: 400 },
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { delivery_status },
      { new: true },
    );

    if (!order) {
      console.log(`Order not found: ${orderId}`);
      return NextResponse.json({ err: "Order not found" }, { status: 404 });
    }

    console.log(`Order updated successfully:`, order);
    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
