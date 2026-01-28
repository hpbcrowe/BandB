import React from "react";
import Stars from "@/components/product/Stars";
import RatingDistribution from "@/components/product/RatingDistribution";

export default function UserReviews({ reviews }) {
  return (
    <>
      {reviews?.length > 0 ? (
        <>
          <RatingDistribution reviews={reviews} />
          <ul className="list-group mt-4 bg-white">
            {reviews?.map((review, index) => (
              <li key={index} className="list-group-item mb-l">
                <div>
                  <p>
                    <strong>{review?.postedBy?.name}</strong>
                  </p>
                  <Stars rating={review?.rating} />
                  {review?.comment && <p className="mt-3">{review?.comment}</p>}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No reviews yet. </p>
      )}{" "}
    </>
  );
}
