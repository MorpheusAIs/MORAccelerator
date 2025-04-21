import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DeveloperRegistrationProps {
  onClose: () => void;
}

const DeveloperRegistration: React.FC<DeveloperRegistrationProps> = ({ onClose }) => {
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState('');
  const [morpheusId, setMorpheusId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCapabilityChange = (capability: string) => {
    setCapabilities(prev => 
      prev.includes(capability)
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (capabilities.length === 0 || !githubRepo) {
        throw new Error('Please fill in all required fields');
      }

      const response = await axios.post('/api/registerDeveloper', {
        capabilities,
        githubRepo,
        morpheusId: morpheusId || null,
      });

      if (response.data.success) {
        toast.success('Developer registered successfully!');
        onClose();
      } else {
        throw new Error('Failed to register developer');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <h3 className="text-2xl font-bold mb-6 text-white text-center">Register as Developer</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Capabilities:
            </label>
            <div className="space-y-2">
              {['Frontend', 'Backend', 'Smart Contracts'].map((capability) => (
                <label key={capability} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={capabilities.includes(capability)}
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                    onChange={() => handleCapabilityChange(capability)}
                  />
                  <span className="ml-2 text-white">{capability}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              GitHub Repo:
            </label>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full bg-white bg-opacity-20 rounded-xl border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-white py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2">
              Morpheus Developer ID (optional):
            </label>
            <input
              type="text"
              value={morpheusId}
              onChange={(e) => setMorpheusId(e.target.value)}
              className="w-full bg-white bg-opacity-20 rounded-xl border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-white py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeveloperRegistration;