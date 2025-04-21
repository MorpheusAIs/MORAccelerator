import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch MRCs from GitHub repo
    const response = await axios.get(
      'https://api.github.com/repos/MorpheusAIs/MRC/contents'
    );

    // Filter and process MRC files
    const mrcs = response.data
      .filter((file: any) => file.name.toLowerCase().endsWith('.md'))
      .map((file: any) => ({
        id: file.sha,
        title: file.name.replace('.md', ''),
        status: 'Active', // You might want to parse the file content to get the actual status
        lastUpdate: new Date(file.last_modified).toISOString(),
        url: file.html_url,
      }));

    return res.status(200).json(mrcs);
  } catch (error) {
    console.error('Error fetching MRCs:', error);
    return res.status(500).json({ message: 'Error fetching MRCs' });
  }
}