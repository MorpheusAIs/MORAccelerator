import { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { capabilities, githubRepo, morpheusId } = req.body;

      // Validate the input
      if (!capabilities || !Array.isArray(capabilities) || !githubRepo) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      // Create a new document in the 'developers' collection
      const db = admin.firestore();
      const docRef = await db.collection('developers').add({
        capabilities,
        githubRepo,
        morpheusId: morpheusId || null,
        registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      console.error('Error registering developer:', error);
      res.status(500).json({ error: 'Failed to register developer' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}