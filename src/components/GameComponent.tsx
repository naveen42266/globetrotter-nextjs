import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Destination, GameData, GameResult, UserScore } from '@/types';
import ScoreDisplay from './ScoreDisplay';
import ClueCard from './ClueCard';
import AnswerOptions from './AnswerOptions';
import ShareButton from './ShareButton';
import { useRouter } from 'next/router';

interface GameComponentProps {
  id: string; // ID of the game segment
  quizzes: GameData[]; // Array of quizzes for the game segment
  challengeUsername?: string;
}

const GameComponent: React.FC<GameComponentProps> = ({ id, quizzes, challengeUsername }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [destinationInfo, setDestinationInfo] = useState<Destination | null>(null);
  const [score, setScore] = useState<UserScore>({ correct: 0, incorrect: 0 });
  const [username, setUsername] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('globetrotter_username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleNextQuiz = async () => {
    setSelectedAnswer(null);
    setResult(null);
    setDestinationInfo(null);

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      // Game is finished
      const correctAnswers = score.correct;
      const totalQuizzes = quizzes.length;
      const percentage = (correctAnswers / totalQuizzes) * 100;

      // Save game results to the user's document
      try {
        const response = await fetch(`/api/users/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: { correct: correctAnswers, incorrect: score.incorrect }, // Update the overall score
            games: {
              [id]: { // Use the game ID as the key
                correctAnswers: correctAnswers,
                totalQuizzes: totalQuizzes,
                percentage: percentage,
              },
            },
          }),
        });

        if (response.ok) {
          alert(`Game Over! Your score is ${correctAnswers}/${totalQuizzes} (${percentage.toFixed(2)}%)`);
          router.back();
        } else {
          console.error('Failed to save game results:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving game results:', error);
      }
    }
  };

  const handleAnswer = async (answerId: string) => {
    if (!quizzes[currentQuizIndex]) return;

    setSelectedAnswer(answerId);

    const isCorrect = answerId === quizzes[currentQuizIndex].correctId;
    setResult(isCorrect ? 'correct' : 'incorrect');

    // Update score
    const newScore = { ...score };
    if (isCorrect) {
      newScore.correct += 1;
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
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
      const response = await fetch(`/api/destinations/${quizzes[currentQuizIndex].correctId}`);
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

  if (!quizzes[currentQuizIndex]) {
    return <div className="text-center py-10">Loading game...</div>;
  }

  const currentQuiz = quizzes[currentQuizIndex];

  return (
    <div className="max-w-3xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Game Segment {id}</h1>
      {challengeUsername && (
        <p className="text-lg text-gray-600 mb-4">
          You've been challenged by <strong>{challengeUsername}</strong>!
        </p>
      )}

      <ScoreDisplay score={score} />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Guess the Destination!</h2>

        <ClueCard clues={currentQuiz.clues} />

        <AnswerOptions
          options={currentQuiz.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={result ? currentQuiz.correctId : null}
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
              onClick={handleNextQuiz}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
            >
              {currentQuizIndex < quizzes.length - 1 ? 'Next Destination' : 'Finish Game'}
            </button>

            <ShareButton gameId={id} username={username} score={score} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameComponent;