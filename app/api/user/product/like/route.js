import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";

/**
 *  Retrieves products liked by the current user.
 * @param {*} req
 * @returns
 * Fetches products that the current user has liked from the database.
 * Returns the liked products as a JSON response.
 * Handles errors and returns an error message in case of failure.
 */

export async function GET(req) {
  await dbConnect();
  const user = await currentUser();

  try {
    //  Retrieve products liked by the current user
    const likedProducts = await Product.find({ likes: user._id });
    return NextResponse.json(likedProducts, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

/**
 *  Likes a product.
 * @param {*} req
 * @returns
 * Adds the current user's ID to the likes array of the specified product.
 * Handles errors and returns an error message in case of failure.
 *
 */
export async function PUT(req) {
  await dbConnect();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(
      productId,
      { $addToSet: { likes: user._id } },
      { new: true }
    );
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
