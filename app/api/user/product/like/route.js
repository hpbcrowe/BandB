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
    const likedProducts = await Product.find({ "likes.user": user._id });
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
    // Only add a like entry if this user hasn't already liked the product,
    // so re-liking doesn't overwrite the original likedAt timestamp.
    const alreadyLiked = await Product.exists({
      _id: productId,
      "likes.user": user._id,
    });

    if (!alreadyLiked) {
      await Product.findByIdAndUpdate(productId, {
        $push: { likes: { user: user._id, likedAt: new Date() } },
      });
    }

    const updated = await Product.findById(productId);
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
