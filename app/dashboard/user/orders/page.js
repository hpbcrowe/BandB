"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_BADGE_CLASS = {
  "Not Processed": "badge-secondary",
  Processing: "badge-info",
  Shipped: "badge-primary",
  Delivered: "badge-success",
  Cancelled: "badge-dark",
  Refunded: "badge-danger",
};

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const normalizeOrders = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.orders)) return payload.orders;
    return [];
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders from the API
  // Note: Replace the URL with your actual API endpoint
  // For demonstration, the API endpoint is assumed to be /api/orders
  // In a real application, you would also handle authentication and include necessary headers
  // Example API call to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/user/orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        if (contentType.includes("application/json")) {
          const payload = await response.json();
          setFetchError(payload?.err || "Failed to load recent orders.");
        } else {
          setFetchError(`Failed to load recent orders (${response.status}).`);
        }
        setOrders([]);
        return;
      }

      if (!contentType.includes("application/json")) {
        setFetchError(
          "Unexpected server response. Please sign in again and retry.",
        );
        setOrders([]);
        return;
      }

      const data = await response.json();
      setFetchError("");

      setOrders(normalizeOrders(data));
    } catch (err) {
      console.error("Error fetching orders:", err);
      setFetchError("Unable to load recent orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-danger vh-100 h1">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <h4 className="text-center">Recent Orders</h4>
          {fetchError && (
            <div className="alert alert-warning" role="alert">
              {fetchError}
            </div>
          )}
          {!fetchError && orders?.length === 0 && (
            <div className="alert alert-info" role="alert">
              No recent orders found for this account.
            </div>
          )}
          {orders?.length > 0 &&
            orders.map((order) => (
              <div
                key={order._id}
                className="mb-3 p-3 alert alert-secondary d-flex justify-content-between align-items-center flex-wrap"
              >
                <div>
                  <div>
                    <strong>Order ID:</strong> {order?._id}
                  </div>
                  <div>
                    <strong>Charge ID:</strong> {order?.chargeId}
                  </div>
                  <div>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Total Charged:</strong> $
                    {(order?.amount_captured / 100).toFixed(2)}{" "}
                    {order?.currency?.toUpperCase()}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`badge d-inline-flex align-items-center justify-content-center ${
                        STATUS_BADGE_CLASS[order?.delivery_status] ||
                        "badge-secondary"
                      }`}
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.25rem 0.5rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {order?.delivery_status}
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Link
                    href={`/dashboard/user/orders/${order?._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
