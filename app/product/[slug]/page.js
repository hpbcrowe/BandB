async function getProduct(slug) {
  const response = await fetch(`${process.env.API}/product/${slug}`, {
    method: "GET",
    next: { revalidate: 1 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const data = await response.json();
  return data;
}

export default async function ProductViewPage({ params }) {
  const product = await getProduct(params?.slug);
  console.log("product data in product view page => ", product);
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1 className="text-center">
            Product View Page - {JSON.stringify(product, null)}
          </h1>
        </div>
      </div>
    </div>
  );
}
