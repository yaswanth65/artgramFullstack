import React from "react";
import "/src/DiscountBar.css"; // import the CSS file

const DiscountBar = () => {
  return (
    <div className="fixed top-0 inset-x-0 bg-red-600 text-white py-1 px-2 z-[1031] overflow-hidden">
      <p className="scroll-text text-xs sm:text-sm md:text-base font-medium leading-snug whitespace-nowrap">
        🎉 Special Offer Alert! 🎉 Get 10% OFF on all activities – Use code:{" "}
        <strong>SUMMER20</strong> at checkout
      </p>
    </div>
  );
};

export default DiscountBar;
