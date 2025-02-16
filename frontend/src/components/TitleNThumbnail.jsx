import React, { useEffect, useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const TitleNThumbnail = ({ title, thumbnail, setFormData }) => {
  const handleThumbnailUpload = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setFormData((oldForm) => {
        return { ...oldForm, thumbnail: { url: imageUrl, file: imageFile } };
      });
    }
  };

  const removeThumbnail = () => {
    setFormData((oldForm) => {
      return { ...oldForm, thumbnail: { url: undefined, file: undefined } };
    });
  };

  return (
    <div className="space-y-8">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Title*
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) =>
            setFormData((oldForm) => {
              return { ...oldForm, title: e.target.value };
            })
          }
          placeholder="Enter journal title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          required
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Journal Thumbnail
        </label>
        <div className="relative">
          {thumbnail && thumbnail.url ? (
            <div className="relative inline-block">
              <img
                src={thumbnail.url}
                alt="Thumbnail preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-200 group-hover:border-blue-500 sadasd    asdasdasd as              ">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-200">
                    <PhotoIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-600">
                      Upload Thumbnail
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click or drag and drop your image here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleNThumbnail;
