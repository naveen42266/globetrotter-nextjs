import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderNav from '../../components/HeaderNav';

// Mock data for the leaderboard (replace with real data from your backend)
const leaderboardData = [
  { rank: 1, username: 'TravelLover123', score: 950 },
  { rank: 2, username: 'Globetrotter99', score: 890 },
  { rank: 3, username: 'Wanderlust22', score: 840 },
  { rank: 4, username: 'AdventureSeeker', score: 800 },
  { rank: 5, username: 'Explorer101', score: 780 },
  { rank: 6, username: 'NomadLife', score: 750 },
  { rank: 7, username: 'JourneyMaster', score: 720 },
  { rank: 8, username: 'RoamingSoul', score: 700 },
  { rank: 9, username: 'TravelBug', score: 680 },
  { rank: 10, username: 'DestinationDreamer', score: 650 },
];

const Leaderboard: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Leaderboard - Globetrotter Challenge</title>
        <meta name="description" content="Track your progress and compete with others on the Globetrotter Challenge leaderboard." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderNav />

      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-lg text-gray-600">See how you rank against other travelers!</p>
          </header>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Top Travelers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Rank</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">{entry.rank}</td>
                      <td className="py-2 px-4 border-b text-center">{entry.username}</td>
                      <td className="py-2 px-4 border-b text-center">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default Leaderboard;