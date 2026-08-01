import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Order from "@/models/order";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  // Stripe sends the raw body as a string, so we need to read it as text
  // We also need to get the Stripe signature from the headers to verify the webhook
  // Read the raw body as text
  const _rawData = await req.text();
  const stripeSignature = req.headers.get("stripe-signature");

  try {
    /**
    // Verify the webhook signature and construct the event
    // We need to use the raw body and the signature to verify the event
    // The event will contain the payment intent and its associated charges
    // We will handle the "payment_intent.succeeded" event instead of "charge.succeeded"
    // This is because the payment intent is the main object that represents the entire payment process, 
    // and it contains the charges as a sub-object
    // The charge object is created when the payment intent is confirmed, 
    // but the payment intent is the one that contains the metadata we need to create the order
    */
    // Construct the event using the raw body and the signature stripe sdk
    const event = stripe.webhooks.constructEvent(
      _rawData,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("******Webhook signature verified successfully");
    console.log("******Webhook event received:=====>*", event.type);
    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const cartItems = session.metadata?.cartItems
          ? JSON.parse(session.metadata.cartItems)
          : [];
        const paymentIntentId = session.payment_intent;

        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId,
          {
            expand: ["latest_charge"],
          },
        );
        const latestCharge =
          paymentIntent.latest_charge &&
          typeof paymentIntent.latest_charge === "object"
            ? paymentIntent.latest_charge
            : null;
        const charge = latestCharge || paymentIntent.charges?.data?.[0];
        const shippingAddress =
          session.shipping_details?.address ||
          paymentIntent.shipping?.address ||
          charge?.shipping?.address ||
          null;

        const productIds = cartItems.map((item) => item._id);
        const products = await Product.find({ _id: { $in: productIds } });

        // Create an object to quickly map product details by product ID for easy access when creating the order
        const productMap = {};

        // Map product details to their IDs for easy access
        products.forEach((product) => {
          productMap[product._id.toString()] = {
            product: product._id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            image: product.images[0]?.secure_url || "",
          };
        });

        //create cartItems array with product details
        const cartItemsWithProductDetails = cartItems.map((cartItem) => ({
          ...productMap[cartItem._id],
          quantity: cartItem.quantity,
        }));

        //create order in the database with the payment intent and charge details, shipping info, userId, and cartItems
        const orderData = {
          chargeId:
            charge?.id ||
            (typeof paymentIntent.latest_charge === "string"
              ? paymentIntent.latest_charge
              : paymentIntentId),
          payment_intent: paymentIntentId,
          receipt_url: charge?.receipt_url || "",
          refunded: paymentIntent.amount_refunded > 0,
          status: paymentIntent.status,
          amount_captured:
            charge?.amount_captured ?? paymentIntent.amount_received ?? 0,
          currency: paymentIntent.currency,
          shipping: shippingAddress ? { address: shippingAddress } : undefined,
          userId,
          cartItems: cartItemsWithProductDetails,
          statusHistory: [{ status: "Not Processed", changedAt: new Date() }],
        };

        await Order.create(orderData);
        console.log(
          "Order created successfully for payment intent:",
          paymentIntentId,
        );

        // gather product ids from cartItems and decrement stock for each product
        for (const cartItem of cartItems) {
          const product = await Product.findById(cartItem._id);
          if (!product) continue;
          product.stock = Math.max(0, product.stock - cartItem.quantity);
          await product.save();
          console.log(
            `Stock decremented for product ${product._id}: new stock is ${product.stock}`,
          );
        }

        console.log("Stock decremented successfully for products in the order");
        return NextResponse.json({ ok: true });
      }
      default:
        console.log("Unhandled Stripe event type:", event.type);
        return NextResponse.json({ received: true });
    }
  } catch (err) {
    console.error("Stripe webhook error:", err);
    if (err?.type === "StripeSignatureVerificationError") {
      console.error(
        "Stripe signature verification failed. Check STRIPE_WEBHOOK_SECRET and Stripe endpoint configuration.",
      );
    }
    return NextResponse.json({
      err: "Server error, Try again later",
      status: 500,
    });
  }
}
