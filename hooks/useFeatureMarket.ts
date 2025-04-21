import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { FeatureSponsorshipMarket } from '../contractAbi/FeatureSponsorshipMarket';
import { MORToken } from '../contractAbi/MORToken';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: number;
  stakeAmount: string;
  milestones: number;
  status: string;
  creator: string;
  selectedDeveloper: string;
}

export interface Bid {
  developer: string;
  amount: string;
  timeEstimate: number;
  proposal: string;
  timestamp: number;
}

export const useFeatureMarket = () => {
  const { account, library } = useWeb3React();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [morToken, setMorToken] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (library) {
      const featureMarket = new ethers.Contract(
        process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
        FeatureSponsorshipMarket.abi,
        library.getSigner()
      );
      
      const token = new ethers.Contract(
        process.env.NEXT_PUBLIC_MOR_TOKEN_ADDRESS!,
        MORToken.abi,
        library.getSigner()
      );

      setContract(featureMarket);
      setMorToken(token);
    }
  }, [library]);

  const createProposal = useCallback(async (
    title: string,
    description: string,
    budget: string,
    deadline: number,
    stakeAmount: string,
    milestones: number
  ) => {
    if (!contract || !morToken || !account) throw new Error('Not connected');
    setLoading(true);
    setError(null);

    try {
      const budgetBN = ethers.utils.parseEther(budget);
      const stakeBN = ethers.utils.parseEther(stakeAmount);

      // First approve tokens
      const approveTx = await morToken.approve(contract.address, budgetBN);
      await approveTx.wait();

      // Create proposal
      const tx = await contract.createProposal(
        title,
        description,
        budgetBN,
        deadline,
        stakeBN,
        milestones
      );
      await tx.wait();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, morToken, account]);

  const submitBid = useCallback(async (
    proposalId: string,
    amount: string,
    timeEstimate: number,
    proposal: string
  ) => {
    if (!contract || !account) throw new Error('Not connected');
    setLoading(true);
    setError(null);

    try {
      const amountBN = ethers.utils.parseEther(amount);
      const tx = await contract.submitBid(
        proposalId,
        amountBN,
        timeEstimate,
        proposal
      );
      await tx.wait();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  const getProposals = useCallback(async (): Promise<Proposal[]> => {
    if (!contract) throw new Error('Not connected');
    setLoading(true);
    setError(null);

    try {
      const totalProposals = await contract.getTotalProposals();
      const proposalPromises = [];

      for (let i = 0; i < totalProposals.toNumber(); i++) {
        proposalPromises.push(contract.getProposal(i));
      }

      const proposalData = await Promise.all(proposalPromises);
      return proposalData.map((proposal, index) => ({
        id: index.toString(),
        title: proposal.title,
        description: proposal.description,
        budget: ethers.utils.formatEther(proposal.budget),
        deadline: proposal.deadline.toNumber(),
        stakeAmount: ethers.utils.formatEther(proposal.stakeAmount),
        milestones: proposal.milestones.toNumber(),
        status: ['Open', 'InProgress', 'Completed', 'Cancelled'][proposal.status],
        creator: proposal.creator,
        selectedDeveloper: proposal.selectedDeveloper
      }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const selectDeveloper = useCallback(async (
    proposalId: string,
    developer: string
  ) => {
    if (!contract || !account) throw new Error('Not connected');
    setLoading(true);
    setError(null);

    try {
      const tx = await contract.selectDeveloper(proposalId, developer);
      await tx.wait();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  const approveMilestone = useCallback(async (
    proposalId: string,
    milestoneIndex: number
  ) => {
    if (!contract || !account) throw new Error('Not connected');
    setLoading(true);
    setError(null);

    try {
      const tx = await contract.approveMilestone(proposalId, milestoneIndex);
      await tx.wait();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  return {
    createProposal,
    submitBid,
    getProposals,
    selectDeveloper,
    approveMilestone,
    loading,
    error
  };
};