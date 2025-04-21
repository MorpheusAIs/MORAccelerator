import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { FeatureSponsorshipMarket } from '../../../contracts/typechain';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_FEATURE_MARKET_ADDRESS!,
      FeatureSponsorshipMarket.abi,
      provider
    );

    // Fetch proposal data
    const proposal = await contract.proposals(id);
    
    // Format the data
    const formattedProposal = {
      id: Number(id),
      sponsor: proposal.sponsor,
      title: proposal.title,
      description: proposal.description,
      requirements: proposal.requirements,
      totalBudget: proposal.totalBudget.toString(),
      stakedAmount: proposal.stakedAmount.toString(),
      deadline: proposal.deadline.toNumber(),
      selectedDeveloper: proposal.selectedDeveloper,
      isActive: proposal.isActive,
      isCompleted: proposal.isCompleted,
    };

    res.status(200).json(formattedProposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal data' });
  }
}