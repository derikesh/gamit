import Link from 'next/link';
import Leaderboard from './Leaderboard';

interface QuickThinkArenaProps {
  title: string;
  description: string;
  path: string;
  emoji: string;
  id: number;
}

export default function QuickThinkArena({ title, description, path, emoji, id }: QuickThinkArenaProps) {
  return (
    <div className="flex gap-6">
      {/* Game Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Game Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <span className="text-4xl animate-pulse">{emoji}</span>
            <div className="absolute -inset-2 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
          </div>
          <div>
            <h2 className="font-press text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              {title}
            </h2>
            <p className="text-cyan-300/90 font-geist-mono text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1e293b]/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-xs text-gray-400 font-geist-mono">Time Limit</p>
            <p className="text-lg font-press text-cyan-300">60s</p>
          </div>
          <div className="bg-[#1e293b]/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-xs text-gray-400 font-geist-mono">Highest Score</p>
            <p className="text-lg font-press text-cyan-300">18</p>
          </div>
          <div className="bg-[#1e293b]/50 rounded-lg p-3 border border-purple-500/20">
            <p className="text-xs text-gray-400 font-geist-mono">Your Score</p>
            <p className="text-lg font-press text-cyan-300">0</p>
          </div>
        </div>

        {/* Play Button */}
        <Link href={path} className='w-fit' >
          <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300  hover:cursor-pointer hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-sm flex items-center justify-center gap-2">
              <span>Quick Play</span>
              <span className="text-lg">⚡</span>
            </span>
          </button>
        </Link>
      </div>

      {/* Leaderboard */}
      <div className="w-[300px]">
        <Leaderboard gameId={id} />
      </div>
    </div>
  );
} 