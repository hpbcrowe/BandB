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
      .populate("tags", "name")
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
    const productsWithAvgRatings = allProducts.map((product) => ({
      ...product.toObject(),
      averageRating: calculateAverageRating(product.ratings),
    }));
    // filter products based on ratings query params
    const filteredProducts = productsWithAvgRatings.filter((product) => {
      if (!ratings) return true; // if no ratings filter, include all products

      const targetRating = Number(ratings);
      const difference = product.averageRating - targetRating;
      /**
       * If the difference between the product's average rating and the target rating
       * is within ±0.5, include the product in the results.
       * For example, if the target rating is 4.0, include products with
       * average ratings between 3.5 and 4.5.
       */
      return difference >= -0.5 && difference <= 0.5;
    });
    // total number of filtered products
    const totalFilteredProducts = filteredProducts.length;

    //apply pagination to the filtered products
    const paginatedProducts = filteredProducts.slice(skip, skip + pageSize);
    // return the paginated products along with current page and total pages
    // as json response
    return NextResponse.json(
      {
        products: paginatedProducts,
        currentPage,
        totalPages: Math.ceil(totalFilteredProducts / pageSize),
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error in product filters route =>", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
