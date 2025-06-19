'use client';

import { useEffect, useState } from "react";

// Custom hook to fetch leaderboard data
import { gameIdScore } from "@/app/lib/prisma/actions/scores";

function useFetchLeaderboard(gameId: number) {
  const [leaderBoard, setLeaderBoard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await gameIdScore({ gameId });
        setLeaderBoard(res?.data?.leaderBoard || []);
      } catch (err: any) {
        setError("Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [gameId]);

  return { leaderBoard, loading, error };
}


interface LeaderboardProps {
  gameId: number;
}

export default function Leaderboard({ gameId }: LeaderboardProps) {
  const { leaderBoard, loading, error } = useFetchLeaderboard(gameId);

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🏆"; 
      case 1:
        return "🥈"; 
      case 2:
        return "🥉"; 
      default:
        return null;
    }
  };

  if (loading) return <div className="text-gray-400">Loading leaderboard...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-purple-500/20">
      <h3 className="text-sm text-gray-400 font-geist-mono mb-4">Top Players</h3>
      <div className="space-y-3">
        {leaderBoard && leaderBoard.slice(0,3).map((player, index) => (
          <div 
            key={player.id}
            className="flex items-center gap-3 p-2 bg-[#1e293b]/30 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30">
              <img
                src={`/images/avatars/${player.user.avatar}.png`}
                alt={player.user.username}
                className="scale-[1.2] h-full w-full mt-[4px] bg-white/90"
              />
            </div>
            <div className="flex-1">
              <p className="text-white font-geist-mono text-sm">{player.user.username}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-cyan-300 font-press text-sm">{player.score}</span>
              <span className="text-gray-400 text-xs">pts</span>
            </div>
            {index < 3 && (
              <div className="w-6 h-6 flex items-center justify-center text-lg">
                {getRankEmoji(index)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 