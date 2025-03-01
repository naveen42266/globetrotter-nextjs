// // pages/api/destinations/random.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import { Destination, GameData } from '../../../../types';

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<GameData | { error: string }>
// ) {
//   try {
//     // Construct the correct file path
//     const filePath = path.join(process.cwd(), 'data', 'destinations.json');
    
//     // Check if the file exists
//     if (!fs.existsSync(filePath)) {
//       console.error(`File not found: ${filePath}`);
      
//       // Use the sample data as fallback
//       const sampleData: Destination[] = [
//         {
//           id: "paris-france",
//           name: "Paris, France",
//           clues: [
//             "This city is home to a famous tower that sparkles every night.",
//             "Known as the 'City of Love' and a hub for fashion and art."
//           ],
//           funFacts: [
//             "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
//             "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
//           ],
//           trivia: "This city is famous for its croissants and macarons. Bon appétit!"
//         },
//         {
//           id: "tokyo-japan",
//           name: "Tokyo, Japan",
//           clues: [
//             "This city has the busiest pedestrian crossing in the world.",
//             "You can visit an entire district dedicated to anime, manga, and gaming."
//           ],
//           funFacts: [
//             "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
//             "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
//           ],
//           trivia: "The city has over 160,000 restaurants, more than any other city in the world."
//         },
//         {
//           id: "new-york-usa",
//           name: "New York, USA",
//           clues: [
//             "Home to a green statue gifted by France in the 1800s.",
//             "Nicknamed 'The Big Apple' and known for its Broadway theaters."
//           ],
//           funFacts: [
//             "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
//             "Times Square was once called Longacre Square before being renamed in 1904."
//           ],
//           trivia: "New York City has 468 subway stations, making it one of the most complex transit systems in the world."
//         }
//       ];
      
//       // With sample data, we proceed as normal
//       const shuffled = [...sampleData].sort(() => 0.5 - Math.random());
//       const selected = shuffled.slice(0, Math.min(4, shuffled.length)); // In case fewer than 4 are available
//       const correctAnswer = selected[0];
      
//       return res.status(200).json({
//         clues: correctAnswer.clues,
//         options: selected.map(dest => ({
//           id: dest.id,
//           name: dest.name
//         })),
//         correctId: correctAnswer.id
//       });
//     }
    
//     // If file exists, read and parse it
//     const fileContents = fs.readFileSync(filePath, 'utf8');
//     let destinations: Destination[];
    
//     try {
//       destinations = JSON.parse(fileContents);
//     } catch (parseError) {
//       console.error('Error parsing JSON:', parseError);
//       return res.status(500).json({ error: 'Invalid JSON in destinations file' });
//     }
    
//     // Validate destinations array
//     if (!Array.isArray(destinations) || destinations.length === 0) {
//       console.error('Destinations is not a valid array or is empty');
//       return res.status(500).json({ error: 'Invalid or empty destinations data' });
//     }
    
//     // Get 4 random destinations (1 correct, 3 incorrect)
//     const shuffled = [...destinations].sort(() => 0.5 - Math.random());
//     const selected = shuffled.slice(0, Math.min(4, shuffled.length)); // In case fewer than 4 are available
//     const correctAnswer = selected[0];
    
//     // Return only the clues and the possible answers
//     res.status(200).json({
//       clues: correctAnswer.clues,
//       options: selected.map(dest => ({
//         id: dest.id,
//         name: dest.name
//       })),
//       correctId: correctAnswer.id
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ error: 'Failed to load destinations' });
//   }
// }

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
  res: NextApiResponse<GameData | { error: string }>
) {
  try {
    await client.connect();
    const database = client.db('globetrotter');
    const collection = database.collection<Destination>('destinations');

    // Fetch all destinations
    const destinations = await collection.find().toArray();

    if (!destinations || destinations.length === 0) {
      return res.status(404).json({ error: 'No destinations found' });
    }

    // Shuffle and select 4 random destinations
    const shuffled = [...destinations].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(4, shuffled.length));
    const correctAnswer = selected[0];

    res.status(200).json({
      clues: correctAnswer.clues,
      options: selected.map(dest => ({
        id: dest.id,
        name: dest.name,
      })),
      correctId: correctAnswer.id,
    });
  } catch (error) {
    console.error('Error fetching random destination:', error);
    res.status(500).json({ error: 'Failed to fetch random destination' });
  } finally {
    await client.close();
  }
}