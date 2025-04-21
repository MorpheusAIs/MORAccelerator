import { useState, useEffect } from 'react';
import { useContractReads, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { FeatureSponsorshipMarket } from '../../contracts/typechain';
import ProposalCard from './ProposalCard';

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

export default function ProposalList() {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const { data: proposalCount } = useContractReads({
    contracts: [{
      address: process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS as `0x${string}`,
      abi: FeatureSponsorshipMarket.abi,
      functionName: 'proposalCount'
    }]
  });

  const fetchProposals = async () => {
    if (!proposalCount) return;

    const count = Number(proposalCount);
    const proposalPromises = [];

    for (let i = 0; i < count; i++) {
      proposalPromises.push(
        fetch(`/api/proposals/${i}`).then(res => res.json())
      );
    }

    const fetchedProposals = await Promise.all(proposalPromises);
    setProposals(fetchedProposals);
  };

  useEffect(() => {
    fetchProposals();
  }, [proposalCount]);

  const filteredProposals = proposals.filter(proposal => {
    switch (filter) {
      case 'active':
        return proposal.isActive;
      case 'completed':
        return proposal.isCompleted;
      default:
        return true;
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Feature Proposals</h2>
        
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'active'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            isOwner={address === proposal.sponsor}
          />
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No proposals found for the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}