import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Trigger a fresh fetch from GitHub by calling our fetchMRCs endpoint with a force update flag
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/fetchMRCs`, { forceUpdate: true });
      
      res.status(200).json({ message: 'MRCs updated successfully' });
    } catch (error) {
      console.error('Failed to update MRCs:', error);
      res.status(500).json({ error: 'Failed to update MRCs' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}