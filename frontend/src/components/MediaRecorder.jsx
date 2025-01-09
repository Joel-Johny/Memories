import React, { useState } from 'react';
import { FaMicrophone, FaVideo, FaStop } from 'react-icons/fa';

const MediaRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState(null);

  const startRecording = (type) => {
    setIsRecording(true);
    setRecordingType(type);
    // Implement actual recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingType(null);
    // Implement stop recording logic here
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={() => startRecording('audio')}
        disabled={isRecording}
        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
      >
        <FaMicrophone />
      </button>
      <button
        onClick={() => startRecording('video')}
        disabled={isRecording}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        <FaVideo />
      </button>
      {isRecording && (
        <button
          onClick={stopRecording}
          className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-800"
        >
          <FaStop />
        </button>
      )}
      {isRecording && (
        <span className="text-red-500 animate-pulse">
          Recording {recordingType}...
        </span>
      )}
    </div>
  );
};

export default MediaRecorder;