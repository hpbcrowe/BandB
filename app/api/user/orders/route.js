import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import { currentUser } from "@/utils/currentUser";
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams || {};
  const pageSize = 3;

  try {
    const user = await currentUser(req);

    if (!user?._id) {
      return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const totalOrders = await Order.countDocuments({ userId: user._id });

    const orders = await Order.find({ userId: user._id })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      orders,
      currentPage,
      totalPages: Math.ceil(totalOrders / pageSize),
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
