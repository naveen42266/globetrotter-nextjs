// pages/game.tsx
import Game from '@/src/components/Game';
import type { NextPage } from 'next';
import Head from 'next/head';

const GamePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Play - Globetrotter Challenge</title>
        <meta name="description" content="Test your geography knowledge!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex-grow py-10 px-4">
        <Game />
      </main>
      
      <footer className="bg-white py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
      </footer>
    </div>
  );
};

export default GamePage;