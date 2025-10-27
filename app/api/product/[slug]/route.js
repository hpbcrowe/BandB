import { NextResponse } from "next/server";
//import dbConnect from "@/utils/dbConnect";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export async function GET(req, context) {
  await dbConnect();

  try {
    const product = await Product.findOne({ slug: context.params.slug });
    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
