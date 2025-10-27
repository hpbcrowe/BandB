"use client";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";
import { set } from "mongoose";

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
  // functions
  // resize image

  /**
   * UPLOAD IMAGES
   * @param {*} e
   *
   * @returns
   * Uploads images to the server after resizing them to 1280x720 pixels.
   * Limits the total number of images (existing + new) to 4.
   * Sets the uploading state to true while uploading and false when done.
   * Updates the product or updatingProduct state with the new images.
   * Handles errors and displays appropriate toast messages.
   *
   */

  const uploadImages = (e) => {
    const files = e.target.files;
    let allUploadedFiles = updatingProduct
      ? updatingProduct?.images || []
      : product
      ? product?.images || []
      : [];
    if (files) {
      // check if total files + existing images > 4
      const totalImages = allUploadedFiles?.length + files?.length;
      if (totalImages > 4) {
        toast.error("You can only upload up to 4 images.");
        return;
      }

      setUploading(true);
      // loop through files and resize and upload each
      // use Promise.all to wait for all uploads to finish

      const uploadPromises = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const promise = new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            1280,
            720,
            "JPEG",
            100,
            0,
            (uri) => {
              fetch(`${process.env.API}/admin/upload/image`, {
                method: "POST",
                body: JSON.stringify({ image: uri }),
              })
                .then((response) => response.json())
                .then((data) => {
                  allUploadedFiles.unshift(data);
                  resolve();
                })
                .catch((err) => {
                  console.log("image upload err => ", err);
                  resolve();
                });
            },
            "base64"
          );
        });
        uploadPromises.push(promise);
      }
      // wait for all uploads to finish
      // then update state

      Promise.all(uploadPromises)
        .then(() => {
          updatingProduct
            ? setUpdatingProduct({ ...updateProduct, images: allUploadedFiles })
            : setProduct({ ...product, images: allUploadedFiles });
          setUploading(false);
        })
        .catch((err) => {
          console.log("Error uploading images: ", err);
          setUploading(false);
        });
    }
  };

  /**
   * DELETE IMAGE
   * @param {*} public_id
   * @returns
   * Deletes an image from the server and updates the product or updatingProduct state.
   * Sets the uploading state to true while deleting and false when done.
   *
   */
  const deleteImage = (public_id) => {
    // console.log("delete image => ", public_id);

    setUploading(true);
    // send request to server to delete
    fetch(`${process.env.API}/admin/upload/image`, {
      method: "PUT",
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("image deleted => ", data);
        const filteredImages = updatingProduct
          ? updatingProduct?.images?.filter(
              (image) => image?.public_id !== public_id
            )
          : product?.images?.filter((image) => image?.public_id !== public_id);

        updatingProduct
          ? setUpdatingProduct({ ...updatingProduct, images: filteredImages })
          : setProduct({ ...product, images: filteredIMages });
      })
      .catch((err) => {
        console.log("Image delete err => ", err);
      })
      .finally(() => setUploading(false));
  };

  /**
   * CREATE PRODUCT
   * @returns
   * Creates a new product by sending a POST request to the server.
   * Displays success or error toast messages based on the response.
   * Resets the product state and redirects to the products list page upon success.
   * Handles errors and displays appropriate toast messages.
   *
   */

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
