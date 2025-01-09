import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhotoIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";

const JournalEntryForm = () => {
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [recordingType, setRecordingType] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [snapPhotos, setSnapPhotos] = useState([]);
  const [productivityRating, setProductivityRating] = useState(5);
  const [selectedMood, setSelectedMood] = useState(null);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😡", label: "Angry" },
    { emoji: "🥳", label: "Excited" },
    { emoji: "😌", label: "Peaceful" },
    { emoji: "🤔", label: "Thoughtful" },
    { emoji: "😤", label: "Frustrated" },
  ];

  const sliderStyle = {
    background: `linear-gradient(to right, #2563eb ${
      (productivityRating - 1) * 11.1
    }%, #e5e7eb ${(productivityRating - 1) * 11.1}%)`,
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startVideoPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      setShowPreview(true);
    } catch (err) {
      setError("Unable to access camera");
    }
  };

  const stopVideoPreview = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowPreview(false);
  };

  const startRecording = async (type) => {
    try {
      if (type === "video") {
        await startVideoPreview();
      }
      const constraints =
        type === "video" ? { video: true, audio: true } : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, {
          type: type === "video" ? "video/webm" : "audio/webm",
        });
        setMediaFile(URL.createObjectURL(blob));
        stopVideoPreview();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingType(type);
    } catch (err) {
      setError("Unable to access recording device");
    }
  };

  const pauseResumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      stopVideoPreview();
    }
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError("Thumbnail size should be less than 5MB");
        return;
      }
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const handleSnapPhotosUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setSnapPhotos([...snapPhotos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setSnapPhotos(snapPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title,
      textContent,
      mediaFile,
      snapPhotos,
      productivityRating,
      selectedMood,
      thumbnail,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-2 sm:p-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Create New Journal Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter journal title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How was your day?
            </label>
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1">
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2 sm:py-2.5 text-sm font-medium leading-5 transition-all
                  ${
                    selected
                      ? "bg-white shadow text-blue-700"
                      : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-600"
                  }`
                  }
                >
                  Type
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2 sm:py-2.5 text-sm font-medium leading-5 transition-all
                  ${
                    selected
                      ? "bg-white shadow text-blue-700"
                      : "text-gray-700 hover:bg-white/[0.12] hover:text-blue-600"
                  }`
                  }
                >
                  {selectedTab === 1 ? "Record" : "Too tired to type?"}
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-4">
                <Tab.Panel>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Write about your day..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <div className="space-y-4">
                    {recordingType === "video" && showPreview && (
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                        <video
                          ref={videoPreviewRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      {!isRecording ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => startRecording("video")}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto hover:bg-gray-50"
                          >
                            <VideoCameraIcon className="w-5 h-5 mr-2" />
                            Record Video
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => startRecording("audio")}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto hover:bg-gray-50"
                          >
                            <MicrophoneIcon className="w-5 h-5 mr-2" />
                            Record Audio
                          </motion.button>
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-start">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={pauseResumeRecording}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            {isPaused ? (
                              <>
                                <PlayIcon className="w-5 h-5 mr-2" />
                                Resume
                              </>
                            ) : (
                              <>
                                <PauseIcon className="w-5 h-5 mr-2" />
                                Pause
                              </>
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={stopRecording}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            <StopIcon className="w-5 h-5 mr-2" />
                            Stop Recording
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {mediaFile && !isRecording && (
                      <div className="mt-4">
                        {recordingType === "video" ? (
                          <video
                            src={mediaFile}
                            controls
                            className="w-full rounded-lg"
                          />
                        ) : (
                          <audio src={mediaFile} controls className="w-full" />
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Snaps of Memory
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {snapPhotos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <XMarkIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSnapPhotosUpload}
                  className="hidden"
                />
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How productive was your day? ({productivityRating}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={productivityRating}
              onChange={(e) => setProductivityRating(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              "How was your day, if it were an emoji?"
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {moods.map((mood) => (
                <motion.button
                  key={mood.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  aria-pressed={selectedMood?.label === mood.label}
                  className={`p-3 sm:p-4 rounded-lg text-center transition-transform duration-200 ease-in-out 
          ${
            selectedMood?.label === mood.label
              ? "bg-blue-100 border-2 border-blue-500 shadow-md transform scale-105"
              : "bg-gray-50 border border-gray-200"
          }`}
                >
                  <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                  <p className="text-xs sm:text-sm mt-1 text-gray-700">
                    {mood.label}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base"
          >
            <PaperAirplaneIcon className="w-5 h-5 mr-2" />
            Save Journal Entry
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default JournalEntryForm;
