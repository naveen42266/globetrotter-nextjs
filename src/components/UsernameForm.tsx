// components/UsernameForm.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

interface UsernameFormProps {
  route: string;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ route }) => {
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        // Save username to localStorage for persistence
        localStorage.setItem('globetrotter_username', username);

        if (route) {
          console.log('route', route);
          router.reload();
          router.push(`${route}`)
        }
        else {
          router.push('/games');
        }
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Join the Globetrotter Challenge!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Choose a username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your username"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {loading ? 'Loading...' : 'Start Playing'}
        </button>
      </form>
    </div>
  );
};

export default UsernameForm;
