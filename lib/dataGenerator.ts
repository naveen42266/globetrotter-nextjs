import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Destination } from '../types';
import * as dotenv from 'dotenv';

// Load environment variables from .env or .env.local
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Verify that the API key is set
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const api = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  params: {
    key: process.env.NEXT_PUBLIC_GEMINI_API_KEY, // Pass the API key as a query parameter
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

const starterDataset: Destination[] = [
  {
    id: "sydney-australia",
    name: "Sydney, Australia",
    clues: ["This city is famous for its iconic opera house.", "It is located in the southeastern part of Australia."],
    funFacts: ["Sydney is the most populous city in Australia.", "The Sydney Opera House is a UNESCO World Heritage Site."],
    trivia: "Sydney was founded in 1788 by British settlers."
  },
  // Add more initial destinations as needed
];

async function generateDestination(destinationName: string): Promise<Destination | null> {
  console.log(`Generating data for destination: ${destinationName}`);
  const prompt = `Generate JSON data for a travel destination guessing game about "${destinationName}". Include:
  1. Two cryptic clues that hint at the destination without naming it directly
  2. Two interesting fun facts about the destination
  3. One piece of trivia about the destination
  Format as JSON:
  {
    "id": "kebab-case-name",
    "name": "Full Name, Country",
    "clues": ["clue1", "clue2"],
    "funFacts": ["fact1", "fact2"],
    "trivia": "interesting trivia"
  }`;

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await api.post('', {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      });

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        let generatedText = response.data.candidates[0].content.parts[0].text.trim();
        console.log(`Generated text for ${destinationName}:`, generatedText);

        // Clean up the generated text by removing Markdown code block syntax
        generatedText = generatedText.replace(/```json\n?|```/g, '').trim();

        try {
          const destinationData = JSON.parse(generatedText) as Destination;
          console.log(`Successfully generated data for ${destinationName}:`, destinationData);
          return destinationData;
        } catch (parseError) {
          console.error(`Error parsing JSON for ${destinationName}:`, parseError);
        }
      } else {
        console.log(`No data generated for ${destinationName}`);
      }
      break;
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        console.error(`Rate limit exceeded for ${destinationName}. Retrying...`);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before retrying
      } else {
        console.error(`Error generating destination data for ${destinationName}:`, error);
        break;
      }
    }
  }
  return null;
}

async function generateFullDataset(): Promise<Destination[]> {
  console.log('Starting to generate the full dataset...');
  const destinationsToGenerate = [
    "Sydney, Australia",
    "Cairo, Egypt",
    "Rio de Janeiro, Brazil",
    "Barcelona, Spain",
    "Amsterdam, Netherlands",
    "Dubai, UAE",
    "Singapore",
    "Venice, Italy",
    "Hong Kong",
    "Istanbul, Turkey",
    // Add more to reach 100+ destinations
  ];

  const fullDataset: Destination[] = [...starterDataset];

  for (const destination of destinationsToGenerate) {
    const data = await generateDestination(destination);
    if (data) {
      fullDataset.push(data);
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay to respect API rate limits
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(
    path.join(dataDir, 'destinations.json'), 
    JSON.stringify(fullDataset, null, 2)
  );
  
  console.log(`Generated dataset with ${fullDataset.length} destinations.`);
  return fullDataset;
}

generateFullDataset().catch(err => {
  console.error('Error generating full dataset:', err);
});