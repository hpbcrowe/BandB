import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { currentUser } from "@/utils/currentUser";
import Product from "@/models/product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const { cartItems } = await req.json();
  const user = await currentUser();

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
          //tax_rates: [""]
        };
      }),
    );
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
