// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import { Destination } from '../../../../types';

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Destination | { error: string }>
// ) {
//   const { id } = req.query;
  
//   try {
//     const filePath = path.join(process.cwd(), 'data', 'destinations.json');
//     const fileContents = fs.readFileSync(filePath, 'utf8');
//     const destinations: Destination[] = JSON.parse(fileContents);

//     console.log('Destinations:', destinations);
//     console.log('Requested ID:', id);
    
//     const destination = destinations.find(dest => dest.id === id);
    
//     if (!destination) {
//       return res.status(404).json({ error: 'Destination not found' });
//     }
    
//     res.status(200).json(destination);
//   } catch (error) {
//     console.error('Error loading destination:', error);
//     res.status(500).json({ error: 'Failed to load destination' });
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { Destination } from '../../../../types';

const uri = process.env.MONGODB_URI; // Ensure this is set in Vercel environment variables
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Destination | { error: string }>
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Destination ID is required' });
  }

  try {
    await client.connect();
    const database = client.db('globetrotter');
    const collection = database.collection<Destination>('destinations');

    const destination = await collection.findOne({ id });

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  } finally {
    await client.close();
  }
}