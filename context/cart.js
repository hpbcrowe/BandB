import { set } from "mongoose";
import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [percentOff, setPercentOff] = useState(0);
  const [validCoupon, setValidCoupon] = useState(false);

  //load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    setCartItems(storedCartItems || []);
  }, []);

  // save cart items to localStorage whenever cartItems state changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   *  Add a product to the cart. This function checks if the product already
   * exists in the cart.
   *  If it does, it updates the quantity of that product. If not,
   *  it adds the new product
   *  to the cart with the specified quantity.
   * @param {*} product - The product object to be added to the cart.
   * @param {*} quantity - The quantity of the product to be added.
   */
  //add to cart
  const addToCart = (product, quantity) => {
    const existingProduct = cartItems.find((item) => item._id === product._id);
    if (existingProduct) {
      // If product already exists in cart, update quantity
      const updatedCartItems = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCartItems(updatedCartItems);
    } else {
      // If product does not exist in cart, add new item
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  /**
   * Remove a product from the cart based on its ID. This function filters
   *  the current cart items and removes the item with the matching ID.
   *  The updated cart items are then set in the state.
   * @param {*} productId - The ID of the product to be removed from the cart.
   */

  //remove from cart
  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCartItems);
  };

  /**
   * Update the quantity of a specific product in the cart. This function takes
   *  a product object and a new quantity as parameters.
   *  It maps through the current cart items,
   *  and if it finds the product with the matching ID, it updates its quantity.
   *  The updated cart items are then set in the state and also saved to local
   *  storage for persistence.   *
   * @param {*} product - The product object whose quantity needs to be updated.
   * @param {*} quantity - The new quantity for the specified product.
   */
  //update cart item quantity
  const updateQuantity = (product, quantity) => {
    const updatedItems = cartItems.map((item) =>
      item._id === product._id ? { ...item, quantity } : item,
    );

    //update state
    setCartItems(updatedItems);
    //update local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }
  };
  /**
   * Handle coupon validation by sending a POST request to the API endpoint with
   *  the coupon code.
   * If the response is successful, update the percentOff and validCoupon state.
   * If the response is not successful, reset the percentOff and validCoupon
   * state and show an error toast.
   *
   * @param {*} coupon
   *  @returns
   *
   */
  const handleCoupon = async (coupon) => {
    try {
      const response = await fetch(`${process.env.API}/stripe/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode: coupon }),
      });

      if (!response.ok) {
        setPercentOff(0);
        setValidCoupon(false);
        toast.error("Invalid coupon code");
        return;
      } else {
        const data = await response.json();
        setPercentOff(data.percent_off);
        setValidCoupon(true);
        toast.success(
          `${data?.name} coupon applied! You got ${data.percent_off}% off`,
          { style: { whiteSpace: "nowrap" } },
        );
      }
    } catch (err) {
      console.log("Error validating coupon:", err);
      setPercentOff(0);
      setValidCoupon(false);
      toast.error("Invalid coupon code");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        couponCode,
        setCouponCode,
        handleCoupon,
        percentOff,
        validCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
