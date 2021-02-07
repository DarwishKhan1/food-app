import React from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ productRating }) => {
  return (
    <div className="star-rating mt-2 d-flex justfy-content-center align-items-center" >
      {[...Array(5)].map((star, i) => {
        const ratingvalue = i + 1;
        return (
          <label key={i}>
            <FaStar
              className="star"
              color={ratingvalue <= productRating ? "orange" : "	#808080"}
              size="20"
            />
          </label>
        );
      })}
      <span className="pl-2 font-weight-bold">{productRating > 0 ? productRating: "Not rated yet"}</span>
    </div>
  );
};

export default Rating;
