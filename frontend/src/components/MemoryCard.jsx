import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const MemoryCard = ({ memory }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => navigate(`/memory/${memory.id}`)}
  >
    <img
      src={memory.thumbnail}
      alt={memory.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{memory.title}</h3>
        <span className="text-2xl">{memory.mood}</span>
      </div>
      <p className="text-gray-600 text-sm mb-2">{memory.preview}</p>
      <span className="text-sm text-gray-500">
        {format(new Date(memory.date), "MMM d, yyyy")}
      </span>
    </div>
  </motion.div>
);

export default MemoryCard;
