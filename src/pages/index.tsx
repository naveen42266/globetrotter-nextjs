// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import UsernameForm from '../components/UsernameForm';
import OpenAI from "openai";
import * as dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';

// Load environment variables from .env or .env.local
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

async function fetchCompletion() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "Write a haiku about recursion in programming.",
      },
    ],
    store: true,
  });

  console.log(completion.choices[0].message);
}

// fetchCompletion();

const api = axios.create({
  baseURL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function fetchGeminiCompletion(body: any) {
  try {
    const response = await api.post(`?key=AIzaSyDDfRoOqKf7UmiOygurskCjyQ1jqBRBoJA`, body);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error generating content:", error.response?.data || error.message);
    } else {
      console.error("Error generating content:", error);
    }
    throw error;
  }
}

const generateContent = async (prompt: any) => {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetchGeminiCompletion(body);
    // setText(response.candidates[0].content.parts[0].text)
    console.log("Response:", response.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Error:", error);
  }
};
const Home: NextPage = () => {

  // generateContent("What is the future of AI");
  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)

  console.log(process.env.GEMINI_API_KEY)
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Globetrotter Challenge</title>
        <meta name="description" content="The ultimate travel guessing game!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">🧩 Globetrotter Challenge</h1>
            <p className="text-lg text-gray-600">The Ultimate Travel Guessing Game!</p>
          </header>

          <UsernameForm />

          <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You'll receive cryptic clues about famous destinations around the world.</li>
              <li>Try to guess which destination the clues are describing.</li>
              <li>Choose from four possible answers for each challenge.</li>
              <li>Earn points for each correct answer and track your score.</li>
              <li>Learn fun facts about each destination after guessing.</li>
              <li>Challenge your friends to beat your score!</li>
            </ul>
          </div>

          <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Over 100 destinations from around the world</li>
              <li>Interesting trivia and facts about each location</li>
              <li>Track your score and see your accuracy percentage</li>
              <li>Share your results with friends on social media</li>
              <li>Challenge mode to compete with friends</li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-2">Already have a username?</p>
            <Link href="/game" className="text-blue-500 hover:underline font-medium">
              Continue Playing
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 text-center text-gray-600">
        <div className="max-w-4xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Globetrotter Challenge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;