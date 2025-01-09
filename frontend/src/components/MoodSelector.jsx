import React from 'react';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😌', label: 'Peaceful' },
];

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {moods.map(({ emoji, label }) => (
        <button
          key={label}
          onClick={() => onMoodSelect({ emoji, label })}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            selectedMood?.label === label ? 'bg-gray-200' : ''
          }`}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="block text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;