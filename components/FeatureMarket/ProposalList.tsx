import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  Box,
  SimpleGrid,
  Select,
  Input,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FeatureSponsorshipMarket } from '../../contractAbi/FeatureSponsorshipMarket';
import ProposalCard from './ProposalCard';

interface Proposal {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: number;
  stakeAmount: string;
  milestones: number;
  status: string;
  creator: string;
}

const ProposalList = () => {
  const { library } = useWeb3React();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProposals = async () => {
    if (!library) return;

    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
        FeatureSponsorshipMarket.abi,
        library
      );

      const totalProposals = await contract.getTotalProposals();
      const proposalPromises = [];

      for (let i = 0; i < totalProposals.toNumber(); i++) {
        proposalPromises.push(contract.getProposal(i));
      }

      const proposalData = await Promise.all(proposalPromises);
      const formattedProposals = proposalData.map((proposal, index) => ({
        id: index.toString(),
        title: proposal.title,
        description: proposal.description,
        budget: ethers.utils.formatEther(proposal.budget),
        deadline: proposal.deadline.toNumber(),
        stakeAmount: ethers.utils.formatEther(proposal.stakeAmount),
        milestones: proposal.milestones.toNumber(),
        status: proposal.status,
        creator: proposal.creator,
      }));

      setProposals(formattedProposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [library]);

  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = filter === 'all' || proposal.status.toLowerCase() === filter;
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            bg="white"
            width="200px"
          >
            <option value="all">All Proposals</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
          />
        </HStack>

        {filteredProposals.length === 0 ? (
          <Text>No proposals found</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} onUpdate={fetchProposals} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default ProposalList;