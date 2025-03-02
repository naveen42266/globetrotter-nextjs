// pages/[username]/[gameId].tsx
import { GetServerSideProps, NextPage } from 'next';
import GameComponent from '../../components/GameComponent';
import { Destination } from '@/types';
import Head from 'next/head';
import HeaderNav from '../../components/HeaderNav';
import { useEffect, useState } from 'react';
import UsernameForm from '@/src/components/UsernameForm';

interface GamePageProps {
  gameId: string; // ID of the game segment
  quizzes: Destination[]; // Array of quizzes for the game segment
  username: string;
}


const GamePage: NextPage<GamePageProps> = ({ gameId, quizzes, username }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Check if the user is logged in (client-side only)
  useEffect(() => {
    const username = localStorage.getItem('globetrotter_username');
    setIsLoggedIn(username !== null);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <HeaderNav />
      <Head>
        <title>Games - Globetrotter Challenge</title>
        <meta name="description" content="Challenge yourself with our geography quizzes!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow py-10 px-4">
        {isLoggedIn ? (
          <GameComponent id={gameId} quizzes={quizzes as any} challengeUsername={username} />) :
          (
            <UsernameForm route={`/${username}/${gameId}`} />
          )}
      </main>

      <footer className="bg-white py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<GamePageProps> = async (context) => {
  const { username, gameId } = context.params as { username: string; gameId: string };

  if (!gameId || isNaN(parseInt(gameId, 10))) {
    return {
      notFound: true, // This will cause a 404
    };
  }

  try {
    const res = await fetch(`https://globetrotter-nextjs.vercel.app/api/game/${gameId}`);
    if (!res.ok) throw new Error('Failed to fetch quizzes');

    const quizzes = await res.json();
    if (!quizzes || quizzes.length === 0) return { notFound: true };

    return {
      props: {
        gameId: gameId,
        quizzes,
        username,
      },
    };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return { notFound: true }; // This triggers a 404
  }
};

export default GamePage;