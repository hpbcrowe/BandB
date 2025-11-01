"use client";
import { useEffect } from "react";
import { useProduct } from "@/context/product";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image"; // Import the Image component from Next.js
import Link from "next/link";

export default function ProductList() {
  const {
    products,
    currentPage,
    totalPages,
    fetchProducts,
    setUpdatingProduct,
  } = useProduct();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleClick = (product) => {
    setUpdatingProduct(product);
    router.push("/dashboard/admin/product");
  };

  return (
    <div className="container my-5">
      <div className="row gx-3">
        {/* <pre>{JSON.stringify(products, null, 4)}</pre>*/}
        {products?.map((product) => (
          <div key={product?._id} className="col-lg-6 my-3 card">
            <div style={{ height: "200px", overflow: "hidden" }}>
              <Image
                src={product?.images[0]?.secure_url || "/images/default.jpeg"}
                alt={product?.title}
                width={500}
                height={300}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="card-body">
              <h5
                className="card-title pointer"
                onClick={() => handleClick(product)}
              >
                ${product?.price?.toFixed(2)} {product?.title}
              </h5>
              <p className="card-text">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      product?.description?.length > 160
                        ? `${product?.description?.substring(0, 160)}...`
                        : product?.description,
                  }}
                ></div>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col text-center">
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      href={`${pathname}?page=${page}`}
                      as={`${pathname}?page=${page}`}
                    >
                      {page}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
