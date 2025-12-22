"use client";
import { useEffect } from "react";
import { useCategory } from "@/context/category";

export default function CategoryList() {
  const { categories, fetchCategories, setUpdatingCategory } = useCategory();
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="my-5">
      {categories?.map((c) => (
        <button
          className="btn"
          key={c._id}
          onClick={(c) => setUpdatingCategory(c)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
