'use client'

import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';

const FeatureRequestSubmission: React.FC = () => {
  const { account, activate } = useWeb3React();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    timeline: '',
    criteria: '',
    tags: '',
  });

  const handleConnect = async () => {
    console.log('Connecting wallet...');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting feature request:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <div className="bg-transparent rounded-3xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Submit Feature Request</h2>
          {!account && !isRegistering ? (
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300 ease-in-out"
              >
                Connect with MetaMask
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition duration-300 ease-in-out"
              >
                Register New Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-800 bg-opacity-30 rounded-xl p-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Feature Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full bg-transparent border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-800 bg-opacity-30 rounded-xl p-4">
                  <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">Value (USD/MOR)</label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    className="w-full bg-transparent border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.value}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="bg-blue-800 bg-opacity-30 rounded-xl p-4">
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-1">Project Timeline</label>
                  <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    className="w-full bg-transparent border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="bg-blue-800 bg-opacity-30 rounded-xl p-4">
                <label htmlFor="criteria" className="block text-sm font-medium text-gray-300 mb-1">Acceptance Criteria</label>
                <input
                  type="text"
                  id="criteria"
                  name="criteria"
                  className="w-full bg-transparent border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.criteria}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="bg-blue-800 bg-opacity-30 rounded-xl p-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Category Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="w-full bg-transparent border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.tags}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition duration-300 ease-in-out"
              >
                Submit Feature Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureRequestSubmission;