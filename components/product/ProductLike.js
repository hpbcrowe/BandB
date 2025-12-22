"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

export default function ProductLike({ product }) {
  const { data, status } = useSession();
  const [likes, setLikes] = useState(product?.likes);

  const router = useRouter();
  const pathname = usePathname();

  // check if the current user has liked the product
  const isLiked = likes?.includes(data?.user?._id);

  /**
   *    * Handle Like Product
   * @returns
   * Likes the product by sending a PUT request to the like API endpoint.
   * If the user is not authenticated, redirects to the login page.
   ** Handles errors and displays appropriate toast messages.
   *
   *
   */
  const handleLike = async () => {
    if (status !== "authenticated") {
      toast.error("You must be logged in to like a product");
      router.push(`/login?callbackUrl=${pathname}`);
      return;
    }
    try {
      if (isLiked) {
        const answer = window.confirm(
          "You have already liked this product. Do you want to unlike it?"
        );
        if (answer) {
          handleUnlike();
          return;
        }
      } else {
        const response = await fetch(`${process.env.API}/user/product/like`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: product?._id }),
        });
        if (!response.ok) {
          throw new Error("Failed to like the product");
        }
        const data = await response.json();
        setLikes(data?.likes);
        toast.success("Product liked successfully");
        router.refresh();
      }
    } catch (err) {
      toast.error("Failed to like the product");
      console.log(err);
    }
  };

  /**
   * Handle Unlike Product
   *  @returns
   * Unlikes the product by sending a PUT request to the unlike API endpoint.
   * Handles errors and displays appropriate toast messages.
   *
   */
  const handleUnlike = async () => {
    try {
      const response = await fetch(`${process.env.API}/user/product/unlike`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        //send productId in the body (data)
        body: JSON.stringify({ productId: product?._id }),
      });
      if (!response.ok) {
        throw new Error("Failed to unlike the product");
      }
      const data = await response.json();
      setLikes(data?.likes);
      toast.success("Product unliked successfully");
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("Failed to unlike the product");
    }
  };

  return (
    <small className="pointer">
      {" "}
      ❤️{" "}
      {!likes?.length ? (
        <>
          <span onClick={handleLike}>Be the first person to like</span>
        </>
      ) : (
        <>
          <span onClick={handleLike}>{likes?.length} people liked</span>
        </>
      )}{" "}
    </small>
  );
}
