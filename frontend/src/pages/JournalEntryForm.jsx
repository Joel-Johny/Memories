import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import MemorySnapshot from "../components/MemorySnapshot";
import ProductivitySlider from "../components/ProductivitySlider";
import MoodPicker from "../components/MoodPicker";
import TitleNThumbnail from "../components/TitleNThumbnail";
import DayDescription from "../components/DayDescription";
import { addOrUpdateJournal } from "../api";

const JournalEntryForm = () => {
  //States for journal Title and Thumbnail
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  //States for journal Description Audio/Video/Text
  const [content, setContent] = useState({ type: "", payload: "" });
  const [selectedTab, setSelectedTab] = useState(0);

  //State for journal Snapshot
  const [snapPhotos, setSnapPhotos] = useState([]);
  //States for journal Productivity and Mood
  const [productivityRating, setProductivityRating] = useState(5);
  const [selectedMood, setSelectedMood] = useState({
    emoji: "😊",
    label: "Happy",
  });

  //State for Error which will be used for recording error or api errors
  const [error, setError] = useState("");

  function validateForm() {
    if (title.trim() === "") {
      setError("Journal Title cannot be empty");
      return false;
    }
    if (content.type === "" || content.payload === "") {
      setError("Journal Description cannot be empty");
      return false;
    }

    setError("");
    return true;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("This is thumbnail", thumbnail);
    console.log("This is snapshots", snapPhotos);
    console.log("This is video", content);
    const isValid = validateForm();
    if (isValid) {
      // Get current date
      const currentDate = new Date().toISOString().split("T")[0];

      // Create a FormData object
      const formData = new FormData();
      formData.append("title", title);
      formData.append("contentType", content.type);
      formData.append("contentPayload", content.payload);
      formData.append("thumbnail", thumbnail); // Assuming thumbnail is a file (you'll need to handle this in the form input)

      // Add snap photos to formData (handle if there are multiple files)
      snapPhotos.forEach((photo) => {
        formData.append("snapPhotos", photo);
      });

      formData.append("productivityRating", productivityRating);
      formData.append("selectedMood", JSON.stringify(selectedMood)); // Send as JSON string
      formData.append("journalEntryDate", currentDate);
      console.log("Snap Photos:", formData.getAll("snapPhotos"));

      addOrUpdateJournal(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-4xl mx-auto p-2 sm:p-4"
    >
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

          {/* Journal Title and Thumbnail Component */}
          <TitleNThumbnail
            title={title}
            setTitle={setTitle}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />

          {/* Journal Description Component */}
          <DayDescription
            content={content}
            setContent={setContent}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            setError={setError}
          />

          {/*Memory Snap Upload */}
          <MemorySnapshot
            snapPhotos={snapPhotos}
            setSnapPhotos={setSnapPhotos}
          />

          {/*Productivity Slider*/}
          <ProductivitySlider
            productivityRating={productivityRating}
            setProductivityRating={setProductivityRating}
          />

          {/*Mood Picker */}
          <MoodPicker
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base"
          >
            <PaperAirplaneIcon className="w-5 h-5 mr-2" />
            Save Journal Entry
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default JournalEntryForm;
