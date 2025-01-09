import React from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
const MemorySnapshot = ({
  snapPhotos,
  handleSnapPhotosUpload,
  removePhoto,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Snaps of Memory
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {snapPhotos.map((photo, index) => (
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
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center cursor-pointer hover:border-blue-500">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSnapPhotosUpload}
            className="hidden"
          />
          <PhotoIcon className="w-8 h-8 text-gray-400" />
        </label>
      </div>
    </div>
  );
};

export default MemorySnapshot;
