import React, { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
const MemorySnapshot = ({ snapPhotos, setSnapPhotos }) => {
  const [snapPhotosPreview, setSnapPhotosPreview] = useState([]);
  const handleSnapPhotosUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setSnapPhotosPreview([...snapPhotosPreview, ...newPhotos]);
    setSnapPhotos([...snapPhotos, ...files]);
  };

  const removePhoto = (index) => {
    setSnapPhotosPreview(snapPhotosPreview.filter((_, i) => i !== index));
    setSnapPhotos(snapPhotos.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Snaps of Memory
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {snapPhotosPreview.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={photo}
              alt={`Memory ${index + 1}`}
              className="w-full h-32 object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
        {snapPhotosPreview.length <= 4 && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSnapPhotosUpload}
              className="hidden"
              max={4}
            />
            <PhotoIcon className="w-8 h-8 text-gray-400" />
            <p className="mt-2 text-xs text-gray-500 text-center">
              Click or drag and drop the image here
            </p>
          </label>
        )}
      </div>
    </div>
  );
};

export default MemorySnapshot;
