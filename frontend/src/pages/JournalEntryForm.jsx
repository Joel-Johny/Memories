import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import MemorySnapshot from "../components/MemorySnapshot";
import ProductivitySlider from "../components/ProductivitySlider";
import MoodPicker from "../components/MoodPicker";
import TitleNThumbnail from "../components/TitleNThumbnail";
import DayDescription from "../components/DayDescription";
import { useNavigate } from "react-router-dom";
import { addOrUpdateJournal, fetchJournalByDate } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

const JournalEntryForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: { url: undefined, file: undefined },
    content: {
      type: "",
      payload: "",
    },
    selectedTab: 0,
    snapPhotos: { urls: [], files: [] },
    productivityRating: 5,
    selectedMood: {
      emoji: "😊",
      label: "Happy",
    },
  });

  const [error, setError] = useState("");
  const [journalExists, setJournalExists] = useState(false);

  function validateForm(formData) {
    if (formData.title.trim() === "") {
      setError("Journal Title cannot be empty");
      return false;
    }
    if (formData.content.type === "" || formData.content.payload === "") {
      setError("Journal Description cannot be empty");
      return false;
    }

    setError("");
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formData)) {
      setIsSubmitting(true);
      const currentDate = new Date().toISOString().split("T")[0];
      const submissionData = new FormData();

      submissionData.append("title", formData.title);
      submissionData.append("contentType", formData.content.type);

      if (formData.content.type === "text") {
        submissionData.append("contentPayload", formData.content.payload);
      } else {
        const recordingFile = new File(
          [formData.content.payload],
          "recording.webm",
          { type: formData.content.type }
        );
        submissionData.append("contentPayload", recordingFile);
      }

      if (formData.thumbnail) {
        submissionData.append("thumbnail", formData.thumbnail.file);
      }

      formData.snapPhotos.files.forEach((photo) => {
        submissionData.append("snapPhotos", photo);
      });

      submissionData.append("productivityRating", formData.productivityRating);
      submissionData.append(
        "selectedMood",
        JSON.stringify(formData.selectedMood)
      );
      submissionData.append("journalEntryDate", currentDate);

      try {
        const response = await addOrUpdateJournal(submissionData);
        if (response.status === 200) navigate("/dashboard");
        setError("");
      } catch (err) {
        setError("Failed to submit journal entry. Please try again.");
        console.error("Journal submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const downloadFile = (file) => {
    // Create a URL for the file
    const url = URL.createObjectURL(file);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name || "download"; // Use file name or default

    // Programmatically click the link to trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchTodaysJournal();
  }, []);

  async function fetchTodaysJournal() {
    try {
      setIsLoading(true);
      const currentDate = new Date().toISOString().split("T")[0];
      const currentJournal = await fetchJournalByDate(currentDate);

      if (currentJournal) {
        const thumbnailObject = {
          url: currentJournal.thumbnail,
          file: undefined,
        };

        const thumbnailFileResponse = await fetch(currentJournal.thumbnail);
        const thumbnailFileBlob = await thumbnailFileResponse.blob();
        const thumbnailFile = new File([thumbnailFileBlob], "thumbnail.jpg", {
          type: thumbnailFileBlob.type,
        });
        thumbnailObject.file = thumbnailFile;

        const snapPhotosObject = {
          urls: currentJournal.snapPhotos,
          files: [],
        };

        const photoPromises = currentJournal.snapPhotos.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new File([blob], "snapPhoto.jpg", { type: blob.type });
        });

        const photoFiles = await Promise.all(photoPromises);
        snapPhotosObject.files = photoFiles;

        if (currentJournal.content.type !== "text") {
          const response = await fetch(currentJournal.content.payload);
          const blob = await response.blob();
          const file = new File([blob], "recording", { type: blob.type });
          currentJournal.content.payload = file;
        }

        setJournalExists(true);
        setFormData({
          ...currentJournal,
          thumbnail: thumbnailObject,
          snapPhotos: snapPhotosObject,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Create New Journal Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          )}

          <TitleNThumbnail
            title={formData.title}
            thumbnail={formData.thumbnail}
            setFormData={setFormData}
          />
          <DayDescription
            content={formData.content}
            setError={setError}
            setFormData={setFormData}
          />
          <MemorySnapshot
            snapPhotos={formData.snapPhotos}
            setFormData={setFormData}
          />
          <ProductivitySlider
            productivityRating={formData.productivityRating}
            setFormData={setFormData}
          />
          <MoodPicker
            selectedMood={formData.selectedMood}
            setFormData={setFormData}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                Save Journal Entry
              </>
            )}
          </motion.button>
        </form>
      </div>

      {journalExists && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <PaperAirplaneIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Journal Entry Exists
                </h4>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              You have already created a journal entry for today. You can edit
              or modify it if desired, but you may need to re-record your
              audio/video content.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setJournalExists(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isSubmitting && <LoadingSpinner />}
    </div>
  );
};

export default JournalEntryForm;
