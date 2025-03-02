import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Destination, GameData } from '../../../../types';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameData[] | { error: string }>
) {
  const { id } = req.query as { id: string };

  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: 'Invalid game ID' });
  }

  const gameId = parseInt(id, 10);
  const quizzesPerGame = 5;
  const start = gameId * quizzesPerGame;
  const end = start + quizzesPerGame;

  try {
    await client.connect();
    const database = client.db('globetrotter');
    const collection = database.collection<Destination>('destinations');

    // Fetch all destinations and slice the required segment
    const destinations = await collection.find().toArray();
    const quizzes = destinations.slice(start, end);

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ error: 'No quizzes found for this game segment' });
    }

    // Map the quizzes to the required GameData format
    const gameData = quizzes.map((quiz) => ({
      clues: quiz.clues,
      options: quizzes.map((dest) => ({
        id: dest.id,
        name: dest.name,
      })),
      correctId: quiz.id,
    }));

    res.status(200).json(gameData);
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ error: 'Failed to fetch game data' });
  } finally {
    await client.close();
  }
}