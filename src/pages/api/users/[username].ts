import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query as { username: string };

  if (req.method === 'PUT') {
    const { score, games } = req.body;

    try {
      await client.connect();
      const database = client.db('globetrotter');
      const collection = database.collection('users');

      // Update the user's document
      const updateResult = await collection.updateOne(
        { username },
        {
          $set: { 
            score, // Update the overall score
            'games': { ...games } // Update the specific game result
          },
        },
        { upsert: true } // Create the document if it doesn't exist
      );

      if (updateResult.acknowledged) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to update user data' });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ error: 'Failed to update user data' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}