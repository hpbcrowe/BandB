"use client";

import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

// Importing necessary libraries and components
export const CategoryContext = createContext();
// This context will provide state and functions related to categories
export const CategoryProvider = ({ children }) => {
  // state for categories, create a category
  const [name, setName] = useState("");
  // for fetching all categories
  const [categories, setCategories] = useState([]);
  // for updating a category and deleting a category
  const [updatingCategory, setUpdatingCategory] = useState(null);

  /**
   * Function to create a new category
   * It makes a POST request to the API to create a new category
   */
  const createCategory = async () => {
    try {
      // Make a POST request to create a new category
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the name in the request body
        // This will create a new category with the provided name
        // The slug will be generated automatically by the server
        body: JSON.stringify({ name }),
      });
      // Parse the response data
      const data = await response.json();

      if (!response.ok) {
        // If the response is not ok, show an error toast
        toast.error(data || "Category creation failed. Please try again.");
      } else {
        toast.success("Category created successfully!");
        // If the category is created successfully, reset the name state
        setName("");
        // Update the categories state with the new category
        // This will add the new category to the beginning of the categories array
        setCategories([data, ...categories]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Category creation failed. Please try again.");
    }
  };

  /**
   * Function to fetch all categories from the API
   */
  const fetchCategories = async () => {
    try {
      // Make a GET request to fetch all categories
      const response = await fetch(`${process.env.API}/admin/category`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data || "Failed to fetch categories. Please try again.");
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch catetories. Please try again.");
    }
  };

  /**
   * Function to update an existing category
   * It makes a PUT request to the API to update the category
   */
  const updateCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // Send the updated name in the request body
          body: JSON.stringify(updatingCategory),
        }
      );
      // Parse the response data
      const data = await response.json();
      if (!response.ok) {
        toast.error(data || "Category update failed. Please try again.");
      } else {
        toast.success("Category updated successfully!");
        // Reset the name state after successful update
        setUpdatingCategory(null);
        // Update the categories state with the updated category
        setCategories(
          categories.map((category) =>
            category._id === updatingCategory._id ? data : category
          )
        );
        // Reset the updatingCategory state after successful update
        setUpdatingCategory(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Category update failed. Please try again.");
    }
  };

  /**
   * Function to delete a category
   * It makes a DELETE request to the API to remove the category
   */
  const deleteCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory?._id}`,
        {
          method: "DELETE",
        }
      );
      // Parse the response data
      const data = await response.json();
      if (!response.ok) {
        toast.error(data || "Category deletion failed. Please try again.");
      } else {
        toast.success("Category deleted successfully!");
        // Update the categories state by removing the deleted category
        // This will filter out the category that was deleted
        setCategories(
          categories.filter((category) => category._id !== updatingCategory._id)
        );
        // Reset the updatingCategory state after successful deletion
        setUpdatingCategory(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Category deletion failed. Please try again.");
    }
  };
  // This effect runs once when the component mounts to fetch all categories
  return (
    <CategoryContext.Provider
      value={{
        name,
        setName,
        categories,
        setCategories,
        createCategory,
        fetchCategories,
        updateCategory,
        deleteCategory,
        updatingCategory,
        setUpdatingCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
