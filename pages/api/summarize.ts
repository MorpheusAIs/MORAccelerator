import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text. Provide a brief summary of the given content in 150 words or less."
        },
        {
          role: "user",
          content: `Summarize the following in 150 words or less: ${content}`
        }
      ],
    });

    const summary = response.choices[0]?.message?.content?.trim();

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error in AI summarization:', error);
    res.status(500).json({ message: 'Error in AI summarization' });
  }
}