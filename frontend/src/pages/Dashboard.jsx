import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  BookOpenIcon,
  CalendarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import MemorySearch from "../components/MemorySearch";
import "react-calendar/dist/Calendar.css";
import MemoryCard from "../components/MemoryCard";
import CalendarModal from "../components/CalendarModal";
import {
  getJournalEntryDates,
  getJournalMetrics,
  getPaginatedJournal,
} from "../api";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import LoadingSpinner from "../components/LoadingSpinner";
export default function Dashboard() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [journalDates, setJournalDates] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [journals, setJournals] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data (metrics, dates, and journals)
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const dates = await getJournalEntryDates();
    const metrics = await getJournalMetrics();
    setMetrics(metrics);
    setJournalDates(dates);
    if (dates.length > 0) await fetchJournals();
    setIsLoading(false);
  };

  // Fetch paginated journals
  const fetchJournals = async (skip = 0) => {
    try {
      const { journals: newJournals, hasMore: moreJournalsExist } =
        await getPaginatedJournal(skip);
      setJournals((prev) => [...prev, ...newJournals]);
      setHasMore(moreJournalsExist);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <LoadingSpinner />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Memories */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <div className="flex items-center gap-4 sm:block">
                <h3 className="text-xl font-semibold text-gray-800">
                  Total Memories
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {metrics?.totalJournals || 0}
                </p>
              </div>
            </div>
          </div>
          {/* This Month */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-8 w-8 text-green-600" />
              <div className="flex items-center gap-4 sm:block">
                <h3 className="text-xl font-semibold text-gray-800">
                  This Month
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {metrics?.thisMonthJournals || 0}
                </p>
              </div>
            </div>
          </div>
          {/* Happy Days */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">😊</span>
              <div className="flex items-center gap-4 sm:block">
                <h3 className="text-xl font-semibold text-gray-800">
                  Happy Days
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {metrics?.happyMoodDays || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Calendar Navigation */}
        <MemorySearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowCalendar={setShowCalendar}
        />

        {/* Calendar Modal */}
        {showCalendar && (
          <CalendarModal
            setShowCalendar={setShowCalendar}
            journalDates={journalDates}
          />
        )}

        {/* Recent Memories */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Memories
          </h2>

          {journals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center flex flex-col items-center justify-center ">
              <div className="text-center">
                <p className="text-xl text-gray-600 mb-4">
                  No memories found, create one!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/new-memory")}
                  className="flex items-center justify-center mx-auto gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Create a Memory</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journals.map((journal) => (
                  <MemoryCard
                    key={journal._id}
                    memory={{
                      id: journal._id,
                      title: journal.title,
                      date: journal.date,
                      mood: journal.selectedMood.emoji,
                      thumbnail: journal.thumbnail,
                    }}
                  />
                ))}
              </div>
              {/* Load More Button */}
              {hasMore && (
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    await fetchJournals(journals.length);
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
