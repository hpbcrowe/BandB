import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

/**
 *
 * @param {*} req
 * @param {*} context
 * @returns
 * Update a product by ID
 * PUT /api/admin/product/:id
 *
 */

export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  try {
    const params = await context.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      body,
      { ...body },
      { new: true }
    );
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 *
 * @param {*} req
 * @param {*} context
 * @returns
 * Delete a product by ID
 * DELETE /api/admin/product/:id
 *
 */
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const params = await context.params;
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    return NextResponse.json(deletedProduct, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
