import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import slugify from "slugify";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const product = await Product.create({
      // other fields
      // Add slug field
      ...body,
      slug: slugify(body.title),
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
