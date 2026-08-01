import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";
import queryString from "query-string";
import mongoose from "mongoose";

/**
 * Fetch a single order by ID (admin only).
 *
 * @param {Request} req - The incoming request object.
 * @param {Object} context - The context object containing route parameters.
 * @returns {Promise<NextResponse>} - The response object.
 */

export async function GET(req, context) {
  await dbConnect();

  const { orderid: orderId } = await context.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { err: `Invalid order ID format: ${orderId}` },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId).populate(
      "userId",
      "name email",
    );

    if (!order) {
      return NextResponse.json({ err: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.error("Error fetching order:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

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

    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      console.log(`Order not found: ${orderId}`);
      return NextResponse.json({ err: "Order not found" }, { status: 404 });
    }

    const update = { $set: { delivery_status } };

    // Only append a history entry when the status is actually changing, so
    // repeated saves with the same value don't clutter the timeline.
    if (existingOrder.delivery_status !== delivery_status) {
      update.$push = {
        statusHistory: { status: delivery_status, changedAt: new Date() },
      };
    }

    const order = await Order.findByIdAndUpdate(orderId, update, {
      new: true,
    });

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
