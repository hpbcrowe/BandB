import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  //Use deconstruct to pull name, email, password out of the body
  const { name, email, password } = body;
  try {
    await new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    }).save();

    return NextResponse.json({
      success: " Whoop whoop, registered successfully",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
