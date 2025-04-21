import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentNetworkStats, getHistoricalStakingData } from '../../utils/blockchain/networkStats';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch current network stats and historical data in parallel
    const [currentStats, stakingHistory] = await Promise.all([
      getCurrentNetworkStats(),
      getHistoricalStakingData(),
    ]);

    // Combine the data
    const combinedStats = {
      ...currentStats,
      stakingHistory,
    };

    res.status(200).json(combinedStats);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    res.status(500).json({ message: 'Error fetching network statistics' });
  }
}