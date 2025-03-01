// components/ClueCard.tsx
interface ClueCardProps {
    clues: string[];
  }
  
  const ClueCard = ({ clues }: ClueCardProps) => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-2">Clues:</h3>
        <ul className="list-disc pl-5">
          {clues.map((clue, index) => (
            <li key={index} className="mb-1">{clue}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ClueCard;
  