import React from "react";
import "../../DiscountBar.css"; // import the CSS file

const DiscountBar = () => {
  return (
    <div className="w-full  text-white py-1 px-2 z-[1031] overflow-hidden" style={{backgroundColor: '#7F55B1'}}>
      <p className="scroll-text text-xs sm:text-sm md:text-base font-medium leading-snug whitespace-nowrap">
        🎉 Special Offer Alert! 🎉 Get 10% OFF on all activities – Use code:{" "}
        <strong>SUMMER20</strong> at checkout
      </p>
    </div>
  );
};

export default DiscountBar;
