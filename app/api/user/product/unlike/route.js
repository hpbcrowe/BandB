import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";

/**
 *  Unlikes a product.
 * @param {*} req
 * @returns
 * Removes the current user's ID from the likes array of the specified product.
 * Handles errors and returns an error message in case of failure.
 *
 */
export async function PUT(req) {
  await dbConnect();
  const user = await currentUser();

  const { productId } = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(
      productId,
      { $pull: { likes: user._id } },
      { new: true }
    );
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
