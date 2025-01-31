import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const MemoryCard = ({ memory }) => {
  const navigate = useNavigate();
  const navigateToMemory = () => {
    navigate(`/memory?date=${memory.date}`);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={navigateToMemory}
    >
      <img
        src={memory.thumbnail}
        alt={memory.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {memory.title}
          </h3>
          <span className="text-2xl">{memory.mood}</span>
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(memory.date), "MMM d, yyyy")}
        </span>
      </div>
    </motion.div>
  );
};
export default MemoryCard;
