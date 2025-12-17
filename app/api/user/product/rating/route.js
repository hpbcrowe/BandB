import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
//import Order from '@/models/Order';
import { currentUser } from "@/utils/currentUser";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  console.log("Rating body:", body);
  const { productId, rating, comment } = body;
  const user = await currentUser(req);

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // check if user has already rated the product
    const existingRating = product.ratings.find(
      (rate) => rate.postedBy.toString() === user._id.toString()
    );

    if (existingRating) {
      // update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      // save the parent document
      await product.save();
      return NextResponse.json(product, { status: 200 });
    }
    //if user has not rated the product yet, add new rating
    const newRating = {
      rating,
      comment,
      postedBy: user._id,
    };
    product.ratings.push(newRating);
    const updated = await product.save();
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { err: "Server Error. Please try again later" },
      { status: 500 }
    );
  }
}
