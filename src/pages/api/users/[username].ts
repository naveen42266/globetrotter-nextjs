

// pages/api/users/[username].ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { User, UserScore } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | { error: string }>
) {
  const { username } = req.query as { username: string };
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const users: User[] = JSON.parse(fileContents);
    
    const user = users.find(user => user.username === username);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (req.method === 'GET') {
      res.status(200).json(user);
    } else if (req.method === 'PUT') {
      const { score } = req.body as { score: UserScore };
      
      if (score) {
        user.score = score;
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      }
      
      res.status(200).json(user);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process user data' });
  }
}