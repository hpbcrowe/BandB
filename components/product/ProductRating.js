"use client";
import { useState, useEffect, use } from "react";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { useProduct } from "@/context/product";
import Stars from "@/components/product/Stars";
import { calculateAverageRating } from "@/utils/helpers";
import Modal from "@/components/Modal";
import { useSession } from "next-auth/react";
import { set } from "mongoose";

export default function ProductRating({ product }) {
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

  const alreadyRated = productRatings?.find(
    (rate) => rate?.postedBy?._id === data?.user?._id
  );

  useEffect(() => {
    if (alreadyRated) {
      setCurrentRatingProduct(alreadyRated?.rating);
      setComment(alreadyRated?.comment);
    } else {
      setCurrentRatingProduct(0);
      setComment("");
    }
  }, [alreadyRated]);

  useEffect(() => {
    if (productRatings) {
      const average = calculateAverageRating(productRatings);
      setAverageRating(average);
    }
  }, [product?.ratings]);

  return (
    <div className="d-flex justify-content-between card-footer">
      <div>
        <Stars rating={averageRating} />
        <small>
          {productRatings?.length > 0 &&
            `In average ${averageRating} stars out of 5 from ${productRatings?.length} reviews.`}
        </small>
      </div>
      <small onClick={() => setShowRatingModal(true)} className="pointer">
        {" "}
        Leave a rating
      </small>
      {showRatingModal && <Modal>rating modal</Modal>}
    </div>
  );
}
