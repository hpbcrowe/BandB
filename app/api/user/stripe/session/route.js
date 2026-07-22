import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
//import { currentUser } from "@/utils/currentUser";
import Product from "@/models/product";

import { getToken } from "next-auth/jwt";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  //console.log("Request body received in Stripe session route: ", await req.json());
  const { cartItems, couponCode } = await req.json();
  //const user = await currentUser();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const user = token?.user;
  const appOrigin =
    req.nextUrl.origin || process.env.DOMAIN || process.env.NEXTAUTH_URL;

  try {
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        const unitAmount = product.price * 100; // Convert to cents
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: [product.images[0].secure_url],
            },
            unit_amount: unitAmount,
          },
          tax_rates: process.env.STRIPE_TAX_RATE
            ? [process.env.STRIPE_TAX_RATE]
            : undefined,
          quantity: item.quantity,
        };
      }),
    );
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      success_url: `${appOrigin}/dashboard/user/stripe/success`,
      client_reference_id: user._id,
      mode: "payment",
      payment_method_types: ["card"],
      metadata: {
        cartItems: JSON.stringify(cartItems),
        userId: user._id,
      },
      shipping_options: [
        {
          shipping_rate: process.env.STRIPE_SHIPPING_RATE,
        },
      ],
      shipping_address_collection: { allowed_countries: ["US"] },
      discounts: couponCode ? [{ coupon: couponCode }] : undefined,
      customer_email: user.email,
    });
    //console.log("Stripe session created: =>***  ", session);
    return NextResponse.json(session);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        err: "An error occurred while creating the Stripe session. Please try again later.",
      },
      { status: 500 },
    );
  }
}
