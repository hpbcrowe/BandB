import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";
import queryString from "query-string";
import mongoose from "mongoose";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

  const payload = await req.json();
  const { delivery_status, action } = payload || {};
  const { orderid: orderId } = await context.params;

  try {
    console.log(
      `PUT request received with orderId: "${orderId}" (type: ${typeof orderId}, length: ${orderId?.length})`,
    );
    console.log(`Delivery status: ${delivery_status} | action: ${action}`);

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

    let nextDeliveryStatus = existingOrder.delivery_status;
    let nextStatus = existingOrder.status;
    let nextPaymentStatus = existingOrder.payment_status || "paid";
    let refundedValue = existingOrder.refunded || false;
    let refundId = existingOrder.refundId || null;

    if (action === "cancel") {
      nextDeliveryStatus = "Cancelled";
      nextStatus = "Cancelled";
      nextPaymentStatus = refundedValue ? "refunded" : "cancelled";
    } else if (action === "refund") {
      if (existingOrder.refunded) {
        return NextResponse.json(
          { err: "This order has already been refunded." },
          { status: 400 },
        );
      }

      if (existingOrder.payment_intent) {
        const refund = await stripe.refunds.create({
          payment_intent: existingOrder.payment_intent,
          reason: "requested_by_customer",
        });
        refundId = refund.id;
      }

      nextDeliveryStatus = "Refunded";
      nextStatus = "Refunded";
      nextPaymentStatus = "refunded";
      refundedValue = true;
    } else if (delivery_status) {
      nextDeliveryStatus = delivery_status;
      nextStatus = delivery_status;
      nextPaymentStatus = refundedValue ? "refunded" : nextPaymentStatus;
    }

    const update = {
      $set: {
        delivery_status: nextDeliveryStatus,
        status: nextStatus,
        payment_status: nextPaymentStatus,
        refunded: refundedValue,
      },
    };

    if (refundId) {
      update.$set.refundId = refundId;
    }

    if (existingOrder.delivery_status !== nextDeliveryStatus) {
      update.$push = {
        statusHistory: { status: nextDeliveryStatus, changedAt: new Date() },
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
