import Link from 'next/link';

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  emoji: string;
  isUpcoming?: boolean;
}

export default function GameCard({ title, description, path, emoji, isUpcoming = false }: GameCardProps) {
  return (
    <div className={`rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all duration-300 p-6 flex flex-col gap-4 border border-purple-500/20 hover:border-purple-500/50 ${isUpcoming ? 'opacity-60 hover:opacity-100 bg-[#1e293b]' : 'bg-[#201843]'}`}>
      <div className="flex items-center gap-4">
        <span className="text-4xl">{emoji}</span>
        <div>
          <h2 className="font-press text-white text-2xl font-bold">
            {title}
          </h2>
          <p className="text-gray-400 font-orbitron text-sm">{description}</p>
        </div>
      </div>
      
      
    </div>
  );
} 