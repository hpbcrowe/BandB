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
    // `context.params` can be a thenable in some Next.js runtimes — await it
    const params = await context.params;
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    const product = await Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("tags", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/product/[slug] =>", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
