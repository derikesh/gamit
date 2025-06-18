import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import LeaderboardPage from './LeaderBoardEach';
import { gameitStore } from '../store/store';
import CustomToast from './CustomToast';
import { useGetScore } from '../customHooks/getScore';
import { useUpdateScore } from '../customHooks/updateScore';
import Confetti from 'react-confetti';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
}

export default function GameResult({finalWpm, handlGameEnd}:{finalWpm:number, handlGameEnd:(value:any)=>void}) {
  const[ result , setResult ] = useState<number>();
  const[finish , setFinish ] = useState<boolean>(false);
  const [ topScore , setTopScore ] = useState<number>(0);
  const [isScoreLoaded, setIsScoreLoaded] = useState(false);

  const { resetWpm, setRestart, restart } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // toast message
  const [toast, setToast] = useState<ToastState>({ isVisible: false, message: '', type: 'success' });
  // confetti
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // custom hooks
  const { userHigheScore, setUserHigheScore } = useGetScore(2);

  // Wait for score to be loaded
  useEffect(() => {
    if (userHigheScore > 0) {
      setIsScoreLoaded(true);
    }
  }, [userHigheScore]);

  const { isSuccess, isSuccessChamp } = useUpdateScore({
    userHighScore: isScoreLoaded ? userHigheScore : 0,
    gameId: 2,
    newScore: result || 0,
    finishGame: finish && isScoreLoaded
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setFinish(false);
        handlGameEnd(false);
        setRestart();
        resetWpm();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [restart]);
  
  useEffect(() => {
    const totalCharacters = finalWpm;
    const timeInSeconds = 20;
    const wpm = Math.floor((totalCharacters / 5) * (60 / timeInSeconds));
    setResult(wpm);
    setFinish(true);
  }, []);

  // Handle success states
  useEffect(() => {
    if (isSuccess && result) {
      setUserHigheScore(result);
      setToast({
        isVisible: true,
        message: 'New High Score!',
        type: 'success'
      });
      if (result > userHigheScore) {
        setTopScore(result);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    if (isSuccessChamp) {
      setToast({
        type: 'info',
        message: 'New Avatar Unlocked',
        isVisible: true
      });
    }
  }, [isSuccess, isSuccessChamp, result, userHigheScore]);
  
  return (
    <div className="flex flex-col gap-8 w-full py-10">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Results Section */}
      <div className="flex flex-col gap-4 w-[300px] mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">WPM</p>
            <p className="text-5xl font-bold text-cyan-400">{result}</p>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
          <p className="text-gray-400 text-center text-sm font-medium">Press <span className="text-cyan-400 font-semibold">Tab</span> to Restart</p>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="w-full">
        <LeaderboardPage 
          gameId={2} 
          isGameStarted={false} 
          finishGame={true}
          newHighScore={topScore || 0} 
        />
      </div>

      <CustomToast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        modelOPen={true}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
} 