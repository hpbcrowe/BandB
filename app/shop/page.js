import ProductFilter from "@/components/product/ProductFilter";
import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";
import config from "../../config";
// Force dynamic rendering for server-side rendering on each request
export const dynamic = "force-dynamic";

async function getProducts(resolvedSearchParams) {
  const searchQuery = new URLSearchParams({
    page: resolvedSearchParams.page || 1,
    minPrice: resolvedSearchParams.minPrice || "",
    maxPrice: resolvedSearchParams.maxPrice || "",
    ratings: resolvedSearchParams.ratings || "",
    category: resolvedSearchParams.category || "",
    tag: resolvedSearchParams.tag || "",
    brand: resolvedSearchParams.brand || "",
  }).toString();
  console.log("search query in shop page => ", searchQuery);

  try {
    const API_BASE = process.env.API || config.API;
    const url = `${API_BASE}/product/filters?${searchQuery}`;
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      // capture body (if any) to help diagnose server errors
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (e) {
        /* ignore */
      }
      console.error(
        `Product fetch failed: ${response.status} ${response.statusText} -> ${bodyText} (url: ${url})`
      );
      // return a safe fallback so the page renders instead of surfacing a thrown error
      return { products: [], currentPage: 1, totalPages: 1 };
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.products)) {
      console.error("Invalid products payload from API", { url, data });
      return { products: [], currentPage: 1, totalPages: 1 };
    }
    return data;
  } catch (err) {
    console.error("Error fetching products:", err);
    return { products: [], currentPage: 1, totalPages: 1 };
  }
}

export default async function Shop({ searchParams }) {
  //   console.log("searchParams in shop page => ", searchParams);
  const resolvedSearchParams = await searchParams;
  const { currentPage, totalPages, products } = await getProducts(
    resolvedSearchParams
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 overflow-auto" style={{ maxHeight: "90vh" }}>
          <ProductFilter searchParams={resolvedSearchParams} />
        </div>

        <div className="col-lg-9">
          <h4 className="text-center fw-bold mt-3">Shop Latest Products</h4>
          <div className="row">
            {products?.map((product) => (
              <div key={product?._id} className="col-lg-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={resolvedSearchParams}
            pathname="/shop"
          />
        </div>
      </div>
    </div>
  );
}
