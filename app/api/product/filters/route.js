import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();
  // parse the query parameters from the request URL
  const searchParams = queryString.parseUrl(req.url).query;

  // destructure the search parameters (query params)
  const { page, category, brand, tag, ratings, minPrice, maxPrice } =
    searchParams || {};

  const pageSize = 6; // fixed page size

  // initialize an empty filter object
  const filter = {};
  // apply filters based on the presence of query parameters
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (tag) filter.tags = tag;
  if (minPrice && maxPrice) {
    filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }

  try {
    // determine the current page and page size and skip value for pagination
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    // retrieve all products based on the applied filter criteria
    const allProducts = await Product.find(filter)
      .populate("category", "name")
      .populate("tag", "name")
      .sort({ createdAt: -1 });

    //function to calculate the average rating of a product
    /**
     *
     * @param {*} ratings
     * @returns
     *  average rating
     */
    const calculateAverageRating = (ratings) => {
      if (!ratings || ratings.length === 0) return 0;
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      });
      return totalRating / ratings.length;
    };
    const ProductsWithAvgRatings = allProducts.map((product) => ({
      ...product.toObject(),
      averageRating: calculateAverageRating(product.ratings),
    }));
    // filter products based on ratings query params
  } catch (err) {
    console.log("Error in product filters route =>", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
