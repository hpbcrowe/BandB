"use client";
import { useState, useEffect, use } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { useProduct } from "@/context/product";
import Stars from "@/components/product/Stars";
import { calculateAverageRating } from "@/utils/helpers";
import Modal from "@/components/Modal";
import { useSession } from "next-auth/react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProductRating({ product, leaveARating = true }) {
  const {
    showRatingModal,
    setShowRatingModal,
    currentRatingProduct,
    setCurrentRatingProduct,
    comment,
    setComment,
  } = useProduct();

  const [productRatings, setProductRatings] = useState(product?.ratings || []);

  const [averageRating, setAverageRating] = useState(0);

  //current user session
  const { data, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Robust ID comparison: postedBy may be an object ({ _id }) or a string id depending
  // on whether the ratings were loaded from the server or returned from an API call.
  const alreadyRated = productRatings?.find((rate) => {
    const postedById = rate?.postedBy?._id ?? rate?.postedBy;
    const sessionUserId = data?.user?._id ?? data?.user?.id;
    return String(postedById) === String(sessionUserId);
  });

  useEffect(() => {
    if (alreadyRated) {
      setCurrentRatingProduct(alreadyRated?.rating);
      setComment(alreadyRated?.comment);
    } else {
      setCurrentRatingProduct(0);
      setComment("");
    }
  }, [alreadyRated]);

  // Recalculate average when local productRatings state changes
  useEffect(() => {
    if (productRatings) {
      const average = calculateAverageRating(productRatings);
      setAverageRating(average);
    }
  }, [productRatings]);

  /**
   *  Submit product rating
   * @returns   {Promise<void>}
   *
   *
   */
  const submitRating = async () => {
    if (status !== "authenticated") {
      toast.error("You must be logged in to submit a rating.");
      router.push(`/login?callbackUrl=${pathname}`);
      return;
    }
    try {
      const response = await fetch(`${process.env.API}/user/product/rating`, {
        method: "POST",
        body: JSON.stringify({
          productId: product?._id,

          rating: currentRatingProduct,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }
      toast.success("Rating submitted successfully");
      const data = await response.json();
      setProductRatings(data?.ratings);
      setShowRatingModal(false);
      toast.success("Thank you for your rating!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting rating. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-between">
      <div>
        <Stars rating={averageRating} />
        <small className="text-muted">({productRatings?.length})</small>
      </div>
      {leaveARating && (
        <small onClick={() => setShowRatingModal(true)} className="pointer">
          {alreadyRated ? "Update your Rating" : "Leave a rating"}
        </small>
      )}
      {showRatingModal && (
        <Modal>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Write a review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="pointer">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={ratingValue}
                  className={
                    ratingValue <= currentRatingProduct
                      ? "star-active lead"
                      : "lead"
                  }
                  onClick={() => setCurrentRatingProduct(ratingValue)}
                >
                  {" "}
                  {ratingValue <= currentRatingProduct ? (
                    <FaStar className="text-danger" />
                  ) : (
                    <FaRegStar />
                  )}
                </span>
              );
            })}
          </div>
          <button
            onClick={submitRating}
            className="btn btn-primary my-3 btn-raised"
          >
            Submit
          </button>
        </Modal>
      )}
    </div>
  );
}
