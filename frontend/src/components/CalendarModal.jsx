import React, { useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const CalendarModal = ({ setShowCalendar, journalDates }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const hasJournal = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return journalDates.some((journalDate) => journalDate === formattedDate);
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

  const handleCancel = () => {
    setSelectedDate(null);
    setShowCalendar(false);
  };

  const handleConfirm = () => {
    if (selectedDate && hasJournal(selectedDate)) {
      setShowCalendar(false);
      navigate(`/memory?date=${format(selectedDate, "yyyy-MM-dd")}`);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          maxDate={new Date()}
          minDate={new Date(journalDates[0])}
          minDetail="month"
          className="w-full border-0 shadow-sm rounded-lg"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
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
  );
};

export default CalendarModal;
