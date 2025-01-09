import React from "react";

const ProductivitySlider = ({ productivityRating, setProductivityRating }) => {
  // Calculate the percentage for the colored track
  const trackPercentage = ((productivityRating - 1) / 9) * 100;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        How productive was your day? ({productivityRating}/10)
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={productivityRating}
        onChange={(e) => setProductivityRating(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #2563eb ${trackPercentage}%, #e5e7eb ${trackPercentage}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default ProductivitySlider;
