import React, { useEffect, useState } from 'react';
import Leaderboard from './Leaderboard';
import { useScroll } from 'framer-motion';



export default function GameResult({finalWpm}:{finalWpm:number}) {

  const[ result , setResult ] = useState<number>();

  useEffect(() => {
    const totalCharacters = finalWpm; // rename this to what it actually is
    const timeInSeconds = 20;
  
    const wpm = Math.floor((totalCharacters / 5) * (60 / timeInSeconds));
  
    setResult(wpm);
    console.log("FINAL RESULT:", result);
  }, [finalWpm]);


  return (
    <div className="flex gap-8 w-full">
      {/* Results Section */}
      <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Your Results</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-700/30 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-2">WPM</p>
            <p className="text-3xl font-bold text-cyan-400">{result}</p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-2">Accuracy</p>
            {/* <p className="text-3xl font-bold text-green-400">{accuracy}%</p> */}
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm mb-2">Time</p>
            {/* <p className="text-3xl font-bold text-purple-400">{timeTaken}s</p> */}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl text-purple-400 mb-4">Performance Analysis</h3>
          <div className="space-y-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-gray-300">Your typing speed is in the top 20% of players!</p>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="text-gray-300">Great accuracy! Keep up the good work.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="w-80">
        <Leaderboard leaderBoard={[
          { id: 1, userId: 1, gameId: 1, score: 150, user: { username: "SpeedMaster", avatar: "avatar1" } },
          { id: 2, userId: 2, gameId: 1, score: 140, user: { username: "TypeNinja", avatar: "avatar2" } },
          { id: 3, userId: 3, gameId: 1, score: 130, user: { username: "FastFingers", avatar: "avatar3" } }
        ]} />
      </div>
    </div>
  );
} 