"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/product/Pagination";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = searchParams.get("page") || 1;

  const normalizeOrders = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.orders)) return payload.orders;
    return [];
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

  const handleStatusChange = async (newStatus, orderId) => {
    try {
      console.log(
        `Frontend: Attempting to update orderId: "${orderId}" (type: ${typeof orderId})`,
      );
      console.log(`Frontend: New status: ${newStatus}`);

      if (!orderId) {
        console.error("No orderId provided!");
        toast.error("Unable to update order: Order ID missing");
        return;
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ delivery_status: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });
      // Check if the response is successful
      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data?.err || `Failed to update order status (${response.status}).`;
        console.error(
          "Status update error:",
          errorMsg,
          "Status:",
          response.status,
        );
        toast.error(errorMsg);
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, delivery_status: newStatus }
              : order,
          ),
        );
        toast.success("Order status updated successfully.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Something went wrong while updating the order status.");
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
      {/* <pre>{JSON.stringify(orders, null, 4)}</pre> */}
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
            orders.map((order) => {
              console.log(`[ADMIN] Rendering order:`, order);
              return (
                <div
                  key={order._id || order.id}
                  className="mb-4 p-4 alert alert-secondary"
                >
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <th scope="row">Customer Name</th>
                        <td>{order?.userId?.name}</td>
                      </tr>
                      <tr>
                        <th scope="row">Order ID:</th>
                        <td>{order._id || order.id || "N/A"}</td>
                      </tr>
                      <tr>
                        <th scope="row">Charge ID:</th>
                        <td>{order?.chargeId}</td>
                      </tr>
                      <tr>
                        <th scope="row">Created:</th>
                        <td>
                          {new Date(order?.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Payment Intent:</th>
                        <td>{order?.payment_intent}</td>
                      </tr>
                      <tr>
                        <th scope="row">Receipt:</th>
                        <td>
                          <a href={order?.receipt_url} target="_blank">
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
                        <th scope="row">Shopping Address:</th>
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
                        <th scope="row" className="w-25">
                          Ordered Products:
                        </th>
                        <td className="w-75">
                          {order?.cartItems?.map((product) => (
                            <div
                              className="pointer text-primary"
                              key={product?._id}
                              onClick={() =>
                                router.push(`/product/${product?.slug}`)
                              }
                            >
                              {product?.quantity} x {product?.title} $
                              {product?.price?.toFixed(2)}{" "}
                              {order?.currency?.toUpperCase()}
                            </div>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Delivery Status</th>
                        <td>
                          <select
                            className="form-control"
                            onChange={(e) =>
                              handleStatusChange(
                                e.target.value,
                                order._id || order.id,
                              )
                            }
                            value={order?.delivery_status}
                            disabled={order?.refunded}
                          >
                            <option value="Not Processed">Not Processed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            {order?.refunded && (
                              <option value="Cancelled">Cancelled</option>
                            )}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
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
