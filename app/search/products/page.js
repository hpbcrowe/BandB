"use client";

import { use, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { useProduct } from "@/context/product";

export default function SearchProductsPage() {
  const {
    setProductSearchQuery,
    productSearchResults,
    setProductSearchResults,
  } = useProduct();

  const productSearchParams = useSearchParams();
  const query = productSearchParams.get("productSearchQuery");

  useEffect(() => {
    if (query) {
      setProductSearchQuery(query);
      fetchProductResultsOnLoad(query);
    }
  }, [query]);

  /**
   * fetchProductResultsOnLoad
   * @param {*} query
   * Returns the product search results for the given query and updates the state.
   *
   */

  const fetchProductResultsOnLoad = async (query) => {
    try {
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${query}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(
          "Failed to fetch product search results, network response was not ok"
        );
      }
      const data = await response.json();
      console.log("*****Product search results data => ", data);
      setProductSearchResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4>
            Search Results{" "}
            {productSearchResults.length > 0
              ? `(${productSearchResults.length})`
              : ""}
          </h4>
          <div className="row">
            {productSearchResults?.map((product) => (
              <div key={product?._id} className="col-lg-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
