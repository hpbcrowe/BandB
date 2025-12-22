import ProductCreate from "@/components/product/ProductCreate";

/**
 *  Add Product Page
 * @returns
 * Renders the admin page for adding a new product, including the ProductCreate component.
 *
 */
export default function AddProduct() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <ProductCreate />
        </div>
      </div>
    </div>
  );
}
