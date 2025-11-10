import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import queryString from "query-string";

/**
 *  // Get a paginated list of products
 * @param {*} req
 * @returns
 * Get a paginated list of products
 *  The page number is passed as a query parameter
 *  e.g., /api/products?page=2
 * Page size is fixed at 6 products per page
 * Returns the products for the requested page along with total pages
 * /    api/products?page=2
 */

export async function GET(req) {
  await dbConnect();
  // Parse the query parameters
  const searchParams = queryString.parseUrl(req.url).query;
  // Extract the page number, default to 1 if not provided
  const { page } = searchParams || {};
  // Fixed page size
  const pageSize = 6;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const totalProducts = await Product.countDocuments();

    const products = await Product.find({})
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        products,
        currentPage,
        totalPages: Math.ceil(totalProducts / pageSize),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
