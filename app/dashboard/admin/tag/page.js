import TagCreate from "@/components/tag/TagCreate";
import TagList from "@/components/tag/TagList";

// This is the main admin tags page that will render both TagCreate and TagList components
// It serves as a container for the tag management functionalities
export default function AdminTags() {
  return (
    <div className="container ">
      <div className="row my-5">
        <div className="col">
          <p className="lead">Create Tags</p>
          <TagCreate />
        </div>
      </div>

      <div className="row my-5">
        <div className="col">
          <p className="lead">List of Tags</p>
          <TagList />
        </div>
      </div>
    </div>
  );
}
