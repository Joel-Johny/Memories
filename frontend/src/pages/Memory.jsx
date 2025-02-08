import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import {
  deleteJournal,
  fetchJournalByDate,
  getJournalEntryDates,
} from "../api";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  HeartIcon,
  TrashIcon,
  ArrowLeftIcon,
  HomeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/LoadingSpinner";
import CalendarModal from "../components/CalendarModal";
const Memory = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const searchDate = searchParams.get("date");
  const [journalDates, setJournalDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (searchDate) {
      loadJournal();
    }
  }, [searchDate]);
  const loadJournal = async () => {
    try {
      setLoading(true);
      const dates = await getJournalEntryDates();
      if (dates.includes(searchDate)) {
        const data = await fetchJournalByDate(searchDate);
        setJournalDates(dates);
        setJournal(data);
        setError(null);
      }
    } catch (err) {
      setError("No journal entry found for this date");
      setJournal(null);
    } finally {
      setLoading(false);
    }
  };
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === journal?.snapPhotos?.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? journal?.snapPhotos?.length - 1 : prev - 1
    );
  };

  const handleDelete = async () => {
    try {
      // Set loading state before deletion
      setLoading(true);
      await deleteJournal(journal.date);
      setIsDeleteModalOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting memory:", error);
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="mb-4 sm:mb-6">
            <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            No Memory Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 w-full text-sm sm:text-base"
          >
            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-4 sm:py-6 px-3 sm:px-6 lg:px-8"
    >
      {/* Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <motion.button
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </motion.button>
          <motion.button
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            onClick={() => setShowCalendar(true)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Calendar</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header with Thumbnail Background */}
          {/* Header with Thumbnail Background */}
          <div
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-8"
            style={{
              backgroundImage: journal.thumbnail
                ? `linear-gradient(to right, rgba(37, 99, 235, 0.9), rgba(147, 51, 234, 0.9)), url(${journal.thumbnail})`
                : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white relative z-10 mb-4 sm:mb-6"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {journal.title}
            </motion.h1>

            {/* Mood and Productivity Score - Stacked with Equal Width */}
            <motion.div
              className="flex flex-col space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-start space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full sm:w-64">
                <span className="text-xl sm:text-2xl">
                  {journal.selectedMood.emoji}
                </span>
                <span className="text-white font-medium">
                  Feeling {journal.selectedMood.label}
                </span>
              </div>
              <div className="flex items-center justify-start space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full sm:w-64">
                <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-white font-medium">Productivity</span>
                <span className="text-white font-bold text-base sm:text-lg">
                  {journal.productivityRating}
                </span>
              </div>
            </motion.div>
          </div>
          <div className="p-4 sm:p-6">
            {/* What Happened Section */}
            <motion.div
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
                What Happened That Day
              </h2>
              {journal.content.type === "text" && (
                <div className="prose max-w-none">
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {journal.content.payload}
                  </p>
                </div>
              )}
              {journal.content.type === "video/webm" && (
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <video
                    controls
                    className="w-full h-auto"
                    src={journal.content.payload}
                  />
                </div>
              )}
              {journal.content.type === "audio/webm" && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <audio controls className="w-full">
                    <source src={journal.content.payload} type="audio/webm" />
                  </audio>
                </div>
              )}
            </motion.div>

            {/* Snapshots Section */}
            {journal.snapPhotos?.length > 0 && (
              <motion.div
                className="mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Snaps of Memory
                </h2>
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video relative group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentSlide}
                        src={journal.snapPhotos[currentSlide]}
                        alt={`Memory ${currentSlide + 1}`}
                        className="w-full h-full object-contain cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>

                    {/* Slideshow Controls */}
                    <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevSlide}
                        className="p-2 sm:p-3 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm transform transition-all duration-200 hover:shadow-xl"
                      >
                        <ChevronLeftIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextSlide}
                        className="p-2 sm:p-3 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm transform transition-all duration-200 hover:shadow-xl"
                      >
                        <ChevronRightIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </motion.button>
                    </div>

                    {/* Dots Navigation */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                      {journal.snapPhotos.map((_, index) => (
                        <button
                          key={index}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                              ? "bg-white scale-125"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Delete Button */}
            <motion.div
              className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2 text-sm sm:text-base"
              >
                <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Forget this memory</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {showCalendar && (
        <CalendarModal
          setShowCalendar={setShowCalendar}
          journalDates={journalDates}
        />
      )}
      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <HeartIcon className="w-6 h-6 text-red-500" />
              <span>Confirm Memory Deletion</span>
            </Dialog.Title>
            <p className="text-gray-600 mb-6">
              Are you sure you want to forget this memory? This action cannot be
              undone, and the memory will be permanently erased.
            </p>
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Keep Memory
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
              >
                <TrashIcon className="w-5 h-5" />
                <span>Delete Forever</span>
              </motion.button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default Memory;
