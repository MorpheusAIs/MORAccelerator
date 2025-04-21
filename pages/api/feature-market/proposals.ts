import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { FeatureSponsorshipMarket } from '../../../contractAbi/FeatureSponsorshipMarket';

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
  FeatureSponsorshipMarket.abi,
  provider
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
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
          status: ['Open', 'InProgress', 'Completed', 'Cancelled'][proposal.status],
          creator: proposal.creator,
          selectedDeveloper: proposal.selectedDeveloper
        }));

        res.status(200).json(formattedProposals);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}