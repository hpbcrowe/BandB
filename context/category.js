"use client";
import { set } from "mongoose";
import { createContext, useState, useEffect, use, useContext } from "react";
import toast from "react-hot-toast";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  // state for categories create a category
  const [name, setName] = useState("");
  // for fetching all categories
  const [categories, setCategories] = useState([]);
  // for updating a category and deleting a category
  const [updatingCategory, setUpdatingCategory] = useState(null);

  const createCategory = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err || "Category creation failed. Please try again.");
      } else {
        toast.success("Category created successfully!");
        setName("");
        setCategories([data, ...categories]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Category creation failed. Please try again.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          data.err || "Failed to fetch categories. Please try again."
        );
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch catetories. Please try again.");
    }
  };

  const updateCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err || "Category update failed. Please try again.");
      } else {
        toast.success("Category updated successfully!");
        setUpdatingCategory(null);
        setCategories(
          categories.map((category) =>
            category._id === updatingCategory._id ? data : cat
          )
        );
        setUpdatingCategory(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Category update failed. Please try again.");
    }
  };

  const deleteCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err || "Category deletion failed. Please try again.");
      } else {
        toast.success("Category deleted successfully!");
        setCategories(
          categories.filter((category) => category._id !== updatingCategory._id)
        );
        setUpdatingCategory(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Category deletion failed. Please try again.");
    }
  };

  return;
  <CategoryContext.Provider
    value={{
      name,
      setName,
      categories,
      setCategories,
      setUpdatingCategory,
      updatingCategory,
      createCategory,
      fetchCategories,
      updateCategory,
      deleteCategory,
    }}
  >
    {children}
  </CategoryContext.Provider>;
};

export const useCategory = () => useContext(CategoryContext);
