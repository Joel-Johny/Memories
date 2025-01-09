import React from 'react';

const ProductivityRating = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Productivity Rating: {value}/10
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default ProductivityRating;