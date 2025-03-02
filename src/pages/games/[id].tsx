import { GetServerSideProps, NextPage } from 'next';
import GameComponent from '../../components/GameComponent';
import { Destination } from '../../../types';
import Head from 'next/head';
import HeaderNav from '../../components/HeaderNav';
interface GamePageProps {
  id: string; // ID of the game segment
  quizzes: Destination[]; // Array of quizzes for the game segment
}

const GamePage: NextPage<GamePageProps> = ({ id, quizzes }) => {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Add the HeaderNav component */}
      <HeaderNav />
      <Head>
        <title>Games - Globetrotter Challenge</title>
        <meta name="description" content="Challenge yourself with our geography quizzes!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow py-10 px-4">
        {/* <h1 className="text-2xl font-bold mb-4 p-4">Game Segment</h1> */}
        <GameComponent id={id} quizzes={quizzes as any} challengeUsername='' />
      </main>

      <footer className="bg-white py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<GamePageProps> = async (context) => {
  const { id } = context.params as { id: string };

  if (!id || isNaN(parseInt(id, 10))) {
    return {
      notFound: true,
    };
  }

  try {
    // Fetch quizzes from your API endpoint
    const res = await fetch(`http://localhost:3000/api/game/${id}`); // Replace with your actual API URL
    if (!res.ok) {
      throw new Error('Failed to fetch quizzes');
    }

    const quizzes = await res.json();

    if (!quizzes || quizzes.length === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        id,
        quizzes,
      },
    };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return {
      notFound: true,
    };
  }
};

export default GamePage;