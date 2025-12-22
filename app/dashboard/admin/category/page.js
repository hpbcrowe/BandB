import CategoryCreate from "@/components/category/CategoryCreate";
import CategoryList from "@/components/category/CategoryList";

/**
 *  Admin Category Page
 * @returns
 * Renders the admin category management page, including components for creating and listing categories.
 *
 */
export default function AdminCategory() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead"> Create Category</p>
          <CategoryCreate />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="lead"> List of Categories</p>
          <CategoryList />
        </div>
      </div>
    </div>
  );
}
