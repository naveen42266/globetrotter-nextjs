import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const HeaderNav = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // Check if the user is logged in (client-side only)
  useEffect(() => {
    const username = localStorage.getItem('globetrotter_username');
    setIsLoggedIn(username !== null);
    setIsLoading(false); // Set loading to false after checking
  }, []);
  
  if (isLoading) {
    return null; // Or return a loading spinner
  }

  const handleLogout = () => {
    localStorage.removeItem('globetrotter_username');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold text-blue-600 cursor-pointer">
                🧩 Globetrotter Challenge
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {/* <Link href="/">
              <span
                className={`text-gray-700 hover:text-blue-600 cursor-pointer ${
                  router.pathname === '/' ? 'font-bold' : ''
                }`}
              >
                Home
              </span>
            </Link> */}
            <Link href="/experiences">
              <span
                className={`text-gray-700 hover:text-blue-600 cursor-pointer ${
                  router.pathname === '/experiences' ? 'font-bold' : ''
                }`}
              >
                Experiences
              </span>
            </Link>
            <Link href={isLoggedIn ? "/games" : "/"}>
              <span
                className={`text-gray-700 hover:text-blue-600 cursor-pointer ${
                  router.pathname === '/games' ? 'font-bold' : ''
                }`}
              >
                Games
              </span>
            </Link>
            <Link href="/leaderboard">
              <span
                className={`text-gray-700 hover:text-blue-600 cursor-pointer ${
                  router.pathname === '/leaderboard' ? 'font-bold' : ''
                }`}
              >
                Leaderboard
              </span>
            </Link>
            <Link href="/about">
              <span
                className={`text-gray-700 hover:text-blue-600 cursor-pointer ${
                  router.pathname === '/about' ? 'font-bold' : ''
                }`}
              >
                About
              </span>
            </Link>
          </nav>

          {/* User Profile / Login */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {localStorage.getItem('globetrotter_username')}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/">
                <span className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;