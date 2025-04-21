import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let cachedMRCs: any[] = [];
let lastFetchTime = 0;

async function summarizeWithOpenAI(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text. Provide a brief summary of the given content in exactly 50 words, no more and no less."
        },
        {
          role: "user",
          content: `Summarize the following in exactly 50 words: ${content}`
        }
      ],
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error in AI summarization:', error);
    return '';
  }
}

function cleanTitle(rawTitle: string, mrcNumber: string): string {
  // Remove everything before and including "Title:"
  let cleanedTitle = rawTitle.replace(/^.*Title:\s*/, '');

  // Remove any file extensions, prefixes, and URLs
  cleanedTitle = cleanedTitle
    .replace(/\.md:?/g, '')
    .replace(/^#?\s*MRC\s*\d+:?\s*/i, '')
    .replace(/\(https?:\/\/[^\)]+\)/g, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/"/g, '') // Remove quotation marks
    .trim();

  // Truncate the title if it's too long (e.g., more than 50 characters)
  if (cleanedTitle.length > 50) {
    cleanedTitle = cleanedTitle.substring(0, 47) + '...';
  }

  // Add the MRC number at the beginning
  return `MRC ${mrcNumber}: ${cleanedTitle}`;
}

async function fetchAndSummarizeMRCs() {
  const statuses = ['IN PROGRESS', 'IMPLEMENTED', 'CLOSED', 'PENDING'];
  let newMRCs: any[] = [];

  for (const status of statuses) {
    const response = await axios.get(`https://api.github.com/repos/MorpheusAIs/MRC/contents/${status}`);
    const files = response.data.filter((file: any) => file.name.endsWith('.md'));

    for (const file of files) {
      const contentResponse = await axios.get(file.download_url);
      const content = contentResponse.data;
      const lines = content.split('\n');
      const rawTitle = lines[0].replace('# ', '');
      const number = file.name.split('-')[0];
      const title = cleanTitle(rawTitle, number);
      const summary = await summarizeWithOpenAI(content);

      newMRCs.push({
        number,
        title,
        summary,
        status: status.toLowerCase().replace('_', ' '),
        url: file.html_url,
      });
    }
  }

  return newMRCs.sort((a, b) => parseInt(b.number) - parseInt(a.number));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET' || (req.method === 'POST' && req.body.forceUpdate)) {
    try {
      const forceUpdate = req.method === 'POST' && req.body.forceUpdate;

      // Check if cached data is less than 1 hour old and not forcing update
      if (!forceUpdate && cachedMRCs.length > 0 && Date.now() - lastFetchTime < 3600000) {
        return res.status(200).json(cachedMRCs);
      }

      const mrcs = await fetchAndSummarizeMRCs();
      cachedMRCs = mrcs;
      lastFetchTime = Date.now();

      res.status(200).json(mrcs);
    } catch (error) {
      console.error('Error fetching MRCs:', error);
      res.status(500).json({ message: 'Error fetching MRCs' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}