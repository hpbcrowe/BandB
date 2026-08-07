"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/product/Pagination";
import { formatDate } from "@/utils/helpers";

const STATUS_BADGE_CLASS = {
  "Not Processed": "badge-secondary",
  Processing: "badge-info",
  Shipped: "badge-primary",
  Delivered: "badge-success",
  Cancelled: "badge-dark",
  Refunded: "badge-danger",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = searchParams.get("page") || 1;

  const normalizeOrders = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.orders)) return payload.orders;
    return [];
  };

  // Groups orders by their creation date (day granularity), preserving the
  // order they were received in (assumes orders arrive sorted by date).
  const groupOrdersByDate = (ordersList) => {
    const groups = [];
    const groupsByLabel = {};

    ordersList.forEach((order) => {
      const label = formatDate(order?.createdAt);
      if (!groupsByLabel[label]) {
        groupsByLabel[label] = { label, orders: [] };
        groups.push(groupsByLabel[label]);
      }
      groupsByLabel[label].orders.push(order);
    });

    return groups;
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // Function to fetch orders from the API
  // Note: Replace the URL with your actual API endpoint
  // For demonstration, the API endpoint is assumed to be /api/orders
  // In a real application, you would also handle authentication and include necessary headers
  // Example API call to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/admin/orders?page=${page}`, {
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

      setOrders(normalizeOrders(data.orders));
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
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
            groupOrdersByDate(orders).map((group) => (
              <div key={group.label} className="mb-4">
                <h6 className="border-bottom pb-2 mb-3">{group.label}</h6>
                {group.orders.map((order) => {
                  const orderId = order._id || order.id;
                  return (
                    <div
                      key={orderId}
                      className="mb-3 p-3 alert alert-secondary d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <div>
                        <div>
                          <strong>Customer:</strong>{" "}
                          {order?.userId?.name || "N/A"}
                        </div>
                        <div>
                          <strong>Order ID:</strong> {orderId}
                        </div>
                        <div>
                          <strong>Charge ID:</strong> {order?.chargeId}
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
                          href={`/dashboard/admin/orders/${orderId}?page=${currentPage}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname={pathname}
      />
    </div>
  );
}
