import type { NextPage } from 'next';
import Head from 'next/head';
import HeaderNav from '../../components/HeaderNav';

const Experiences: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Experiences - Globetrotter Challenge</title>
        <meta name="description" content="Explore curated travel experiences with Globetrotter Challenge." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderNav />

      <main className="flex-grow py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Curated Travel Experiences</h1>
            <p className="text-lg text-gray-600">The world's best experiences, curated just for you.</p>
          </header>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Featured Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Example Experience Cards */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Paris, France</h3>
                <p className="text-gray-700 mb-4">
                  Discover the City of Love with iconic landmarks like the Eiffel Tower and Louvre Museum.
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Learn More
                </button>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Tokyo, Japan</h3>
                <p className="text-gray-700 mb-4">
                  Explore the bustling streets of Tokyo, from Shibuya Crossing to serene temples.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Learn More
                </button>
              </div>
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

export default Experiences;