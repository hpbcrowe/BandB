"use client";
import Image from "next/image";
import { useState, useEffect, use } from "react";

export default function ProductImage({ product }) {
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");

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
  const openModal = (url) => {
    setCurrentImagePreviewUrl(url);
    setShowImagePreviewModal(true);
  };

  {
    /* Close modal function */
  }
  const closeModal = () => {
    setCurrentImagePreviewUrl("");
    setShowImagePreviewModal(false);
  };

  {
    /* Function to display image */
  }
  const showImage = (src, title) => (
    <Image
      src={src}
      className="card-img-top"
      width={500}
      height={300}
      style={{ objectFit: "contain", height: "100%", width: "100%" }}
      alt={title}
    />
  );
  return (
    <>
      {showImagePreviewModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            style={{ height: "calc(100% - 60px)" }}
          >
            <div
              className="modal-content"
              style={{ height: "calc(100% - 60px)" }}
            >
              <div className="modal-body overflow-auto">
                {showImage(currentImagePreviewUrl, product?.title)}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center">
        {product?.images?.length > 0 ? (
          <>
            {product?.images?.map((image) => (
              <div
                key={image.public_id}
                style={{ height: "350px", overflow: "hidden" }}
                className="pointer"
                onClick={() => openModal(image?.secure_url)}
              >
                {showImage(image?.secure_url, product?.title)}
              </div>
            ))}
          </>
        ) : (
          <div
            style={{ height: "350px", overflow: "hidden" }}
            className="pointer"
            onClick={() => openModal("/images/default.jpeg")}
          >
            {showImage("/images/default.jpeg", product?.title)}
          </div>
        )}
      </div>
    </>
  );
}
