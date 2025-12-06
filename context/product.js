"use client";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import Resizer from "react-image-file-resizer";
import { set } from "mongoose";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  //state
  // initialize product with empty fields so inputs stay controlled
  const initialProduct = {
    title: "",
    description: "",
    price: "",
    color: "",
    brand: "",
    stock: "",
    category: { _id: "" },
    tags: [],
    images: [],
  };

  const [product, setProduct] = useState(initialProduct);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingProduct, setUpdatingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  //Image Preview Modal
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");
  //rating system
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRatingProduct, setCurrentRatingProduct] = useState(0);
  const [comment, setComment] = useState("");

  //hook
  const router = useRouter();

  useEffect(() => {
    //close modal on clicks on the page outside the modal
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
    function handleClickOutside(event) {
      if (event.target.classList.contains("modal")) {
        closeModal();
      }
    }
  }, []);

  {
    /* Modal for image preview */
  }
  const openImagePreviewModal = (url) => {
    setCurrentImagePreviewUrl(url);
    setShowImagePreviewModal(true);
  };

  {
    /* Close modal function */
  }
  const closeModal = () => {
    setCurrentImagePreviewUrl("");
    setShowImagePreviewModal(false);
    setShowRatingModal(false);
  };

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
      // check if the total combined images exceed 4
      const totalImages = allUploadedFiles?.length + files?.length;
      if (totalImages > 4) {
        toast.error("You can upload maximum 4 images");
        return;
      }

      setUploading(true);
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

      Promise.all(uploadPromises)
        .then(() => {
          updatingProduct
            ? setUpdatingProduct({
                ...updatingProduct,
                images: allUploadedFiles,
              })
            : setProduct({ ...product, images: allUploadedFiles });
          setUploading(false);
        })
        .catch((err) => {
          console.log("image upload err => ", err);
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
    // console.log("delete image beginning of method => ", public_id);

    setUploading(true);
    // send request to server to delete
    fetch(`${process.env.API}/admin/upload/image`, {
      method: "PUT",
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredImages = updatingProduct
          ? updatingProduct?.images?.filter(
              (image) => image?.public_id !== public_id
            )
          : product?.images?.filter((image) => image?.public_id !== public_id);

        updatingProduct
          ? setUpdatingProduct({ ...updatingProduct, images: filteredImages })
          : setProduct({ ...product, images: filteredImages });
      })
      .catch((err) => {
        console.log("Image delete err after filtering => ", err);
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
    console.log("create product called with product => ", product);
    console.log("API endpoint used => ", `${process.env.API}/admin/product`);
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        body: JSON.stringify({ product }),
      });
      console.log("response from create product => ", response);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err || "Failed to create product");
      } else {
        toast.success(`Product "${data?.title}" created successfully`);
        // reset to initial product so inputs remain controlled
        setProduct(initialProduct);
        // Redirect to products list page
        //router.push("/dashboard/admin/product");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating product in context product.js");
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

  /**
   *  UPDATE PRODUCT
   * @param {*} productId
   * @returns
   * Updates an existing product by sending a PUT request to the server.
   * Displays success or error toast messages based on the response.
   * Redirects to the products list page upon success.
   * Handles errors and displays appropriate toast messages.
   *
   */
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
        // router.back();
        window.location.href = "/dashboard/admin/products";
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating product");
    }
  };

  /**
   * DELETE PRODUCT
   * @return
   * Deletes an existing product by sending a DELETE request to the server.
   * Displays success or error toast messages based on the response.
   * Reloads the page upon successful deletion.
   * Handles errors and displays appropriate toast messages.
   *
   */
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
        //router.back();
        window.location.reload();
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
        //image preview modal
        showImagePreviewModal,
        setShowImagePreviewModal,
        currentImagePreviewUrl,
        setCurrentImagePreviewUrl,
        openImagePreviewModal,
        closeModal,
        //rating system
        showRatingModal,
        setShowRatingModal,
        currentRatingProduct,
        setCurrentRatingProduct,
        comment,
        setComment,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
