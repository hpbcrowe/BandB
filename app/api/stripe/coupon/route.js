import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const _request = await req.json();

  try {
    const coupon = await stripe.coupons.retrieve(_request.couponCode);
    //console.log("Coupon retrieved successfully:   ", coupon);
    return NextResponse.json(coupon);
  } catch (err) {
    console.log("Error validating coupon:", err);
    return NextResponse.json(err, { status: 400 });
  }
}
