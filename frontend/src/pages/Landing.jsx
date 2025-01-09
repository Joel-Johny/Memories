import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPencilAlt, FaCamera, FaChartLine } from "react-icons/fa";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/memories-bg.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            Capture your thoughts.
            <br />
            <span className="text-blue-600">Relive your memories.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Your personal space to document life's precious moments, thoughts,
            and feelings.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/dashboard"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Start Journaling
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
          >
            Your Journey, Your Story
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <FaPencilAlt className="w-8 h-8" />,
                title: "Record Your Thoughts",
                description:
                  "Write down your daily experiences, feelings, and reflections in a beautiful and organized way.",
              },
              {
                icon: <FaCamera className="w-8 h-8" />,
                title: "Attach Memories",
                description:
                  "Add photos, videos, and audio recordings to make your journal entries more vivid and meaningful.",
              },
              {
                icon: <FaChartLine className="w-8 h-8" />,
                title: "Track Your Productivity",
                description:
                  "Monitor your daily productivity and mood patterns to better understand yourself.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-block p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
