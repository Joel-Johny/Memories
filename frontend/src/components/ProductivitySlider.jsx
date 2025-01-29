import React from "react";

const ProductivitySlider = ({ productivityRating, setFormData }) => {
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
        onChange={(e) =>
          setFormData((oldForm) => ({
            ...oldForm,
            productivityRating: Number(e.target.value),
          }))
        }
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default ProductivitySlider;
