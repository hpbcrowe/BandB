import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
await dbConnect();
import Tag from "@/models/tag";

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
