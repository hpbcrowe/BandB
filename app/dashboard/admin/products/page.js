"use client";
import ProductList from "@/components/admin/ProductList";

/**
 *  Admin Products List Page
 * @returns
 * Renders the admin page for listing products, including the ProductList component.
 *
 *
 */
export default function AdminProductsList() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p className="lead">List of Products</p>
          <hr />
          ..
          <ProductList />
        </div>
      </div>
    </div>
  );
}
