import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderNav from '../../components/HeaderNav';

const About: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>About - Globetrotter Challenge</title>
        <meta name="description" content="Learn more about the Globetrotter Challenge and its connection to Headout." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderNav />

      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">About Globetrotter Challenge</h1>
            <p className="text-lg text-gray-600">The Ultimate Travel Guessing Game!</p>
          </header>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At Globetrotter Challenge, we believe that travel is more than just visiting new places—it's about experiencing the world in unique and meaningful ways. Our mission is to inspire curiosity and exploration through fun and engaging challenges.
            </p>

            <h2 className="text-2xl font-bold mb-4">In Partnership with Headout</h2>
            <p className="text-gray-700 mb-4">
              This app is proudly brought to you by <strong>Headout</strong>, the world's leading platform for curated travel experiences. Headout connects travelers with the best activities, tours, and attractions in cities around the globe.
            </p>

            <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Curated experiences designed just for you.</li>
              <li>Fun and educational challenges to test your travel knowledge.</li>
              <li>Track your progress and compete with friends on the leaderboard.</li>
              <li>Learn fascinating facts about destinations worldwide.</li>
            </ul>
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

export default About;