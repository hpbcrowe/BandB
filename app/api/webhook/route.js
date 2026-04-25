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
  const _raw = await req.text();
  const sig = req.headers.get("stripe-signature");

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
      _raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("******Webhook event received:=====>*", event);
    console.log("******Received event type:", event.type);
    // Handle the event based on its type
    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object; // Now the payment intent object
        const { id, ...rest } = chargeSucceeded; // Extract id and rest of the properties from the payment intent

        //decrement the stock of the products in the order
        //gather product ids from the metadata of the payment intent ../user/stripe/session.js
        const cartItems = JSON.parse(chargeSucceeded.metadata.cartItems);
        const productIds = cartItems.map((item) => item._id);

        //fetch all products in one query
        const products = await Product.find({ _id: { $in: productIds } });

        //create an object to quickly map product details by id
        const productMap = {};
        //populate the productMap with the fetched products
        products.forEach((product) => {
          productMap[product._id.toString()] = {
            product: product._id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            image: product.images[0]?.secure_url || "", // Use the first image's secure_url or an empty string if no images
          };
        });

        //create cart items with  product details
        const cartItemsWithProductDetails = cartItems.map((cartItem) => ({
          ...productMap[cartItem._id], // Get product details from the productMap using the productId
          quantity: cartItem.quantity, // Add the quantity from the cart item
        }));

        //create the order in the database
        const orderData = {
          ...rest, // Include all other properties from the payment intent except id
          chargeId: id, // Use the extracted id as chargeId in the order
          userId: chargeSucceeded.metadata.userId, // Get the userId from the metadata of the payment intent
          cartItems: cartItemsWithProductDetails, // Use the cart items with product details
        };

        await Order.create(orderData); // Create the order in the database
        console.log("Order created successfully with chargeId:", id);

        // Decrement the stock of each product in the order
        for (const cartItem of cartItems) {
          const product = await Product.findById(cartItem.productId);
          product.stock = product.stock - cartItem.quantity; // Decrement the stock by the quantity in the cart item
          await product.save(); // Save the updated product to the database
          console.log(
            `Stock decremented for product ${product._id}: new stock is ${product.stock}`,
          ); // Log the new stock level for each product
        }
        console.log("Stock decremented successfully for products in the order");
        return NextResponse.json({ ok: true });
    }
  } catch (err) {
    console.log("Webhook signature verification failed.", err.message);
    return NextResponse.json({
      err: "Server error, Try again later",
      status: 500,
    });
  }
}
