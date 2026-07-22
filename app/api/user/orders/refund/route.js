import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  try {
    //get current user
    const user = await currentUser(req);
    //get order to refund
    const orderId = req.nextUrl.searchParams.get("orderId");

    const order = await Order.findById(orderId);
    // check if order exists and belongs to the current user
    if (!order || order.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { err: "Order not found or unauthorized" },
        { status: 404 },
      );
    }
    // only allow cancellation before fulfillment starts
    if (order.delivery_status !== "Not Processed") {
      return NextResponse.json(
        { err: "Order cannot be refunded" },
        { status: 400 },
      );
    }
    //make the refund request to stripe
    //This can be used under the admin to cancel orders also,
    //  but for now, we will only allow users to cancel their own orders
    const refund = await stripe.refunds.create({
      payment_intent: order.payment_intent,
      reason: "requested_by_customer",
    });
    // update the product quantity in the database for refunded items
    for (const cartItem of order.cartItems) {
      const product = await Product.findById(cartItem._id);
      if (product) {
        product.quantity += cartItem.quantity;
        await product.save();
      }
    }
    // update the order status IN DATABASE to "Refunded"
    order.status = "Refunded";
    order.refunded = true;
    order.delivery_status = "Cancelled";
    order.refundIde = refund.id;
    await order.save();

    return NextResponse.json(
      { message: "Order refunded successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json({ err: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, orderId });
}
