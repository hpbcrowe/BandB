"use client";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { useEffect } from "react";

export default function userStripeSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col text-center">
          <h1>Payment Successful</h1>
          <p>
            Thank you for your purchase. You can now check your order status in
            the dashboard.
          </p>
          <Link
            className="btn btn-primary btn-raised"
            href="/dashboard/user/orders"
          >
            View Order Status
          </Link>
        </div>
      </div>
    </div>
  );
}
