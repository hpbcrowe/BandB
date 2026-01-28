import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

export async function GET(req) {
  await dbConnect();
  try {
    const brands = await Product.distinct("brand");
    return NextResponse.json({ brands }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { err: "An Error has occured. Try again" },
      { status: 500 }
    );
  }
}
