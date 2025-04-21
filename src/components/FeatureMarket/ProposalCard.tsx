import { useState } from 'react';
import { useContractWrite } from 'wagmi';
import { ethers } from 'ethers';
import { FeatureSponsorshipMarket } from '../../contracts/typechain';
import { useToast } from '@chakra-ui/react';

interface Proposal {
  id: number;
  sponsor: string;
  title: string;
  description: string;
  requirements: string;
  totalBudget: bigint;
  stakedAmount: bigint;
  deadline: number;
  selectedDeveloper: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface ProposalCardProps {
  proposal: Proposal;
  isOwner: boolean;
}

export default function ProposalCard({ proposal, isOwner }: ProposalCardProps) {
  const toast = useToast();
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');

  const { writeAsync: submitBid, isLoading: isSubmittingBid } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS as `0x${string}`,
    abi: FeatureSponsorshipMarket.abi,
    functionName: 'submitBid'
  });

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitBid({
        args: [
          proposal.id,
          ethers.utils.parseEther(bidAmount),
          bidProposal,
          Math.floor(Number(timeEstimate) * 86400) // Convert days to seconds
        ]
      });

      toast({
        title: 'Bid Submitted',
        description: 'Your bid has been successfully submitted!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setShowBidForm(false);
      setBidAmount('');
      setBidProposal('');
      setTimeEstimate('');

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit bid. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error submitting bid:', error);
    }
  };

  const formatDeadline = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden rounded-xl backdrop-blur-md bg-white/10 shadow-neuromorphic hover:shadow-neuromorphic-hover transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            proposal.isCompleted
              ? 'bg-green-500/20 text-green-300'
              : proposal.isActive
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-gray-500/20 text-gray-300'
          }`}>
            {proposal.isCompleted ? 'Completed' : proposal.isActive ? 'Active' : 'Closed'}
          </span>
        </div>

        <p className="text-gray-300 mb-4 line-clamp-3">{proposal.description}</p>

        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Budget:</span>
            <span className="font-mono">{ethers.utils.formatEther(proposal.totalBudget)} MOR</span>
          </div>
          <div className="flex justify-between">
            <span>Deadline:</span>
            <span>{formatDeadline(proposal.deadline)}</span>
          </div>
        </div>

        {proposal.isActive && !isOwner && (
          <div className="mt-6">
            {!showBidForm ? (
              <button
                onClick={() => setShowBidForm(true)}
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-colors"
              >
                Submit Bid
              </button>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Bid Amount (MOR)"
                    className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <textarea
                    value={bidProposal}
                    onChange={(e) => setBidProposal(e.target.value)}
                    placeholder="Your proposal..."
                    className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={timeEstimate}
                    onChange={(e) => setTimeEstimate(e.target.value)}
                    placeholder="Time Estimate (days)"
                    className="w-full rounded-md bg-white/5 border border-gray-600 text-white px-4 py-2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmittingBid}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="py-2 px-4 bg-gray-600 rounded-lg text-white font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}