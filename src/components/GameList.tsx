// src/components/GameList.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GameList = () => {
  const [games, setGames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch('/api/game');
      const data = await res.json();
      setGames(data);
    };

    fetchGames();
  }, []);

  return (
    <div>
      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Games</h1>
          {/* grid grid-cols-2 sm:grid-cols-4 md:grid-cols-10 gap-4 */}
          <div className="grid grid-cols-1 gap-4">
            {games.map((game: any, index) => (
              // <div key={index} className="mb-2 ">
              //   <button
              //     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              //     onClick={() => router.push(`/games/${game.id}`)}
              //   >
              //     Game {game.id + 1}
              //   </button>
              // </div>
              <div key={index} className='mb-2' onClick={() => router.push(`/games/${game.id}`)}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <h2 className="text-xl font-bold">Game Segment {game.id + 1}</h2>
                  <p className="text-gray-600">Click to play this segment!</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameList;