"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const router = useRouter();

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

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `/api/user/orders/refund?orderId=${orderId}`,
        {
          method: "POST",
        },
      );
      // Check if the response is successful
      const data = await response.json();

      if (!response.ok) {
        toast.error("Something went wrong while canceling the order.");
      } else {
        toast.success("Order canceled successfully.");
        fetchOrders(); // Refresh the orders list after cancellation
      }

      setOrders(normalizeOrders(data));
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(
        "Something went wrong while canceling the order.Try again later.",
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
            orders.map((order) => (
              <div key={order._id} className="mb-4 p-4 alert alert-secondary">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Charge ID:</th>
                      <td>{order?.chargeId}</td>
                    </tr>
                    <tr>
                      <th scope="row">Created:</th>
                      <td>{new Date(order?.createdAt).toLocaleDateString()}</td>
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
                        {order?.delivery_status}
                        {order?.delivery_status === "Not Processed" &&
                          !order?.refunded && (
                            <>
                              <br />
                              <span
                                className="text-danger pointer"
                                onClick={() => handleCancelOrder(order?._id)}
                              >
                                {" "}
                                Cancel Order
                              </span>
                            </>
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
