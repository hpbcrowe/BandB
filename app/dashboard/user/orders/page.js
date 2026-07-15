"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

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
      // Replace with your actual API endpoint
      // For demonstration, the API endpoint is assumed to be /api/orders
      const response = await fetch(`${process.env.API}/user/orders`, {
        method: "GET",
      });
      // Check if the response is successful
      const data = await response.json();

      setOrders(data); // Assuming the API returns an object with an 'orders' array
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      // Replace with your actual API endpoint
      // For demonstration, the API endpoint is assumed to be /api/orders
      const response = await fetch(
        `${process.env.API}/user/orders/refund?orderId=${orderId}`,
        {
          method: "GET",
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

      setOrders(data); // Assuming the API returns an object with an 'orders' array
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  return (
    <div>
      <pre>{JSON.stringify(orders, null, 4)}</pre>
    </div>
  );
}
