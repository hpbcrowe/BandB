"use client";
import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/product/Pagination";
import { formatDate } from "@/utils/helpers";

/**
 * Admin Wishlisted Products Page
 * @returns
 * Lists products that have been liked/wishlisted by at least one user,
 * ranked by like count. Each row can be expanded to show exactly which
 * users liked the product (name/email), so an admin can reach out with a
 * targeted discount if needed.
 */
export default function AdminWishlistedProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    fetchWishlisted(page);
  }, [page]);

  const fetchWishlisted = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/wishlisted?page=${page}`,
        { method: "GET", credentials: "include", cache: "no-store" },
      );

      if (!response.ok) {
        setFetchError("Failed to load wishlisted products.");
        setProducts([]);
        return;
      }

      const data = await response.json();
      setFetchError("");
      setProducts(data?.products || []);
      setCurrentPage(data?.currentPage || 1);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching wishlisted products:", err);
      setFetchError("Unable to load wishlisted products.");
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
    <div className="container my-5">
      <h4 className="text-center fw-bold mb-4">Wishlisted Products</h4>

      {fetchError && (
        <div className="alert alert-warning" role="alert">
          {fetchError}
        </div>
      )}

      {!fetchError && products.length === 0 && (
        <div className="alert alert-secondary text-center" role="alert">
          No products have been wishlisted yet.
        </div>
      )}

      {products.length > 0 && (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Likes</th>
              <th>Stock</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Fragment key={product?._id}>
                <tr>
                  <td style={{ width: "60px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={
                          product?.images?.[0]?.secure_url ||
                          "/images/default.jpeg"
                        }
                        alt={product?.title}
                        width={48}
                        height={48}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <Link href={`/product/${product?.slug}`} target="_blank">
                      {product?.title}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {product?.likesCount}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        product?.stock === 0
                          ? "badge-danger"
                          : product?.stock <= 5
                            ? "badge-warning"
                            : "badge-secondary"
                      }`}
                    >
                      {product?.stock ?? 0}
                    </span>
                  </td>
                  <td>${product?.price?.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        setExpandedId(
                          expandedId === product?._id ? null : product?._id,
                        )
                      }
                    >
                      {expandedId === product?._id ? "Hide" : "Who liked this?"}
                    </button>
                  </td>
                </tr>
                {expandedId === product?._id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="p-3 alert alert-secondary mb-0">
                        <strong>Liked by:</strong>
                        <ul className="mb-0">
                          {product?.likes?.map((like, index) => (
                            <li
                              key={
                                like?.user?._id?.toString() ||
                                `${product?._id}-${index}`
                              }
                            >
                              {like?.user?.name || "Unknown user"} (
                              {like?.user?.email || "account deleted"}) —{" "}
                              {formatDate(like?.likedAt)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname={pathname}
      />
    </div>
  );
}
