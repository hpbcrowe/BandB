import ProductFilter from "@/components/product/ProductFilter";
import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";

async function getProducts(resolvedSearchParams) {
  const searchQuery = new URLSearchParams({
    // page: resolvedSearchParams.page || 1,
    minPrice: resolvedSearchParams.minPrice || "",
    maxPrice: resolvedSearchParams.maxPrice || "",
    // ratings: resolvedSearchParams.ratings || "",
    category: resolvedSearchParams.category || "",
    // tag: resolvedSearchParams.tag || "",
    // brand: resolvedSearchParams.brand || "",
  }).toString();
  console.log("search query in shop page => ", searchQuery);
}

export default async function Shop({ searchParams }) {
  //   console.log("searchParams in shop page => ", searchParams);
  const resolvedSearchParams = await searchParams;
  const data = await getProducts(resolvedSearchParams);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3">
          <ProductFilter searchParams={resolvedSearchParams} />
        </div>

        <div className="col-lg-9">Shop Latest products</div>
      </div>
    </div>
  );
}
