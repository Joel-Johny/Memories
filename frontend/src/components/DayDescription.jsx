import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { Tab } from "@headlessui/react";
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
const DayDescription = ({ content, setError, setFormData }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [recordingTab, setRecordingTab] = useState(0);

  // Existing video refs and states
  const liveVideoRef = useRef(null);
  const [videoRecorder, setVideoRecorder] = useState(null);
  const [videoRecordingState, setVideoRecordingState] = useState("inactive");
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);

  // New audio states
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [audioRecordingState, setAudioRecordingState] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [isAudioRecorded, setIsAudioRecorded] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  const stopStream = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
  };
  useEffect(() => {
    if (content.type && content.type !== "text") {
      setSelectedTab(1);
      if (content.type === "audio/webm") {
        setRecordingTab(1);
        setIsAudioRecorded(true);
        const audioUrl = URL.createObjectURL(content.payload);
        setAudioURL(audioUrl);
      } else {
        setRecordingTab(0);
        setIsVideoRecorded(true);
        const videoUrl = URL.createObjectURL(content.payload);
        if (liveVideoRef.current) liveVideoRef.current.src = videoUrl;
        setRecordedVideoURL(videoUrl);
      }
    }
  }, [content]);
  useEffect(() => {
    return () => {
      if (videoRecorder) {
        stopStream(videoRecorder.stream);
      }
      if (audioRecorder) {
        stopStream(audioRecorder.stream);
      }
    };
  }, []);

  const handleMainTabChange = (index) => {
    setSelectedTab(index);
    reinitializeVideoRecorder();
    reinitializeAudioRecorder();
  };

  const handleRecordingTypeChange = (index) => {
    setRecordingTab(index);
    reinitializeVideoRecorder();
    reinitializeAudioRecorder();
  };

  function reinitializeVideoRecorder() {
    setFormData((oldForm) => {
      return { ...oldForm, content: { type: "", payload: "" } };
    });
    if (videoRecorder) {
      stopStream(liveVideoRef.current.srcObject);
      videoRecorder.stop();
    }
    setVideoRecorder(null);
    setRecordedChunks([]);
    setIsVideoRecorded(false);
    setVideoRecordingState("inactive");
  }

  function reinitializeAudioRecorder() {
    setFormData((oldForm) => {
      return { ...oldForm, content: { type: "", payload: "" } };
    });
    if (audioRecorder) {
      stopStream(audioRecorder.stream);
      audioRecorder.stop();
    }
    setAudioRecorder(null);
    setAudioChunks([]);
    setAudioURL(null);
    setIsAudioRecorded(false);
    setAudioRecordingState("inactive");
  }
  // Functions to Start / Stop /Resume Recording
  async function startVideoRecording() {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          latency: 0, // Minimize latency
        },
      });

      liveVideoRef.current.srcObject = videoStream;

      // Let the stream stabilize for 500ms
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const videoRecorder = new MediaRecorder(videoStream);
      setVideoRecorder(videoRecorder);

      videoRecorder.ondataavailable = (event) => {
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      };

      videoRecorder.start(1000); // Record in 1-second chunks
      setVideoRecordingState("recording");
    } catch (error) {
      setError(error);
      console.error("Error accessing camera:", error);
    }
  }

  function pauseOrResumeVideoRecording() {
    if (videoRecordingState === "recording") {
      videoRecorder.pause();
      setVideoRecordingState("paused");
    } else if (videoRecordingState === "paused") {
      videoRecorder.resume();
      setVideoRecordingState("recording");
    }
  }
  function stopVideoRecording() {
    videoRecorder.onstop = () => {
      // console.log("This is recorded CHunks", recordedChunks);
      const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
      setRecordedVideoURL(URL.createObjectURL(recordedBlob));
      setVideoRecordingState("inactive");
      setFormData((oldForm) => {
        return {
          ...oldForm,
          content: { type: "video/webm", payload: recordedBlob },
        };
      });
      setIsVideoRecorded(true);
      setRecordedChunks([]);
    };
    stopStream(liveVideoRef.current.srcObject);
    videoRecorder.stop();
    // console.log("Recording stopped.");
    // console.log(videoRecorder.state);
  }

  function deleteVideoRecording() {
    // console.log("deleting");
    setRecordedVideoURL(null);
    setIsVideoRecorded(false);
    setVideoRecordingState("inactive");
    setRecordedChunks([]);
  }
  // Audio Recording Functions

  async function startAudioRecording() {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          latency: 0, // Minimize latency
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const recorder = new MediaRecorder(audioStream);
      setAudioRecorder(recorder);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      };

      recorder.start(1000);
      setAudioRecordingState("recording");
    } catch (error) {
      setError(error);
      console.error("Error accessing microphone:", error);
    }
  }

  function pauseOrResumeAudioRecording() {
    if (audioRecordingState === "recording") {
      audioRecorder.pause();
      setAudioRecordingState("paused");
    } else if (audioRecordingState === "paused") {
      audioRecorder.resume();
      setAudioRecordingState("recording");
    }
  }

  function stopAudioRecording() {
    audioRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setFormData((oldForm) => {
        return {
          ...oldForm,
          content: { type: "audio/webm", payload: audioBlob },
        };
      });
      setIsAudioRecorded(true);
      setAudioChunks([]);
      setAudioRecordingState("inactive");
    };

    stopStream(audioRecorder.stream);
    audioRecorder.stop();
  }

  function deleteAudioRecording() {
    setAudioURL(null);
    setIsAudioRecorded(false);
    setAudioRecordingState("inactive");
    setAudioChunks([]);
  }
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        How was your day?*
      </label>
      <Tab.Group selectedIndex={selectedTab} onChange={handleMainTabChange}>
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
              value={content.payload}
              onChange={(e) =>
                setFormData((oldForm) => ({
                  ...oldForm,
                  content: { type: "text", payload: e.target.value },
                }))
              }
              placeholder="Write about your day..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-4">
              <Tab.Group
                selectedIndex={recordingTab}
                onChange={handleRecordingTypeChange}
              >
                <Tab.List className="flex flex-col sm:flex-col md:inline-flex md:flex-row rounded-lg bg-gray-100 p-1 mt-5 w-full md:w-auto">
                  <Tab
                    className={({ selected }) =>
                      `w-full md:w-auto px-4 md:px-10 py-2 text-sm font-medium rounded-md transition-all mb-1 md:mb-0 md:mr-1
            ${
              selected
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:bg-white/[0.12] hover:text-blue-600"
            }`
                    }
                  >
                    <div className="flex items-center justify-center md:justify-start">
                      <VideoCameraIcon className="w-5 h-5 mr-2" />
                      Record Video
                    </div>
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full md:w-auto px-4 md:px-8 py-2 text-sm font-medium rounded-md transition-all
            ${
              selected
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:bg-white/[0.12] hover:text-blue-600"
            }`
                    }
                  >
                    <div className="flex items-center justify-center md:justify-start">
                      <MicrophoneIcon className="w-5 h-5 mr-2" />
                      Record Audio
                    </div>
                  </Tab>
                </Tab.List>

                <Tab.Panels>
                  {/* Video Tab Panel */}
                  <Tab.Panel>
                    <div className="space-y-4">
                      {/* Preview Area */}
                      {!isVideoRecorded &&
                        videoRecordingState === "inactive" && (
                          <div
                            className="relative group cursor-pointer"
                            onClick={startVideoRecording}
                          >
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 aspect-video transition-all duration-200 group-hover:border-blue-500">
                              <div className="flex flex-col items-center justify-center h-full space-y-3">
                                <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-200">
                                  <VideoCameraIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-blue-600">
                                    Video Preview
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Click record to start capturing
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      {/* Live Preview */}
                      <div
                        className={`relative rounded-lg overflow-hidden bg-black aspect-video ${
                          videoRecordingState === "recording" ||
                          videoRecordingState === "paused"
                            ? ""
                            : "hidden"
                        }`}
                      >
                        <video
                          ref={liveVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover `}
                        />
                      </div>

                      {/* Control Buttons */}
                      {(videoRecordingState === "recording" ||
                        videoRecordingState === "paused") && (
                        <div className="flex justify-start">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={pauseOrResumeVideoRecording}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              {videoRecordingState === "paused" ? (
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
                              onClick={stopVideoRecording}
                              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              <StopIcon className="w-5 h-5 mr-2" />
                              Stop Recording
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Final Recorded Video Playback */}
                      <div
                        className={`rounded-lg overflow-hidden bg-black aspect-video
                        ${isVideoRecorded ? "" : "hidden"}
                        `}
                      >
                        <video
                          controls
                          src={recordedVideoURL}
                          className={`w-full h-full object-cover`}
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={deleteVideoRecording}
                        className={`flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ${
                          isVideoRecorded ? "" : "hidden"
                        }`}
                      >
                        <TrashIcon className="w-5 h-5 mr-2" />
                        Delete
                      </motion.button>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="space-y-4">
                      {/* Audio Recording Button */}
                      {!isAudioRecorded &&
                        audioRecordingState === "inactive" && (
                          <div
                            className="relative group cursor-pointer"
                            onClick={startAudioRecording}
                          >
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-200 group-hover:border-blue-500">
                              <div className="flex flex-col items-center justify-center h-full space-y-3">
                                <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-200">
                                  <MicrophoneIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-blue-600">
                                    Audio Recording
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Click to start recording
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Recording Controls */}
                      {(audioRecordingState === "recording" ||
                        audioRecordingState === "paused") && (
                        <div className="min-h-[200px] border-2 border-gray-200 rounded-lg p-6">
                          <div className="flex flex-col items-center justify-center h-full space-y-6">
                            {/* Animated Microphone Icon */}
                            <motion.div
                              animate={{
                                scale:
                                  audioRecordingState === "recording"
                                    ? [1, 1.2, 1]
                                    : 1,
                              }}
                              transition={{
                                repeat:
                                  audioRecordingState === "recording"
                                    ? Infinity
                                    : 0,
                                duration: 1.5,
                              }}
                              className="relative"
                            >
                              <div className="p-4 bg-red-50 rounded-full">
                                <MicrophoneIcon
                                  className={`w-8 h-8 ${
                                    audioRecordingState === "recording"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                />
                              </div>
                              {audioRecordingState === "recording" && (
                                <motion.div
                                  className="absolute inset-0 rounded-full bg-red-100 -z-10"
                                  animate={{
                                    scale: [1, 1.5],
                                    opacity: [0.5, 0],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                  }}
                                />
                              )}
                            </motion.div>

                            {/* Control Buttons */}
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={pauseOrResumeAudioRecording}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                {audioRecordingState === "paused" ? (
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
                                onClick={stopAudioRecording}
                                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                <StopIcon className="w-5 h-5 mr-2" />
                                Stop Recording
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Audio Playback */}
                      {isAudioRecorded && audioURL && (
                        <div className="space-y-4">
                          <audio src={audioURL} controls className="w-full" />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={deleteAudioRecording}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Delete
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default DayDescription;
