"use client";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  //state
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  //hook
  const router = useRouter();

  const uploadImages = (e) => {};

  const deleteImage = (public_id) => {};

  const createProduct = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        body: JSON.stringify({ product }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err || "Failed to create product");
      } else {
        toast.success(`Product "${data?.title}" created successfully`);
        setProduct(null);
        // Redirect to products list page
        router.push("/dashboard/admin/products");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating product");
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(`${process.env.API}/product?page=${page}`, {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err || "Failed to fetch products");
      } else {
        setProducts(data?.products);
        setCurrentPage(data?.currentPage);
        setTotalPages(data?.totalPages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching products");
    }
  };

  const updateProduct = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatingProduct),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err || "Failed to update product");
      } else {
        toast.success(`Product "${data?.title}" updated successfully`);
        router.back();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating product");
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/product/${updatingProduct?._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.err || "Failed to delete product");
      } else {
        toast.success(`Product "${data?.title}" deleted successfully`);
        router.back();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting product");
    }
  };
  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        setProducts,
        products,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        updatingProduct,
        setUpdatingProduct,
        uploading,
        setUploading,
        uploadImages,
        deleteImage,
        createProduct,
        fetchProducts,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
