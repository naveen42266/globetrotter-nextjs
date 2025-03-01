// components/ShareButton.tsx
import { useState } from 'react';
import { toPng } from 'html-to-image';
import { UserScore } from '@/types';

interface ShareButtonProps {
  username: string;
  score: UserScore;
}

const ShareButton = ({ username, score }: ShareButtonProps) => {
  const [showShare, setShowShare] = useState<boolean>(false);
  
  const generateShareImage = async (): Promise<string | null> => {
    const shareElement = document.getElementById('share-content');
    
    if (shareElement) {
      try {
        const dataUrl = await toPng(shareElement, { quality: 0.95 });
        return dataUrl;
      } catch (error) {
        console.error('Error generating share image:', error);
        return null;
      }
    }
    
    return null;
  };
  
  const handleShareClick = async () => {
    setShowShare(true);
    
    // Create the share image in the background
    await generateShareImage();
  };
  
  return (
    <>
      <button
        onClick={handleShareClick}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
      >
        Challenge a Friend
      </button>
      
      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Challenge your friends!</h3>
            
            <div id="share-content" className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-center mb-2">I scored {score.correct} in Globetrotter Challenge!</h4>
              <p className="text-center">Can you beat my score? Click the link to play!</p>
            </div>
            
            <div className="mb-4">
              <p className="mb-2 font-bold">Share this link:</p>
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/${username}`}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="flex space-x-3">
              <a
                href={`https://wa.me/?text=I scored ${score.correct} in Globetrotter Challenge! Can you beat my score? ${window.location.origin}/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded text-center"
              >
                Share on WhatsApp
              </a>
              
              <button
                onClick={() => setShowShare(false)}
                className="flex-1 bg-gray-300 py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
