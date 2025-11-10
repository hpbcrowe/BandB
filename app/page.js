import Image from "next/image";
import Pagination from "@/components/product/Pagination";
import ProductCard from "@/components/product/ProductCard";

async function getProducts(searchParams) {
  const searchQuery = new URLSearchParams({
    page: searchParams?.page || 1,
  }).toString();
  const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
    method: "GET",
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data;
}

export default async function Home({ searchParams }) {
  //console.log("made it to home page", searchParams);
  const { products, currentPage, totalPages } = await getProducts(searchParams);
  console.log("data in home page => ", { products, currentPage, totalPages });
  return (
    <div className="container">
      <h1 className="text-center mt-2">
        <strong>Latest Products</strong>
      </h1>
      <div className="row">
        {products?.map((product) => (
          <div className="col-lg-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/"
      />
    </div>
  );
}
