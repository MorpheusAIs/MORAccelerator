import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useProvider, useSigner } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeveloperRegistration: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState('');
  const [morpheusId, setMorpheusId] = useState('');
  const [experience, setExperience] = useState('');
  const { data: signer } = useSigner();
  const provider = useProvider();

  const toggleModal = () => setIsOpen(!isOpen);

  const handleCapabilityChange = (capability: string) => {
    if (capabilities.includes(capability)) {
      setCapabilities(capabilities.filter(c => c !== capability));
    } else {
      setCapabilities([...capabilities, capability]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Replace with your actual contract address and ABI
      const contractAddress = 'YOUR_CONTRACT_ADDRESS';
      const contractABI = []; // Add your contract ABI here

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.registerDeveloper(name, capabilities.join(','), githubRepo, morpheusId, experience);
      await tx.wait();
      toast.success('Developer registered successfully!');
      toggleModal();
    } catch (error) {
      console.error('Error registering developer:', error);
      toast.error('Error registering developer');
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Register as Developer
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Register as Developer</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Capabilities:
                </label>
                {['Frontend', 'Backend', 'Smart Contracts', 'UI/UX Design', 'DevOps'].map((capability) => (
                  <div key={capability}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCapabilityChange(capability)}
                      />
                      <span className="ml-2">{capability}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  GitHub Repo:
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Morpheus Developer ID (optional):
                </label>
                <input
                  type="text"
                  value={morpheusId}
                  onChange={(e) => setMorpheusId(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Experience (years):
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DeveloperRegistration;