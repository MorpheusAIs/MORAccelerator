import React from 'react';
import About from '../components/About/About';

function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 p-8">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg p-10 max-w-4xl w-full text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Morpheus Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white bg-opacity-20 rounded-xl shadow-md">
            <div className="flex justify-center mb-2">
              <span className="text-4xl">🚀</span>
            </div>
            <p className="text-2xl font-bold">26</p>
            <p className="text-sm text-gray-300">MRC's Completed</p>
          </div>
          <div className="p-6 bg-white bg-opacity-20 rounded-xl shadow-md">
            <div className="flex justify-center mb-2">
              <span className="text-4xl">💻</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-300">In Development</p>
          </div>
          <div className="p-6 bg-white bg-opacity-20 rounded-xl shadow-md">
            <div className="flex justify-center mb-2">
              <span className="text-4xl">📈</span>
            </div>
            <p className="text-2xl font-bold">1507+</p>
            <p className="text-sm text-gray-300">MOR Earned</p>
          </div>
          <div className="p-6 bg-white bg-opacity-20 rounded-xl shadow-md">
            <div className="flex justify-center mb-2">
              <span className="text-4xl">👥</span>
            </div>
            <p className="text-2xl font-bold">130</p>
            <p className="text-sm text-gray-300">Average MOR</p>
          </div>
        </div>
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-xl font-bold">Join the Morpheus Network</h3>
          <p className="mt-2">Become part of the revolution in decentralized AI and smart agent technology.</p>
          <button className="mt-4 px-6 py-2 bg-white text-purple-900 rounded-full font-semibold shadow-md transition transform hover:scale-105">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
