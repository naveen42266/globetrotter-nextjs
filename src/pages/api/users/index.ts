
// // pages/api/users/index.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import { User, UserScore, ApiResponse } from '../../../../types';

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ApiResponse<{ username: string }>>
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   }
  
//   try {
//     const { username, score } = req.body as { username: string; score?: UserScore };
    
//     if (!username) {
//       return res.status(400).json({ success: false, error: 'Username is required' });
//     }
    
//     // Check if user exists or create new
//     const dataDir = path.join(process.cwd(), 'data');
//     if (!fs.existsSync(dataDir)) {
//       fs.mkdirSync(dataDir);
//     }
    
//     const filePath = path.join(dataDir, 'users.json');
//     let users: User[] = [];
    
//     try {
//       if (fs.existsSync(filePath)) {
//         const fileContents = fs.readFileSync(filePath, 'utf8');
//         users = JSON.parse(fileContents);
//       }
//     } catch (error) {
//       // File doesn't exist yet or is empty, that's fine
//     }
    
//     const existingUser = users.find(user => user.username === username);
    
//     if (existingUser) {
//       // Update existing user
//       if (score) {
//         existingUser.score = score;
//       }
//     } else {
//       // Create new user
//       users.push({
//         username,
//         score: score || { correct: 0, incorrect: 0 }
//       });
//     }
    
//     fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    
//     res.status(200).json({ success: true, data: { username } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Failed to save user' });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { User, UserScore, ApiResponse } from '../../../../types';

const uri = process.env.MONGODB_URI; // Ensure this is set in Vercel environment variables
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
const client = new MongoClient(uri);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ username: string }>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, score } = req.body as { username: string; score?: UserScore };

    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    await client.connect();
    const database = client.db('globetrotter');
    const collection = database.collection<User>('users');

    const result = await collection.updateOne(
      { username },
      { $set: { username, score: score || { correct: 0, incorrect: 0 } } },
      { upsert: true }
    );

    if (result.acknowledged) {
      res.status(200).json({ success: true, data: { username } });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save user' });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, error: 'Failed to save user' });
  } finally {
    await client.close();
  }
}