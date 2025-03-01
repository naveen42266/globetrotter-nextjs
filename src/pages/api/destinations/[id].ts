import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Destination } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Destination | { error: string }>
) {
  const { id } = req.query;
  
  try {
    const filePath = path.join(process.cwd(), 'data', 'destinations.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const destinations: Destination[] = JSON.parse(fileContents);

    console.log('Destinations:', destinations);
    console.log('Requested ID:', id);
    
    const destination = destinations.find(dest => dest.id === id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.status(200).json(destination);
  } catch (error) {
    console.error('Error loading destination:', error);
    res.status(500).json({ error: 'Failed to load destination' });
  }
}