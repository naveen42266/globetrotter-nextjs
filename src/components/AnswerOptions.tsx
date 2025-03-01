// components/AnswerOptions.tsx
interface AnswerOption {
  id: string;
  name: string;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
  selectedAnswer: string | null;
  correctAnswer: string | null;
  onSelect: (id: string) => void;
  disabled: boolean;
}

const AnswerOptions = ({ 
  options, 
  selectedAnswer, 
  correctAnswer, 
  onSelect, 
  disabled 
}: AnswerOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        let className = "p-3 rounded-lg border-2 text-center cursor-pointer transition-all";
        
        if (selectedAnswer === option.id) {
          className += correctAnswer === option.id
            ? " border-green-500 bg-green-100"
            : " border-red-500 bg-red-100";
        } else if (correctAnswer && correctAnswer === option.id) {
          className += " border-green-500 bg-green-100";
        } else {
          className += " border-gray-300 hover:border-blue-500";
        }
        
        if (disabled && selectedAnswer !== option.id && correctAnswer !== option.id) {
          className += " opacity-50";
        }
        
        return (
          <div
            key={option.id}
            className={className}
            onClick={() => !disabled && onSelect(option.id)}
          >
            {option.name}
          </div>
        );
      })}
    </div>
  );
};

export default AnswerOptions;