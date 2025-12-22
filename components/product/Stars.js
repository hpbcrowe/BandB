import { FaStar, FaStarHalf, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

/**
 *  * Stars component to display star ratings. *
 * @param {*} param0
 * @returns
 * JSX.Element
 *      Displays filled and half stars based on the rating prop.
 *    Renders a total of 5 stars, filling them according to the rating value.
 *
 */

export default function Stars({ rating }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    // If the current star index is less than or equal to the rating, render a filled star
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-danger" />);
      // If the current star index is the next one after the filled stars and the rating is not an integer, render a half star
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="text-danger" />);
      // Otherwise, render an empty star
    } else {
      stars.push(<FaRegStar key={i} className="text-secondary" />);
    }
  }
  return <>{stars}</>;
}
