import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaChartLine, FaUsers } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function About() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const statisticsList = [
    { count: "26", title: "MRC's Completed", icon: <FaRocket /> },
    { count: "12", title: "In Development", icon: <FaCode /> },
    { count: "1507+", title: "MOR Earned", icon: <FaChartLine /> },
    { count: "130", title: "Average MOR", icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Morpheus</h1>
          <p className="text-2xl text-gray-300">A Network For Powering Smart Agents</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { title: "In Development", link: "/in-development" },
            { title: "Current MRC's", link: "/current-mrcs" },
            { title: "Recently Completed", link: "/recently-completed" },
            { title: "Smart Agents", link: "/smart-agents" },
          ].map((item, index) => (
            <Link href={item.link} key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">Explore more about {item.title.toLowerCase()}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* About Section */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-white mb-4">About Morpheus</h2>
            <p className="text-gray-300 mb-4">
              Morpheus is dedicated to democratizing AI by creating the first decentralized peer-to-peer network of personal smart agents. Our mission is to provide everyone with access to advanced AI capabilities in a permissionless, decentralized manner.
            </p>
            <p className="text-gray-300">
              The Smart Agent concept of connecting LLMs and AI Agents to wallets, Dapps, & smart contracts promises to open the world of Web3 to everyone. Chatting in normal language with your Smart Agent and having it understand the question or task, is similar to how Google's search engine opened the early internet up to the general public.
            </p>
          </motion.div>
        </div>

        {/* Statistics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Morpheus Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statisticsList.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center shadow-lg"
              >
                <div className="text-4xl text-white mb-2">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.count}</h3>
                <p className="text-gray-300">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Join the Morpheus Network</h2>
          <p className="text-xl text-gray-200 mb-6">
            Become part of the revolution in decentralized AI and smart agent technology.
          </p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-gray-100 transition duration-300"
            >
              Register Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default About;