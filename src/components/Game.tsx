import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';
import { Destination, GameData, GameResult, UserScore } from '@/types';
import ScoreDisplay from './ScoreDisplay';
import ClueCard from './ClueCard';
import AnswerOptions from './AnswerOptions';
import ShareButton from './ShareButton';

interface GameProps {
  challengeUsername?: string;
}

const Game = ({ challengeUsername }: GameProps) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [destinationInfo, setDestinationInfo] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [score, setScore] = useState<UserScore>({ correct: 0, incorrect: 0 });
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Get username from localStorage or redirect to home
    const storedUsername = localStorage.getItem('globetrotter_username');
    if (!storedUsername && !challengeUsername) {
      router.push('/');
      return;
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch initial game data
    fetchNewDestination();

    // Get user score if available
    if (storedUsername) {
      fetchUserScore(storedUsername);
    } else if (challengeUsername) {
      fetchUserScore(challengeUsername);
    }
  }, []);

  const fetchUserScore = async (username: string) => {
    try {
      const response = await fetch(`/api/users/${username}`);
      if (response.ok) {
        const data = await response.json();
        setScore(data.score);
      }
    } catch (error) {
      console.error('Error fetching user score:', error);
    }
  };

  const fetchNewDestination = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setResult(null);
    setDestinationInfo(null);

    try {
      const response = await fetch('/api/destinations/random');
      const data: GameData = await response.json();
      setGameData(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAnswer = async (answerId: string) => {
    if (!gameData) return;

    setSelectedAnswer(answerId);

    const isCorrect = answerId === gameData.correctId;
    setResult(isCorrect ? 'correct' : 'incorrect');

    // Update score
    const newScore = { ...score };
    if (isCorrect) {
      newScore.correct += 1;
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      newScore.incorrect += 1;
    }
    setScore(newScore);

    // Save updated score
    if (username) {
      try {
        await fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ score: newScore }),
        });
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }

    // Fetch destination information
    try {
      const response = await fetch(`/api/destinations/${gameData.correctId}`);
      if (response.ok) {
        const data: Destination = await response.json();
        setDestinationInfo(data);
      } else {
        console.error('Failed to fetch destination info:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching destination info:', error);
    }
  };

  if (loading && !gameData) {
    return <div className="text-center py-10">Loading game...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ScoreDisplay score={score} />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {gameData && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Guess the Destination!</h2>

            <ClueCard clues={gameData.clues} />

            <AnswerOptions
              options={gameData.options}
              selectedAnswer={selectedAnswer}
              correctAnswer={result ? gameData.correctId : null}
              onSelect={handleAnswer}
              disabled={!!result}
            />

            {result && destinationInfo && (
              <div className={`mt-6 p-4 rounded-lg ${result === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
                <h3 className="text-xl font-bold mb-2">
                  {result === 'correct' ? '🎉 Correct!' : '😢 Incorrect!'}
                </h3>
                <p className="mb-2">The answer is: <strong>{destinationInfo.name}</strong></p>
                {destinationInfo.funFacts && destinationInfo.funFacts.length > 0 && (
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-bold mb-1">Fun Fact:</h4>
                    <p>
                      {destinationInfo.funFacts[Math.floor(Math.random() * destinationInfo.funFacts.length)]}
                    </p>
                  </div>
                )}
              </div>
            )}

            {result && (
              <div className="mt-6 flex justify-between">
                <button
                  onClick={fetchNewDestination}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
                >
                  Next Destination
                </button>

                <ShareButton username={username} score={score} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;