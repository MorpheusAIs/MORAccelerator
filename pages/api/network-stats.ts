import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import axios from 'axios';
import { cacheMiddleware } from '../../lib/cache';
import { getSocketIO } from '../../lib/socket';
import MORTokenABI from '../../contractAbi/myTokenAbi';

const MOR_TOKEN_ADDRESS = process.env.MOR_TOKEN_ADDRESS || '';
const INFURA_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

async function fetchNetworkStats() {
  try {
    // Fetch blockchain data
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    const morToken = new ethers.Contract(MOR_TOKEN_ADDRESS, MORTokenABI, provider);

    // Get total supply and burned tokens
    const totalSupply = await morToken.totalSupply();
    const burnAddress = '0x000000000000000000000000000000000000dEaD';
    const burnedTokens = await morToken.balanceOf(burnAddress);

    // Get block data for transaction count
    const latestBlock = await provider.getBlock('latest');
    const oneDayAgo = latestBlock.timestamp - 86400;
    const dailyTxQuery = await provider.getLogs({
      address: MOR_TOKEN_ADDRESS,
      fromBlock: await provider.getBlockNumber() - 6500, // ~1 day of blocks
      toBlock: 'latest',
    });

    // Fetch GitHub and MorStats data
    const [contributors, agents] = await Promise.all([
      axios.get('https://api.github.com/orgs/MorpheusAIs/members'),
      axios.get('https://api.morstats.info/agents/active'),
    ]);

    // Count unique addresses from transactions
    const uniqueAddresses = new Set();
    dailyTxQuery.forEach(log => {
      const decoded = morToken.interface.parseLog(log);
      if (decoded.args.from) uniqueAddresses.add(decoded.args.from);
      if (decoded.args.to) uniqueAddresses.add(decoded.args.to);
    });

    return {
      totalContributors: contributors.data.length,
      activeAgents: agents.data?.count || uniqueAddresses.size,
      totalMORBurned: ethers.utils.formatEther(burnedTokens),
      dailyTransactions: dailyTxQuery.length
    };
  } catch (error) {
    console.error('Error in fetchNetworkStats:', error);
    // Return fallback data if fetch fails
    return {
      totalContributors: 0,
      activeAgents: 0,
      totalMORBurned: "0",
      dailyTransactions: 0
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use cache middleware to improve performance
    const stats = await cacheMiddleware('network-stats', fetchNetworkStats, 300);
    
    // If this is a websocket client, send real-time updates
    if (req.headers.upgrade === 'websocket') {
      const io = getSocketIO(res);
      io.emit('network-stats-update', stats);
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Failed to fetch network statistics' });
  }
}