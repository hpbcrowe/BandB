import Link from "next/link";
export default function userStripeSuccess() {
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
