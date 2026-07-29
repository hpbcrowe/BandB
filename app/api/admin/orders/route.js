import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";
import queryString from "query-string";
/**
 * Update the delivery status of an order.
 * @param {Request} req - The incoming request object.
 * @param {Object} context - The context object containing route parameters.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams || {};
  const pageSize = 3;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const totalOrders = await Order.countDocuments();

    console.log(
      `[ADMIN ORDERS GET] Fetching orders - page: ${currentPage}, skip: ${skip}, pageSize: ${pageSize}`,
    );

    const orders = await Order.find({})
      .populate("userId", "name")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    console.log(
      `[ADMIN ORDERS GET] Found ${orders.length} orders. Sample:`,
      orders[0],
    );

    return NextResponse.json({
      orders,
      currentPage,
      totalPages: Math.ceil(totalOrders / pageSize),
    });
  } catch (err) {
    console.error(`[ADMIN ORDERS GET] Error:`, err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
