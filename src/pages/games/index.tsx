// // pages/game.tsx
// import Game from '../../../src/components/Game';
// import HeaderNav from '../../../src/components/HeaderNav';
// import type { NextPage } from 'next';
// import Head from 'next/head';

// const GamePage: NextPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//         {/* Add the HeaderNav component */}
//         <HeaderNav />
//       <Head>
//         <title>Play - Globetrotter Challenge</title>
//         <meta name="description" content="Test your geography knowledge!" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="flex-grow py-10 px-4">
//         <Game />
//       </main>

//       <footer className="bg-white py-4 text-center text-gray-600">
//         <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
//       </footer>
//     </div>
//   );
// };

// export default GamePage;


// pages/game.tsx
import { useEffect, useState } from 'react';
import GameList from '../../components/GameList';
import HeaderNav from '../../components/HeaderNav';
import type { NextPage } from 'next';
import Head from 'next/head';
import UsernameForm from '@/src/components/UsernameForm';

const GamePage: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Check if the user is logged in (client-side only)
  useEffect(() => {
    const username = localStorage.getItem('globetrotter_username');
    setIsLoggedIn(username !== null);
  }, []);


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
        {isLoggedIn ? (
          <GameList />
        ) : (
          <UsernameForm route={''} />
        )}

      </main>

      <footer className="bg-white py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Globetrotter Challenge</p>
      </footer>
    </div>
  );
};

export default GamePage;