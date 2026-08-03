"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";

/**
 * User Wishlist Page
 * @returns
 * Fetches and displays the products the current user has liked via the
 * existing `GET /api/user/product/like` endpoint (no new backend logic
 * needed - that endpoint already returns all products liked by the user).
 * Renders each product with the existing ProductCard component, which
 * already includes an "Add to Cart" action.
 */
export default function UserWishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${process.env.API}/user/product/like`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setFetchError("Failed to load your wishlist.");
        setProducts([]);
        return;
      }

      const data = await response.json();
      setFetchError("");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setFetchError("Unable to load your wishlist. Please try again later.");
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
      <h4 className="text-center fw-bold mt-3">My Wishlist</h4>

      {fetchError && (
        <div className="alert alert-warning" role="alert">
          {fetchError}
        </div>
      )}

      {!fetchError && products.length === 0 && (
        <div className="alert alert-secondary text-center" role="alert">
          Your wishlist is empty. Like products to save them here.
        </div>
      )}

      <div className="row">
        {products.map((product) => (
          <div key={product?._id} className="col-lg-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
