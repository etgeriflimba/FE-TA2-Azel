import React from "react";

const Spinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-6 h-6 border-4",
    medium: "w-8 h-8 border-4",
    large: "w-12 h-12 border-8",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`border-t-transparent border-black border-solid rounded-full animate-spin ${sizeClasses[size]}`}></div>
      <span className="text-black mt-2">Loading...</span>
    </div>
  );
};

export default Spinner;
