// pages/[username].tsx
import Game from '@/src/components/Game';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

interface ChallengePageProps {
  username: string;
}

const ChallengePage: NextPage<ChallengePageProps> = ({ username }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Challenge from {username} - Globetrotter Challenge</title>
        <meta name="description" content={`Beat ${username}'s score in the Globetrotter Challenge!`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">🧩 Globetrotter Challenge</h1>
            <p className="text-lg text-gray-600">You've been challenged by <strong>{username}</strong>!</p>
          </header>
          
          <Game challengeUsername={username} />
        </div>
      </main>
      
      <footer className="bg-white py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params as { username: string };
  
  return {
    props: {
      username
    }
  };
};

export default ChallengePage;