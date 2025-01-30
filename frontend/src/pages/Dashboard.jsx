import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, CalendarIcon } from "@heroicons/react/24/outline";
import MemorySearch from "../components/MemorySearch";
import { useAuth } from "../context/AuthContext";
import "react-calendar/dist/Calendar.css";
import MemoryCard from "../components/MemoryCard";
import CalendarModal from "../components/CalendarModal";
import { getJournalEntryDates } from "../api";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [journalDates, setJournalDates] = useState([]);
  const { user } = useAuth();

  // Function to check if a date has a journal entry
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    const dates = await getJournalEntryDates();
    setJournalDates(dates);
  };
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
