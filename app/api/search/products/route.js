import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Category from "@/models/category";
import Tag from "@/models/tag";
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();
  const { productSearchQuery } = queryString.parseUrl(req.url).query;

  try {
    //search for categories and tags based on the productSearchQuery
    const [categories, tags] = await Promise.all([
      Category.find({ name: { $regex: productSearchQuery, $options: "i" } }),
      Tag.find({ name: { $regex: productSearchQuery, $options: "i" } }),
    ]);
    // Extract the IDs of the found categories and tags
    const categoryIds = categories.map((cat) => cat._id);
    const tagIds = tags.map((tag) => tag._id);
    // Search for products that match the search query in title or description
    // main product search query
    const products = await Product.find({
      $or: [
        { title: { $regex: productSearchQuery, $options: "i" } },
        { description: { $regex: productSearchQuery, $options: "i" } },
        { category: { $in: categoryIds } },
        { tags: { $in: tagIds } },
      ],
    })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
