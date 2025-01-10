import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import MemorySnapshot from "../components/MemorySnapshot";
import ProductivitySlider from "../components/ProductivitySlider";
import MoodPicker from "../components/MoodPicker";
import TitleNThumbnail from "../components/TitleNThumbnail";
import DayDescription from "../components/DayDescription";
const JournalEntryForm = () => {
  //States for journal Title and Thumbnail
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  //States for journal Description Audio/Video/Text
  const [textContent, setTextContent] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [mediaFile, setMediaFile] = useState(null);
  const [recordingType, setRecordingType] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const mediaStreamRef = useRef(null);

  //State for journal Snapshot
  const [snapPhotos, setSnapPhotos] = useState([]);
  //States for journal Productivity and Mood
  const [productivityRating, setProductivityRating] = useState(5);
  const [selectedMood, setSelectedMood] = useState(null);

  //State for Error which will be used for recording error or api errors
  const [error, setError] = useState("");

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

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThumbnail(imageUrl);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
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

          {/* Journal Title and Thumbnail Component */}
          <TitleNThumbnail
            title={title}
            setTitle={setTitle}
            handleThumbnailUpload={handleThumbnailUpload}
            thumbnail={thumbnail}
            removeThumbnail={removeThumbnail}
          />

          {/* Journal Description Component */}
          <DayDescription
            textContent={textContent}
            setTextContent={setTextContent}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            recordingType={recordingType}
            isRecording={isRecording}
            isPaused={isPaused}
            startRecording={startRecording}
            pauseResumeRecording={pauseResumeRecording}
            stopRecording={stopRecording}
            mediaFile={mediaFile}
            videoPreviewRef={videoPreviewRef}
            showPreview={showPreview}
          />

          {/*Memory Snap Upload */}
          <MemorySnapshot
            snapPhotos={snapPhotos}
            handleSnapPhotosUpload={handleSnapPhotosUpload}
            removePhoto={removePhoto}
          />

          {/*Productivity Slider*/}
          <ProductivitySlider
            productivityRating={productivityRating}
            setProductivityRating={setProductivityRating}
          />

          {/*Mood Picker */}
          <MoodPicker
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
          {/* Save Button */}
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
