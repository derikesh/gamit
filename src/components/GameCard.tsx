'use client'

import Link from 'next/link';
import Leaderboard from './Leaderboard';
import { gameitStore } from '../store/store';
import { getUserScore } from '@/app/lib/prisma/actions/scores';
import { useEffect, useState } from 'react';

interface GAME_DATA_INTEFACE {
  id: number;
  title: string;
  description: string;
  slug:string;
  leaderBoard: any;
}

interface PROP_INTEFACE {
  gameData: GAME_DATA_INTEFACE;
}

export default function GameCard({ gameData }: PROP_INTEFACE) {

  const { activeUser } = gameitStore();
  const [userScore, setUserScore] = useState<number>(0);

  useEffect(() => {
    async function fetchUserScore() {
      if (activeUser?.id) {
        const result = await getUserScore({ 
          userId: activeUser.id, 
          gameId: gameData.id 
        });
        if (result.success) {
          setUserScore(result.score);
        }
      }
    }

    fetchUserScore();
  }, [activeUser?.id, gameData.id]);

  const emojis = ["🧠","⚡"];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-0">
      {/* Game Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Game Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <span className="text-3xl lg:text-4xl animate-pulse">{emojis[gameData.id-1]}</span>
            <div className="absolute -inset-2 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
          </div>
          <div>
            <h2 className="font-press text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              {gameData.title}
            </h2>
            <p className="text-cyan-300/90 font-geist-mono text-xs lg:text-sm leading-relaxed">
              {gameData?.description}
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#1e293b]/40 to-[#1e293b]/60 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-xs text-gray-400 font-geist-mono mb-1">Time Limit</p>
            <p className="text-base lg:text-lg font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">60s</p>
          </div>
          <div className="bg-gradient-to-br from-[#1e293b]/40 to-[#1e293b]/60 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-xs text-gray-400 font-geist-mono mb-1">Highest Score</p>
            <p className="text-base lg:text-lg font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              {gameData.leaderBoard[0]?.score || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1e293b]/40 to-[#1e293b]/60 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-xs text-gray-400 font-geist-mono mb-1">Your Score</p>
            <p className="text-base lg:text-lg font-press text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              {userScore}
            </p>
          </div>
        </div>

        {/* Play Button */}
        <Link href={{ pathname: `/games/${gameData.slug}`, query: { gameId: gameData.id } }} className='w-fit'>
          <button className="group relative px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:cursor-pointer hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-xs lg:text-sm flex items-center justify-center gap-2">
              <span>Quick Play</span>
              <span className="text-base lg:text-lg">⚡</span>
            </span>
          </button>
        </Link>
      </div>

      {/* Leaderboard */}
      <div className="w-full lg:w-[300px] mt-6 lg:mt-0">
        <Leaderboard leaderBoard={gameData.leaderBoard} />
      </div>
    </div>
  );
}