import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch MRC updates from GitHub API
    const response = await axios.get('https://api.github.com/repos/MorpheusAIs/MRC/issues', {
      params: {
        state: 'all',
        sort: 'updated',
        direction: 'desc',
        per_page: 5,
      },
    });

    const mrcUpdates = response.data.map((issue: any) => ({
      id: issue.id.toString(),
      title: issue.title,
      status: issue.state,
      created_at: issue.created_at,
      link: issue.html_url,
    }));

    res.status(200).json(mrcUpdates);
  } catch (error) {
    console.error('Error fetching MRC updates:', error);
    res.status(500).json({ message: 'Error fetching MRC updates' });
  }
}