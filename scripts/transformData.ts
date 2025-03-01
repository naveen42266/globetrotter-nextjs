// scripts/transformData.ts
import fs from 'fs';
import path from 'path';
import { Destination } from '../types';

interface RawDestination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

function transformData() {
  // Read the raw data file
  const rawDataPath = path.join(process.cwd(), 'data', 'raw-destinations.json');
  const rawData: RawDestination[] = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
  
  // Transform to the expected format
  const transformedData: Destination[] = rawData.map(item => {
    return {
      id: `${item.city.toLowerCase()}-${item.country.toLowerCase()}`.replace(/\s+/g, '-'),
      name: `${item.city}, ${item.country}`,
      clues: item.clues,
      funFacts: item.fun_fact,
      trivia: item.trivia[0] // Taking just the first trivia item
    };
  });
  
  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Write the transformed data
  const destinationsPath = path.join(dataDir, 'destinations.json');
  fs.writeFileSync(destinationsPath, JSON.stringify(transformedData, null, 2));
  
  console.log(`Transformed ${transformedData.length} destinations and saved to ${destinationsPath}`);
}

// Run the transformation
transformData();