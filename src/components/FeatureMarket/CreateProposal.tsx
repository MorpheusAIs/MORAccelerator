import { useState } from 'react';
import { useContractWrite, useContractRead, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { FeatureSponsorshipMarket } from '../../contracts/typechain';
import { useToast } from '@chakra-ui/react';

interface Milestone {
  description: string;
  amount: string;
}

export default function CreateProposal() {
  const { address } = useAccount();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: '', amount: '' }
  ]);

  const { data: minimumStake } = useContractRead({
    address: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS as `0x${string}`,
    abi: FeatureSponsorshipMarket.abi,
    functionName: 'minimumStake'
  });

  const { writeAsync: createProposal, isLoading } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS as `0x${string}`,
    abi: FeatureSponsorshipMarket.abi,
    functionName: 'createProposal'
  });

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: '' }]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const milestoneDescriptions = milestones.map(m => m.description);
      const milestoneAmounts = milestones.map(m => ethers.utils.parseEther(m.amount));
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      await createProposal({
        args: [
          title,
          description,
          requirements,
          ethers.utils.parseEther(totalBudget),
          deadlineTimestamp,
          milestoneDescriptions,
          milestoneAmounts
        ]
      });

      toast({
        title: 'Proposal Created',
        description: 'Your feature proposal has been successfully created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setRequirements('');
      setTotalBudget('');
      setDeadline('');
      setMilestones([{ description: '', amount: '' }]);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create proposal. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error creating proposal:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-neuromorphic">
      <h2 className="text-2xl font-bold mb-6 text-white">Create Feature Proposal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Requirements</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Total Budget (MOR)</label>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-4">Milestones</label>
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                  placeholder="Milestone description"
                  className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
                  required
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                  placeholder="Amount (MOR)"
                  className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMilestone}
            className="text-purple-400 hover:text-purple-300"
          >
            + Add Milestone
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Required stake: {minimumStake ? ethers.utils.formatEther(minimumStake) : '...'} MOR
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Proposal...' : 'Create Proposal'}
        </button>
      </form>
    </div>
  );
}