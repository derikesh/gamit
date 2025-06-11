import NavHeader from "@/src/components/NavHeader";
import GameCard from "@/src/components/GameCard";
import { getGameData } from "./lib/prisma/actions/scores";

export default async function Dashboard() {

  const upcomingGames = [
    {
      title: 'Click Rush',
      description: ' Compete for the highest CPS !',
      path: '/games/space-invaders',
      emoji: '🖱️'
    },
   
  ];
  const allGames = await getGameData();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-[1600px] mx-auto relative">
        <NavHeader/>
        
        
        {/* Active Games Grid */}
        <div className="grid grid-cols-1 gap-8">
          {allGames && allGames.data.map((game) => (
            <div key={game.id} className="bg-[#1e293b]/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300">
              { 
                <GameCard gameData={game} />
              }
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <h2 className="text-3xl press font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingGames.map((game) => (
              <div key={game.path} className="bg-[#1e293b]/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors duration-300">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{game.emoji}</span>
                    <div>
                      <h2 className="font-press text-xl font-bold text-white mb-1">
                        {game.title}
                      </h2>
                      <p className="text-gray-400 font-orbitron text-sm">{game.description}</p>
                    </div>
                  </div>
                  <button 
                    disabled
                    className="group relative px-6 py-2.5 bg-transparent border border-purple-500/20 rounded-lg overflow-hidden transition-all duration-300 cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-white font-geist-mono text-sm">Coming Soon</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}