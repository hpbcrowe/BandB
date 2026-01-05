import ProductFilter from "@/components/product/ProductFilter";
import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";
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
    const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.products)) {
      throw new Error("No products returned from API");
    }
    return data;
  } catch (err) {
    console.error(err);
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
