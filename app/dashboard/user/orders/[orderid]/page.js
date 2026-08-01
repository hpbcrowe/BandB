"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import OrderStatusTimeline from "@/components/order/OrderStatusTimeline";
import { formatDate } from "@/utils/helpers";

export default function UserOrderDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderid;

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/user/orders/${orderId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        if (contentType.includes("application/json")) {
          const payload = await response.json();
          setFetchError(payload?.err || "Failed to load order details.");
        } else {
          setFetchError(`Failed to load order details (${response.status}).`);
        }
        setOrder(null);
        return;
      }

      const data = await response.json();
      setFetchError("");
      setOrder(data?.order || null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setFetchError("Unable to load order details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(
        `/api/user/orders/refund?orderId=${orderId}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        toast.error("Something went wrong while canceling the order.");
      } else {
        toast.success("Order canceled successfully.");
        fetchOrder();
      }
    } catch (err) {
      console.error("Error canceling order:", err);
      toast.error(
        "Something went wrong while canceling the order. Try again later.",
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-danger vh-100 h1">
        Loading...
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="container mb-5">
        <div className="alert alert-warning" role="alert">
          {fetchError || "Order not found."}
        </div>
        <Link href="/dashboard/user/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Order Details</h4>
            <Link href="/dashboard/user/orders" className="btn btn-secondary">
              Back to Orders
            </Link>
          </div>

          <OrderStatusTimeline
            deliveryStatus={order?.delivery_status}
            refunded={order?.refunded}
            statusHistory={order?.statusHistory}
          />

          <div className="p-4 alert alert-secondary">
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th scope="row">Order ID:</th>
                  <td>{order?._id}</td>
                </tr>
                <tr>
                  <th scope="row">Charge ID:</th>
                  <td>{order?.chargeId}</td>
                </tr>
                <tr>
                  <th scope="row">Created:</th>
                  <td>{formatDate(order?.createdAt)}</td>
                </tr>
                <tr>
                  <th scope="row">Payment Intent:</th>
                  <td>{order?.payment_intent}</td>
                </tr>
                <tr>
                  <th scope="row">Receipt:</th>
                  <td>
                    <a
                      href={order?.receipt_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Receipt
                    </a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Refunded:</th>
                  <td>{order?.refunded ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th scope="row">Status:</th>
                  <td>{order?.status}</td>
                </tr>
                <tr>
                  <th scope="row">Total Charged:</th>
                  <td>
                    ${(order?.amount_captured / 100).toFixed(2)}{" "}
                    {order?.currency?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Shipping Address:</th>
                  <td>
                    {order?.shipping?.address?.line1} <br />
                    {order?.shipping?.address?.line2
                      ? order?.shipping?.address?.line2 + ", "
                      : ""}
                    {order?.shipping?.address?.city},{" "}
                    {order?.shipping?.address?.state}{" "}
                    {order?.shipping?.address?.postal_code} <br />
                    {order?.shipping?.address?.country}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Delivery Status</th>
                  <td>
                    {order?.delivery_status}
                    {order?.delivery_status === "Not Processed" &&
                      !order?.refunded && (
                        <>
                          <br />
                          <span
                            className="text-danger pointer"
                            onClick={handleCancelOrder}
                          >
                            Cancel Order
                          </span>
                        </>
                      )}
                  </td>
                </tr>
              </tbody>
            </table>

            <h5 className="mt-4">Ordered Products</h5>
            {order?.cartItems?.map((product) => (
              <div
                key={product?._id}
                className="d-flex align-items-center mb-3 pb-3 border-bottom"
              >
                <div
                  style={{ width: "80px", height: "80px", overflow: "hidden" }}
                  className="me-3 flex-shrink-0"
                >
                  <Image
                    src={product?.image || "/images/default.jpg"}
                    alt={product?.title}
                    width={80}
                    height={80}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div
                  className="pointer text-primary"
                  onClick={() => router.push(`/product/${product?.slug}`)}
                >
                  {product?.quantity} x {product?.title} $
                  {product?.price?.toFixed(2)} {order?.currency?.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
