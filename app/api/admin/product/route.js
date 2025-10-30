import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import slugify from "slugify";

/**
 * // Creates a new product.
 * @param {*} req
 * @returns
 */

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  // Support clients that send { product: { ... } } as well as the product
  // object at the top level. Prefer the nested `product` when present.
  const payload = body?.product ?? body;
  console.error("made it to the api route", payload);
  try {
    const product = await Product.create({
      ...payload,
      slug: slugify(payload?.title || ""),
    });
    console.log("Created product => ", product);
    console.error("made it created product");
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Error creating product =>", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
