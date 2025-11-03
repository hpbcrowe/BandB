import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
//import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

/**
 *  // Retrieves a product by its slug.
 * @param {*} req
 * @param {*} context
 * @returns
 * Fetches a product from the database based on the provided slug in the URL parameters.
 * Returns the product data as a JSON response.
 * Handles errors and returns an error message in case of failure.
 *
 */
export async function GET(req, context) {
  await dbConnect();

  try {
    const product = await Product.findOne({ slug: context.params.slug });
    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
