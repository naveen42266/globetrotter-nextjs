// components/ScoreDisplay.tsx
import { UserScore } from "@/types";

interface ScoreDisplayProps {
  score: UserScore;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const total = score.correct + score.incorrect;
  const percentage = total > 0 ? Math.round((score.correct / total) * 100) : 0;
  
  return (
    <div className="bg-gray-100 p-3 rounded-lg mb-4 flex justify-between items-center">
      <div>
        <span className="font-bold">Score: </span>
        <span className="text-green-600">{score.correct} correct</span> / 
        <span className="text-red-600"> {score.incorrect} incorrect</span>
      </div>
      <div className="text-blue-600 font-bold">
        {percentage}% Accuracy
      </div>
    </div>
  );
};

export default ScoreDisplay;
