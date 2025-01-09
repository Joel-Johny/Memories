import React from "react";
import { motion } from "framer-motion";

const MoodPicker = ({ selectedMood, setSelectedMood }) => {
  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😡", label: "Angry" },
    { emoji: "🥳", label: "Excited" },
    { emoji: "😌", label: "Peaceful" },
    { emoji: "🤔", label: "Thoughtful" },
    { emoji: "😤", label: "Frustrated" },
  ];
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        "How was your day, if it were an emoji?"
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setSelectedMood(mood)}
            aria-pressed={selectedMood?.label === mood.label}
            className={`p-3 sm:p-4 rounded-lg text-center transition-transform duration-200 ease-in-out 
  ${
    selectedMood?.label === mood.label
      ? "bg-blue-100 border-2 border-blue-500 shadow-md transform scale-105"
      : "bg-gray-50 border border-gray-200"
  }`}
          >
            <span className="text-xl sm:text-2xl">{mood.emoji}</span>
            <p className="text-xs sm:text-sm mt-1 text-gray-700">
              {mood.label}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker;
