import { motion } from "framer-motion";
import React from "react";
import { Tab } from "@headlessui/react";
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
const DayDescription = ({
  textContent,
  setTextContent,
  selectedTab,
  setSelectedTab,
  recordingType,
  isRecording,
  isPaused,
  startRecording,
  pauseResumeRecording,
  stopRecording,
  mediaFile,
  showPreview,
  videoPreviewRef,
}) => {
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
  );
};

export default DayDescription;
