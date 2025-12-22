import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";
import slugify from "slugify";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { name } = body;
  try {
    const params = await context.params;
    const updatingCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        ...body,
        slug: slugify(name),
      },
      { new: true }
    );
    return NextResponse.json(updatingCategory, { status: 200 });
  } catch (err) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  try {
    const params = await context.params;
    const deletingCategory = await Category.findByIdAndDelete(params.id);
    return NextResponse.json(deletingCategory, { status: 200 });
  } catch (err) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
