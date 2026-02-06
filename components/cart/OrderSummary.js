"use client";
import { useCart } from "@/context/cart";
import Image from "next/image";

export default function OrderSummary() {
  const { cartItems } = useCart();
  /**
   *  Calculate the total price of items in the cart by summing up the product of price and quantity for each item.
   * @param {Array} cartItems - An array of cart items, where each item has 'price' and 'quantity' properties.
   * @returns   {number} The total price of items in the cart.
   */
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item?.price * item?.quantity,
      0,
    );
  };
  /**
   * Calculate the total number of items in the cart by summing up the quantity of each item.
   * @param {Array} cartItems - An array of cart items, where each item has a 'quantity' property.
   * @returns {number} The total number of items in the cart.
   *
   */
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  // item or items
  const itemOrItems = totalItems === 1 ? "item" : "items";

  return (
    <div>
      <p className="alert alert-primary">Order Summary</p>
      <ul className="list-unstyled">
        {cartItems?.map((product) => (
          <div className="card mb-3" key={product?._id}>
            <div className="row g-0 d-flex align-items-center p-1">
              <div className="col-md-3">
                <div style={{ height: "66px", overflow: "hidden" }}>
                  <Image
                    src={
                      product?.images?.[0]?.secure_url || "/images/default.jpeg"
                    }
                    className="card-img-top"
                    width={500}
                    height={300}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    alt={product?.title}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
