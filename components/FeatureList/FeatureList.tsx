import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useProvider } from 'wagmi';

interface FeatureRequest {
  id: number;
  title: string;
  description: string;
  morAmount: string;
  milestones: number;
  status: string;
}

const FeatureList: React.FC = () => {
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const provider = useProvider();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      // Replace with your actual contract address and ABI
      const contractAddress = 'YOUR_CONTRACT_ADDRESS';
      const contractABI = []; // Add your contract ABI here

      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const featureCount = await contract.getFeatureCount();
      const fetchedFeatures = [];

      for (let i = 0; i < featureCount; i++) {
        const feature = await contract.getFeature(i);
        fetchedFeatures.push({
          id: i,
          title: feature.title,
          description: feature.description,
          morAmount: ethers.utils.formatEther(feature.morAmount),
          milestones: feature.milestones.toNumber(),
          status: feature.status,
        });
      }

      setFeatures(fetchedFeatures);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-dark">
      <h2 className="text-3xl font-bold mb-6 text-light"></h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.id} className="bg-dark-lighter p-6 rounded-xl shadow-neuromorphic">
            <h3 className="text-xl font-semibold text-light mb-2">{feature.title}</h3>
            <p className="text-light-muted mb-4">{feature.description}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-light-muted">MOR Amount:</span>
              <span className="text-primary font-semibold">{feature.morAmount} MOR</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-light-muted">Milestones:</span>
              <span className="text-light">{feature.milestones}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-light-muted">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(feature.status)}`}>
                {feature.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;