import { PlusIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const MemorySearch = ({ searchQuery, setSearchQuery, setShowCalendar }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          placeholder="Search memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all whitespace-nowrap"
        >
          <CalendarIcon className="h-5 w-5" />
          <span>Go to Memory</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/new-memory")}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create a Memory</span>
        </motion.button>
      </div>
    </div>
  );
};

export default MemorySearch;
