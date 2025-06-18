"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gameIdScore } from "@/app/lib/prisma/actions/scores";
import { gameitStore } from "../store/store";

interface UserInterface {
  avatar: number;
  username: string;
  score: number;
}

interface LeaderboardUser {
  user: {
    username: string;
    avatar: number;
    score: {
      gameId: number;
      id: number;
      score: number;
      userId: number;
      createdAt: Date;
    }[];
  };
  gameId: number;
  id: number;
  score: number;
  userId: number;
  createdAt: Date;
}

interface PROP_INTEFACE {
  gameId: number;
  isGameStarted: boolean;
  finishGame: boolean;
  newHighScore: number;
}

export default function LeaderboardPage({ gameId, isGameStarted, finishGame, newHighScore }: PROP_INTEFACE) {
  const [isLoading, setIsLoading] = useState(true);
  const [table, setTable] = useState<LeaderboardUser[]>([]);

  const { activeUser } = gameitStore();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const scoreGame = await gameIdScore({ gameId });
        if (scoreGame?.data?.leaderBoard) {
          setTable(scoreGame.data.leaderBoard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [gameId, newHighScore,finishGame]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white font-geist-mono">Loading leaderboard...</div>
      </div>
    );
  }

  const topThree = table.slice(0, 3);
  const remainingPlayers = table.slice(3);

  function getColor(id: number) {
    switch (id) {
      case 1:
        return 'bg-yellow-600';
      case 2:
        return 'bg-slate-400';
      case 3:
        return 'bg-amber-900';
      default:
        return '';
    }
  }

  function getCurrentUserRank( {id}:{id:number} ){

      return id === activeUser?.id

  }

  return (
    <AnimatePresence>
      {!isGameStarted && finishGame && (
        <div className={`min-h-screen bg-gray-900 py-8 ${!isGameStarted && finishGame ? "block" : "hidden"}`}>
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8 font-geist-mono">
              Leaderboard
            </h1>

            {/* Top 3 Players */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {topThree.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative bg-[#1e293b]/50 backdrop-blur-sm p-4 rounded-xl border ${
                    getCurrentUserRank({ id: player.userId })
                      ? 'border-cyan-600 border-3'
                      : index === 0
                      ? 'border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                      : index === 1
                      ? 'border-purple-400/30 shadow-[0_0_20px_rgba(192,132,252,0.2)]'
                      : 'border-pink-400/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                  }`}
                >
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center ${getColor(index + 1)} justify-center border border-white/10`}>
                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/90 mb-3 border-2 border-white/10">
                      <img
                        src={`/images/avatars/${player.user.avatar}.png`}
                        alt={player.user.username}
                        className="w-full h-full object-cover mt-[6px] scale-[1.1]"
                      />
                    </div>
                    <h3 className={`font-geist-mono font-medium mb-1 ${
                      getCurrentUserRank({ id: player.userId }) ? 'text-cyan-400' : 'text-white'
                    }`}>
                      {player.user.username}
                    </h3>
                    <p className="text-cyan-400 font-geist-mono text-sm">{player.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Remaining Players */}
            <div className="bg-[#1e293b]/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10">
              <h2 className="text-xl font-bold text-white mb-6 font-geist-mono">
                Top Players
              </h2>
              <div className="space-y-3">
                {remainingPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group flex items-center justify-between p-4 bg-white/5 rounded-lg border ${
                      getCurrentUserRank({ id: player.userId }) ? 'border-cyan-600 border-3' : 'border-white/5'
                    } hover:bg-white/10 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <span className="text-gray-400 font-geist-mono text-sm w-8">
                          #{index + 4}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <img
                          src={`/images/avatars/${player.user.avatar}.png`}
                          alt={player.user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`font-geist-mono text-sm ${
                        getCurrentUserRank({ id: player.userId }) ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {player.user.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-geist-mono text-sm">
                        {player.score}
                      </span>
                      <span className="text-gray-500 text-xs">pts</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
