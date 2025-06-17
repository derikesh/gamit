import React, { useEffect, useState } from 'react';
import Leaderboard from './Leaderboard';
import { useGameStore } from '../store/gameStore';
import LeaderboardPage from './LeaderBoardEach';

export default function GameResult({finalWpm, handlGameEnd}:{finalWpm:number, handlGameEnd:(value:any)=>void}) {
  const[ result , setResult ] = useState<number>();
  const[finish , setFinish ] = useState<boolean>(false);
  const { resetWpm, setRestart, restart } = useGameStore();

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

  useEffect(() => {
    if(finish){
      resetWpm();
    }
  }, [finish]);

  return (
    <div className="flex flex-col gap-8 w-full py-10">
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
           gameId={1} 
           isGameStarted={false} 
           finishGame={true}
           newHighScore={10} 
         />
      </div>
    </div>
  );
} 