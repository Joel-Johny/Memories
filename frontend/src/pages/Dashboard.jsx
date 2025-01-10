import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { BookOpenIcon, CalendarIcon } from "@heroicons/react/24/outline";
import MemorySearch from "../components/MemorySearch";
import { useAuth } from "../context/AuthContext";
import "react-calendar/dist/Calendar.css";

// Dummy data for demonstration
const dummyMemories = [
  {
    id: 1,
    title: "Morning Reflection",
    date: "2025-01-09",
    mood: "😊",
    preview: "Today was a productive day filled with...",
    thumbnail:
      "https://images.unsplash.com/photo-1735657061829-fc1b934035f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Evening Thoughts",
    date: "2025-01-04",
    mood: "😌",
    preview: "Spent some quality time with family...",
    thumbnail:
      "https://images.unsplash.com/photo-1735657061829-fc1b934035f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // ... (keep other dummy memories)
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Function to check if a date has a journal entry
  const hasJournal = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return dummyMemories.some((memory) => memory.date === formattedDate);
  };

  // Custom tile class for the calendar
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      // Disable future dates
      if (date > new Date()) {
        return "opacity-25 cursor-not-allowed";
      }
      // Highlight dates with journal entries
      if (hasJournal(date)) {
        return "bg-blue-100 text-blue-800 font-medium hover:bg-blue-200";
      }
      // Style for dates without entries
      return "text-gray-400";
    }
  };

  // Disable tile function
  const tileDisabled = ({ date }) => {
    return date > new Date() || !hasJournal(date);
  };

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
          <h3 className="font-semibold text-lg text-gray-800">
            {memory.title}
          </h3>
          <span className="text-2xl">{memory.mood}</span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{memory.preview}</p>
        <span className="text-sm text-gray-500">
          {format(new Date(memory.date), "MMM d, yyyy")}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-right">
          <span className="text-gray-700 font-medium text-lg">
            Welcome, <span className="text-blue-600">{user?.name}</span>
          </span>
        </div>

        {/* Stats and Calendar Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <div className="flex items-center gap-4 sm:block">
                <h3 className="text-xl font-semibold text-gray-800">
                  Total Memories
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {dummyMemories.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-8 w-8 text-green-600" />
              <div className="flex items-center gap-4 sm:block">
                <h3 className="text-xl font-semibold text-gray-800">
                  This Month
                </h3>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">😊</span>
              <div className="flex items-center gap-4 sm:block">
                <h3 className="text-xl font-semibold text-gray-800">
                  Happy Days
                </h3>
                <p className="text-3xl font-bold text-yellow-600">28</p>
              </div>
            </div>
          </div>
        </div>
        {/* Search and Calendar Navigation */}
        <MemorySearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowCalendar={setShowCalendar}
          navigate={navigate}
        />
        {/* Calendar Modal */}
        {showCalendar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                maxDate={new Date()}
                minDetail="month"
                className="w-full border-0 shadow-sm rounded-lg"
                navigationLabel={({ date }) => format(date, "MMMM yyyy")}
                formatShortWeekday={(locale, date) => format(date, "EEE")}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setShowCalendar(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedDate && hasJournal(selectedDate)) {
                      setShowCalendar(false);
                      navigate(
                        `/memories/${format(selectedDate, "yyyy-MM-dd")}`
                      );
                    }
                  }}
                  disabled={!selectedDate || !hasJournal(selectedDate)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedDate && hasJournal(selectedDate)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  View Journal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Memories */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Memories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
