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
import { set } from "date-fns";
const DayDescription = ({
  content,
  setContent,
  selectedTab,
  setSelectedTab,
  setError,
}) => {
  const liveVideoRef = useRef(null);

  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [videoRecordingState, setVideoRecordingState] = useState("inactive");

  const recordedVideoRef = React.useRef(null);

  const [videoRecorder, setVideoRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]); // Store recorded video chunks

  const stopStream = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    return () => {
      if (videoRecorder) {
        stopStream(videoRecorder.stream);
      }
      // elseif(audioRecorder){
      //   stopStream(audioRecorder.stream);
      // }
    };
  }, []);

  async function startVideoRecording() {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      liveVideoRef.current.srcObject = videoStream;

      const videoRecorder = new MediaRecorder(videoStream);
      // console.log("State : ", videoRecorder.state);

      setVideoRecorder(videoRecorder);
      videoRecorder.ondataavailable = (event) => {
        setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
      };

      videoRecorder.start(200);
      // console.log("Recording started...");
      setVideoRecordingState("recording");
      // console.log("State : ", videoRecorder.state);
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
      recordedVideoRef.current.src = URL.createObjectURL(recordedBlob);
      setVideoRecordingState("inactive");
      setContent({ type: "video/webm", payload: recordedBlob });
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
    recordedVideoRef.current.src = null;
    setIsVideoRecorded(false);
    setVideoRecordingState("inactive");
    setRecordedChunks([]);
  }
  return (
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
              value={content.payload}
              onChange={(e) =>
                setContent({ type: "text", payload: e.target.value })
              }
              placeholder="Write about your day..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-4">
              <Tab.Group>
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
                          ref={recordedVideoRef}
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

                  {/* Audio Tab Panel */}
                  {/* <Tab.Panel>
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        {!isRecording ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => startRecording("audio")}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <MicrophoneIcon className="w-5 h-5 mr-2" />
                            Record Audio
                          </motion.button>
                        ) : (
                          <div className="flex gap-2">
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

                      {mediaFile &&
                        !isRecording &&
                        recordingType === "audio" && (
                          <div className="mt-4">
                            <audio
                              src={mediaFile}
                              controls
                              className="w-full"
                            />
                          </div>
                        )}
                    </div>
                  </Tab.Panel> */}
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
