import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import queryString from "query-string";

/**
 * Lists products that have at least one like (wishlist), sorted by how many
 * users have liked them (most-wishlisted first). Each product's `likes` is
 * populated with basic user info (name/email) so an admin can see exactly
 * who wishlisted it, e.g. to extend a targeted discount.
 * @param {Request} req
 * @returns {Promise<NextResponse>}
 */
export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams || {};
  const pageSize = 10;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    const matchStage = {
      $match: { $expr: { $gt: [{ $size: { $ifNull: ["$likes", []] } }, 0] } },
    };

    const totalResult = await Product.aggregate([
      matchStage,
      { $count: "total" },
    ]);
    const totalProducts = totalResult[0]?.total || 0;

    const products = await Product.aggregate([
      matchStage,
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: { likesCount: -1, updatedAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          title: 1,
          slug: 1,
          price: 1,
          stock: 1,
          images: 1,
          likes: 1,
          likesCount: 1,
        },
      },
    ]);

    await Product.populate(products, {
      path: "likes.user",
      select: "name email",
    });

    return NextResponse.json({
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageSize),
    });
  } catch (err) {
    console.error("[ADMIN WISHLISTED PRODUCTS GET] Error:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
