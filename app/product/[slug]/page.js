import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductImage from "@/components/product/ProductImage";
import ProductLike from "@/components/product/ProductLike";
import ProductRating from "@/components/product/ProductRating";
import Product from "@/models/product";

dayjs.extend(relativeTime);

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
  // `params` can be a thenable in some Next.js runtimes — await it first
  const resolvedParams = (await params) || {};
  const product = await getProduct(resolvedParams?.slug);
  console.log("product data in product view page => ", product);
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 offset-lg-2 card py-5">
          <h1 className="text-center">{product?.title}</h1>
          {/*Show product Image in modal */}
          <ProductImage product={product} />
          <div className="card-body">
            <div
              dangerouslySetInnerHTML={{
                __html: product?.description.replace(/\./g, ".<br/><br/>"),
              }}
            />
            <div className="alert alert-primary">Brand: {product?.brand}</div>
          </div>
          {/* Before accessing category and tags, make suer .populate() is used 
      in api routes and ref: "Category" models are imported in product model */}
          <div
            key={product?._id}
            className="card-footer d-flex justify-content-between"
          >
            <small>Category: {product?.category?.name}</small>
            <small>Tags: {product?.tags?.map((t) => t?.name).join(" ")}</small>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <ProductLike product={product} />
            <small>Posted {dayjs(product?.createdAt).fromNow()}</small>
          </div>
          <div className="card-footer">
            {" "}
            <ProductRating product={product} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h4 className="text-center my-5">Related Products</h4>
        </div>
      </div>
    </div>
  );
}
