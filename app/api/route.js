import { NextResponse } from "next/server";

/**
 *  // Simple API route that returns the current server time.
 * @param {*} req
 * @returns
 * Returns the current server time as a JSON response.
 * */

export async function GET(req) {
  return NextResponse.json({ time: new Date().toLocaleString() });
}
