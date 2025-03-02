// pages/[username]/index.tsx
import HeaderNav from '@/src/components/HeaderNav';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

interface UserPageProps {
  username: string;
  gameIds: number[]; // Array of available game IDs for the user
  gameId: string;
}

const UserPage: NextPage<UserPageProps> = ({ username, gameIds, gameId }) => {

  console.log(username, gameIds, gameId);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <HeaderNav />
      <Head>
        <title>{username}'s Challenges - Globetrotter Challenge</title>
        <meta name="description" content={`Explore ${username}'s challenges in the Globetrotter Challenge!`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">🧩 Globetrotter Challenge</h1>
            <p className="text-lg text-gray-600">You've been challenged by <strong>{username}</strong>!</p>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {gameIds.map((gameId) => (
              <Link key={gameId} href={`/${username}/${gameId}`}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <h2 className="text-xl font-bold">Game Segment {gameId}</h2>
                  <p className="text-gray-600">Click to play this segment!</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {
  const { username, gameId } = context.params as { username: string; gameId: string };

  // Fetch available game IDs for the user (replace with your logic)
  const gameIds = [1, 2, 3, 4, 5]; // Example: Static list of game IDs

  return {
    props: {
      username,
      gameIds,
      gameId: gameId ? gameId : ''
    },
  };
};

export default UserPage;