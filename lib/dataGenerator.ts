import { MongoClient } from 'mongodb';
import axios from 'axios';
import { Destination } from '../types';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env or .env.local
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Verify that the API key is set
if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// MongoDB connection URI
const uri = process.env.MONGODB_URI; // Ensure this is set in your environment variables
if (!uri) {
  console.error('MONGODB_URI is not set in the environment variables.');
  process.exit(1);
}

const client = new MongoClient(uri);

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

async function generateFullDataset(): Promise<void> {
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
    "Paris, France",
    "London, UK",
    "New York City, USA",
    "Rome, Italy",
    "Bangkok, Thailand",
    "Bali, Indonesia",
    "Tokyo, Japan",
    "Los Angeles, USA",
    "Las Vegas, USA",
    "San Francisco, USA",
    "Miami, USA",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Cancún, Mexico",
    "Mexico City, Mexico",
    "Prague, Czech Republic",
    "Vienna, Austria",
    "Berlin, Germany",
    "Munich, Germany",
    "Florence, Italy",
    "Milan, Italy",
    "Athens, Greece",
    "Santorini, Greece",
    "Moscow, Russia",
    "Saint Petersburg, Russia",
    "Stockholm, Sweden",
    "Copenhagen, Denmark",
    "Oslo, Norway",
    "Helsinki, Finland",
    "Dublin, Ireland",
    "Edinburgh, Scotland",
    "Zurich, Switzerland",
    "Geneva, Switzerland",
    "Lucerne, Switzerland",
    "Brussels, Belgium",
    "Lisbon, Portugal",
    "Porto, Portugal",
    "Madrid, Spain",
    "Seville, Spain",
    "Buenos Aires, Argentina",
    "Santiago, Chile",
    "Marrakech, Morocco",
    "Casablanca, Morocco",
    "Cape Town, South Africa",
    "Johannesburg, South Africa",
    "Doha, Qatar",
    "Abu Dhabi, UAE",
    "Kuala Lumpur, Malaysia",
    "Phuket, Thailand",
    "Chiang Mai, Thailand",
    "Hanoi, Vietnam",
    "Ho Chi Minh City, Vietnam",
    "Seoul, South Korea",
    "Kyoto, Japan",
    "Osaka, Japan",
    "Shanghai, China",
    "Beijing, China",
    "Guangzhou, China",
    "Macau, China",
    "Taipei, Taiwan",
    "New Delhi, India",
    "Jaipur, India",
    "Goa, India",
    "Agra, India",
    "Chennai, India",
    "Bangalore, India",
    "Kathmandu, Nepal",
    "Colombo, Sri Lanka",
    "Manila, Philippines",
    "Boracay, Philippines",
    "Fiji Islands",
    "Male, Maldives",
    "Auckland, New Zealand",
    "Queenstown, New Zealand",
    "Christchurch, New Zealand",
    "Honolulu, Hawaii, USA",
    "Orlando, USA",
    "Washington D.C., USA",
    "Chicago, USA",
    "Boston, USA",
    "San Diego, USA",
    "Havana, Cuba",
    "San Juan, Puerto Rico",
    "Lima, Peru",
    "Cusco, Peru",
    "Bogotá, Colombia",
    "Cartagena, Colombia",
    "Rio de Janeiro, Brazil",
    "Sao Paulo, Brazil",
    "Quito, Ecuador",
    "Reykjavik, Iceland",
    "Dubrovnik, Croatia",
    "Zagreb, Croatia",
    "Ljubljana, Slovenia",
    "Bratislava, Slovakia"
  ];

  const fullDataset: Destination[] = [...starterDataset];

  try {
    await client.connect();
    const database = client.db('globetrotter');
    const collection = database.collection<Destination>('destinations');

    // Clear existing data (optional)
    await collection.deleteMany({});

    // Insert starter dataset
    await collection.insertMany(starterDataset);

    // Generate and insert new destinations
    for (const destination of destinationsToGenerate) {
      const data = await generateDestination(destination);
      if (data) {
        await collection.insertOne(data);
        fullDataset.push(data);
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay to respect API rate limits
    }

    console.log(`Generated dataset with ${fullDataset.length} destinations.`);
  } catch (error) {
    console.error('Error generating full dataset:', error);
  } finally {
    await client.close();
  }
}

generateFullDataset().catch(err => {
  console.error('Error generating full dataset:', err);
});