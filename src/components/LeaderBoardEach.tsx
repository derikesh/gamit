"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gameIdScore } from "@/app/lib/prisma/actions/scores";

interface LeaderboardUser {
  id: number;
  username: string;
  avatar: number;
  totalScore: number;
  rank: number;
}

const avatars = [
  "https://picsum.photos/seed/player1/200",
  "https://picsum.photos/seed/player2/200",
  "https://picsum.photos/seed/player3/200",
  "https://picsum.photos/seed/player4/200",
  "https://picsum.photos/seed/player5/200",
];

// Demo data
const demoLeaderboard: LeaderboardUser[] = [
  { id: 1, username: "ProGamer123", avatar: 1, totalScore: 9850, rank: 1 },
  { id: 2, username: "NinjaWarrior", avatar: 2, totalScore: 8720, rank: 2 },
  { id: 3, username: "PixelMaster", avatar: 3, totalScore: 7650, rank: 3 },
  { id: 4, username: "GameWizard", avatar: 4, totalScore: 6540, rank: 4 },
  { id: 5, username: "SpeedRunner", avatar: 5, totalScore: 5430, rank: 5 },
  { id: 6, username: "EpicPlayer", avatar: 1, totalScore: 4320, rank: 6 },
  { id: 7, username: "GameChampion", avatar: 2, totalScore: 3210, rank: 7 },
  { id: 8, username: "LevelMaster", avatar: 3, totalScore: 2980, rank: 8 },
  { id: 9, username: "ScoreHunter", avatar: 4, totalScore: 2870, rank: 9 },
  { id: 10, username: "GamePro", avatar: 5, totalScore: 2760, rank: 10 },
  { id: 11, username: "QuickPlayer", avatar: 1, totalScore: 2650, rank: 11 },
  { id: 12, username: "GameMaster", avatar: 2, totalScore: 2540, rank: 12 },
  { id: 13, username: "ScoreKing", avatar: 3, totalScore: 2430, rank: 13 },
];

const getMedalEmoji = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
};

const getTopThreeStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-br from-yellow-400 to-yellow-600  z-30";
    case 2:
      return "bg-gradient-to-br from-gray-300 to-gray-400  z-20";
    case 3:
      return "bg-gradient-to-br from-amber-600 to-amber-800  z-10";
    default:
      return "bg-gradient-to-br from-purple-500 to-pink-500";
  }
};

export default  function LeaderboardPage({
  isGameStarted,
  finishGame,
  gameId
}: {
  isGameStarted: any;
  finishGame: any;
  gameId:string | null
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLeaderboard(demoLeaderboard);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white font-geist-mono">Loading leaderboard...</div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remainingPlayers = leaderboard.slice(3, 13);

  return (
    <AnimatePresence>
      {!isGameStarted && finishGame && (
        <div
          className={`min-h-screen bg-gray-900 py-8 ${
            !isGameStarted && finishGame ? "block" : "hidden"
          }`}
        >
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
                  className={`relative ${getTopThreeStyle(
                    player.rank
                  )} p-4 rounded-xl shadow-lg`}
                >
                  <div className="absolute -top-3 -right-3 text-3xl">
                    {getMedalEmoji(player.rank)}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white/20">
                      <img
                        src={avatars[player.avatar - 1]}
                        alt={player.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {player.username}
                    </h3>
                    <p className="text-white/80 text-sm">{player.totalScore}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Remaining Players */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <h2 className="text-xl font-bold text-white mb-4 font-geist-mono">
                Top Players
              </h2>
              <div className="space-y-2">
                {remainingPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 font-geist-mono w-6 text-sm">
                        #{player.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={avatars[player.avatar - 1]}
                          alt={player.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white font-geist-mono text-sm">
                        {player.username}
                      </span>
                    </div>
                    <span className="text-white/80 font-geist-mono text-sm">
                      {player.totalScore} pts
                    </span>
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
