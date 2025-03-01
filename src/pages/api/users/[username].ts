

// // pages/api/users/[username].ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import { User, UserScore } from '../../../../types';

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<User | { error: string }>
// ) {
//   const { username } = req.query as { username: string };
  
//   try {
//     const filePath = path.join(process.cwd(), 'data', 'users.json');
    
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     const fileContents = fs.readFileSync(filePath, 'utf8');
//     const users: User[] = JSON.parse(fileContents);
    
//     const user = users.find(user => user.username === username);
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     if (req.method === 'GET') {
//       res.status(200).json(user);
//     } else if (req.method === 'PUT') {
//       const { score } = req.body as { score: UserScore };
      
//       if (score) {
//         user.score = score;
//         fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
//       }
      
//       res.status(200).json(user);
//     } else {
//       res.status(405).json({ error: 'Method not allowed' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to process user data' });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { User, UserScore } from '../../../../types';

const uri = process.env.MONGODB_URI; // Ensure this is set in Vercel environment variables
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | { error: string }>
) {
  const { username } = req.query as { username: string };

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    await client.connect();
    const database = client.db('globetrotter');
    const collection = database.collection<User>('users');

    if (req.method === 'GET') {
      const user = await collection.findOne({ username });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } else if (req.method === 'PUT') {
      const { score } = req.body as { score: UserScore };

      if (!score) {
        return res.status(400).json({ error: 'Score is required' });
      }

      const result = await collection.updateOne(
        { username },
        { $set: { username, score } },
        { upsert: true }
      );

      if (result.acknowledged) {
        res.status(200).json({ username, score });
      } else {
        res.status(500).json({ error: 'Failed to update user' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error processing user data:', error);
    res.status(500).json({ error: 'Failed to process user data' });
  } finally {
    await client.close();
  }
}