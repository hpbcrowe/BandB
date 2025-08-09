import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { name, parent } = body;

  try {
    const tag = await Tag.create({
      name,
      parent,
      slug: slugify(name),
    });
    return NextResponse.json(tag);
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json(err.message, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const tags = await Tag.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tags, { status: 200 });
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}
