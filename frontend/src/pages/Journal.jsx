import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import JournalEditor from '../components/JournalEditor';
import MediaRecorder from '../components/MediaRecorder';
import MoodSelector from '../components/MoodSelector';
import ProductivityRating from '../components/ProductivityRating';
import JournalEntry from '../components/JournalEntry';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    content: '',
    mood: null,
    productivityRating: 5,
    attachments: [],
    date: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/api/entries', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (content) => {
    setCurrentEntry((prev) => ({ ...prev, content }));
  };

  const handleMoodSelect = (mood) => {
    setCurrentEntry((prev) => ({ ...prev, mood }));
  };

  const handleProductivityChange = (productivityRating) => {
    setCurrentEntry((prev) => ({ ...prev, productivityRating }));
  };

  const handleAttachment = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurrentEntry((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...response.data.urls],
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentEntry.content.trim() || !currentEntry.mood) {
      alert('Please fill in required fields (content and mood)');
      return;
    }

    try {
      const response = await axios.post('/api/entries', currentEntry, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEntries((prev) => [response.data, ...prev]);
      setCurrentEntry({
        content: '',
        mood: null,
        productivityRating: 5,
        attachments: [],
        date: new Date(),
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Journal</h1>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>

        {showCalendar && (
          <div className="mb-8">
            <Calendar
              className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-4"
              value={currentEntry.date}
              onChange={(date) => setCurrentEntry((prev) => ({ ...prev, date }))}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <JournalEditor onContentChange={handleContentChange} />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How are you feeling?</h3>
            <MoodSelector selectedMood={currentEntry.mood} onMoodSelect={handleMoodSelect} />
          </div>

          <div className="mb-6">
            <ProductivityRating
              value={currentEntry.productivityRating}
              onChange={handleProductivityChange}
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
            <div className="flex flex-col gap-4">
              <MediaRecorder onRecordingComplete={(media) => console.log('Recording completed:', media)} />
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleAttachment}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Entry
          </button>
        </form>

        <div className="space-y-6">
          {entries.map((entry) => (
            <JournalEntry key={entry._id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Journal;