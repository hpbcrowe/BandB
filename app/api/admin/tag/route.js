import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
await dbConnect();
import Tag from "@/models/tag";
import slugify from "slugify";

/**
 *  * Create a new tag.
 * @param {*} req
 * @returns
 *    * @description This function handles the creation of a new tag by connecting to the database,
 *  * extracting the name and parent from the request body, and creating a new tag document in the database.
 * * @throws Will throw an error if the tag creation fails
 *
 */

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  // Destructure the name and parent from the body
  // Assuming the body contains { name: string, parent: string }
  // console.log("****body =>", body);

  const { name, parentCategory } = body;

  try {
    // Create a new tag with the provided name and parent
    // The slug is generated from the name using slugify
    //
    const tag = await Tag.create({
      name,
      parentCategory,
      slug: slugify(name),
    });
    return NextResponse.json(tag);
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json(err.message, { status: 500 });
  }
}

/**
 * * @param {*} req
 * * @param {*} context
 *
 * @returns
 * @description This function handles the retrieval of all tags by connecting to the database,
 * fetching all tag documents, and returning them in the response.
 * * @throws Will throw an error if the tag retrieval fails
 *
 *
 */
export async function GET() {
  await dbConnect();
  try {
    const tags = await Tag.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tags, { status: 200 });
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}
