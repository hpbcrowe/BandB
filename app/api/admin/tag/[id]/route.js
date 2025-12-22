import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";

/**
 *  Create a new tag.
 *   
 * @param {*} req 
 
 * @param {*} context 
 * @returns 
 * @description This function handles the creation of a new tag by connecting to the database,
 *  extracting the name and parent from the request body, and creating a new tag document in the database.
 */
export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { name } = body;

  try {
    const params = await context.params;
    const updatingTag = await Tag.findByIdAndUpdate(
      params.id,
      {
        ...body, // Spread the body to update all fields
        slug: slugify(name),
      },
      { new: true } // Return the updated document
    );
    return NextResponse.json(updatingTag, { status: 200 });
  } catch (err) {
    console.error("Error updating tag:", err);
    return NextResponse.json(err.message, { status: 500 });
  }
}

/**
 *
 * @param {*} req
 * @param {*} context
 * @returns
 * @description This function handles the deletion of a tag by connecting to the database,
 * finding the tag by its ID from the context parameters, and deleting it from the database.
 * It returns the deleted tag or an error message if the deletion fails.
 * @throws Will throw an error if the tag deletion fails
 *
 */
export async function DELETE(req, context) {
  await dbConnect();
  try {
    const params = await context.params;
    const deletingTag = await Tag.findByIdAndDelete(params.id);
    return NextResponse.json(deletingTag, { status: 200 });
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}
