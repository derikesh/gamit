'use client'

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ReactConfetti from 'react-confetti';

import allword from "./filtered_valid_words.json";
import LeaderboardPage from "@/src/components/LeaderBoardEach";
import { useSearchParams } from "next/navigation";

import { getUserScore, updateUserHighScore } from "@/app/lib/prisma/actions/scores";
import { gameitStore } from "@/src/store/store";
import CustomToast from "@/src/components/CustomToast";

import { checkTop3 } from "@/app/lib/prisma/actions/userActions";

export default function page() {
  const sets = new Set(allword);
  const inputRef = useRef<HTMLInputElement>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [keyword, setKeyword] = useState("");
  const [arr, setArr] = useState<string[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const [timer, setTime] = useState<number>(60);
  const [ finishGame , setFinishGame ] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [ score , setScore ] = useState(0);
  const [ userHigheScore , setUserHighScore ] = useState<number>(0);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  const { activeUser } = gameitStore();

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const validLetters = ["A","S","R","H","J","K","B","D"];

  const param = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let mark = 0;

    if(!keyword) return;

    let keyLeng = keyword.length;
    
    if(keyLeng >= 10){
      mark = 3
    }else if(keyLeng >= 6){
      mark = 2
    }else{
      mark =1
    }
    if (keyword[0].toUpperCase() !== validLetters[index]) {
      setError(`Word must start with '${validLetters[index]}'!`);
      return;
    }
    if (!sets.has(keyword)) {
      setError("Not a valid word!");
      return;
    }
    if( arr.includes(keyword) ){
      setError("Word already entered");
      return;
    }

    setScore( 
     (prev) => prev + mark
    )
    setArr((prev) => [...prev, keyword]);
    setKeyword("");
    setError("");
  };

  let gameID = Number(param.get('gameId') ?? 0);

  const handleStartGame = () => {

    if(timerRef.current){
      clearInterval(timerRef.current);
    }

    setIsGameStarted(true);
    setTime(60);
    const timerID = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return ()=> clearTimeout( timerID );
  };

  useEffect(() => {
    if (!isGameStarted ) return;

    timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsGameStarted(false);
            setFinishGame(true)
            return 0;
          }
          return prev - 1;
        });

      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
      
  }, [isGameStarted]);

// check the score
useEffect( ()=>{

  async function getScore(){

      if(!activeUser?.id){
        return null;
      }

      try {

        const scoreValue = await getUserScore({userId:activeUser?.id,gameId:gameID});
        if(scoreValue){
          setUserHighScore(scoreValue.score);
        }

      } catch(err){
        console.log('Error in fetching score',err);
        throw err;
      } 
  }

  getScore();

} ,[activeUser?.id]);

useEffect(() => {
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// update the high score if achived
useEffect(() => {
  async function handleHighScore() {
    if (finishGame && activeUser?.id && score > userHigheScore) {
      try {
        const result = await updateUserHighScore({
          userId: activeUser.id,
          gameId: gameID,
          newScore: score
        });

        if (result.success) {
          setUserHighScore(Number(result.score));
          setToast({
            isVisible: true,
            message: 'New High Score!',
            type: 'success'
          });
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);

          // Check if user is top 3 or top 1 and update champ flags
          if( !activeUser.champ || !activeUser.champ2 ){
             try {
              const champStatus = await checkTop3({
                userId: activeUser.id,
                gameId: gameID
              });

              console.log('champ states',champStatus);
  
              if( champStatus.user.champ2 || champStatus.user.champ){
                  setToast({
                    type:'info',
                    message:'New Avatar Unlocked',
                    isVisible:true
                  })            
              }
  
            } catch (err) {
              console.error('Error checking top 3:', err);
              throw err;
            }
          }
        }

      } catch (error) {
        console.error('Error updating high score:', error);
        setToast({
          isVisible: true,
          message: 'Failed to update high score',
          type: 'error'
        });
      }
    }
  }

  handleHighScore();
}, [finishGame, score, userHigheScore, activeUser?.id, gameID]);


   return (
    <main className="min-h-screen bg-[#0f172a] p-8">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <button onClick={() => {
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
            }} className="group relative px-4 py-2 bg-transparent border border-purple-500/20 hover:border-purple-500/50 rounded-lg overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white font-geist-mono text-sm">
                ← Back
              </span>
            </button>
          </Link>
          <h1 className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 ml-4">
            Quick Think Arena
          </h1>
        </div>

        {/* Game Container */}
        <div className="bg-[#1e293b]/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
          {/* Game Instructions */}
          <div className={`text-center mb-8 transform transition-all duration-500 ease-in-out ${finishGame || isGameStarted ? 'hidden' : 'block'}`}>
            <p className="text-gray-300 font-geist-mono mb-2 text-lg">
              Think fast. Type faster. Only real words starting with
              <span className="font-bold text-4xl animate-bounce bg-gradient-to-r from-cyan-400 to-red-600 bg-clip-text text-transparent px-2">{validLetters[index]}</span>count
            </p>
            
            {/* Scoring Rules */}
            <div className="relative bg-gradient-to-br from-[#1e293b]/40 to-[#1e293b]/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 max-w-md mx-auto transform transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(147,51,234,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-press text-xl mb-4">Scoring Rules</h3>
                <ul className="text-gray-300 font-geist-mono text-sm space-y-3">
                  <li className="flex items-center gap-3 p-2 rounded-lg bg-[#1e293b]/30 hover:bg-[#1e293b]/50 transition-colors duration-200">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-bold">1</span>
                    <span>Words with 10+ letters: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-bold">3 points</span></span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg bg-[#1e293b]/30 hover:bg-[#1e293b]/50 transition-colors duration-200">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-bold">2</span>
                    <span>Words with 6-9 letters: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-bold">2 points</span></span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg bg-[#1e293b]/30 hover:bg-[#1e293b]/50 transition-colors duration-200">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-bold">3</span>
                    <span>Words with 1-5 letters: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 font-bold">1 point</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-center gap-4 mb-8 ${isGameStarted || finishGame ? 'hidden' : 'flex'}`}>
            <button 
              onClick={handleStartGame}
              className="group relative hover:cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white font-geist-mono text-sm flex items-center gap-2">
                <span>Start Challenge</span>
                <span className="text-lg">⚡</span>
              </span>
            </button>
            <button 
              onClick={() => setIndex((index + 1) % validLetters.length)}
              className="group relative px-6 py-3 hover:cursor-pointer bg-gradient-to-r from-cyan-800 to-blue-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white font-geist-mono text-sm flex items-center gap-2">
                <span>Change Letter</span>
                <span className="text-lg">🎲</span>
              </span>
            </button>
          </div>

          {/* Game Results */}
          <div className={`${!isGameStarted && finishGame ? 'block' : 'hidden'}`}>
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                  Game Over!
                </h2>
                <p className="text-gray-300 font-geist-mono text-lg">
                  Your Score: <span className="text-cyan-300 font-bold text-2xl">{score}</span>
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setFinishGame(false);
                  setArr([]);
                  setIsGameStarted(false);
                  setScore(0);
                }}
                className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white font-geist-mono text-sm flex items-center gap-2">
                  <span>Play Again</span>
                  <span className="text-lg">🔄</span>
                </span>
              </button>
            </div>
          </div>

          {/* time */}
          <div className={`${isGameStarted ? 'block' : 'hidden'} text-center mb-6`}>
            <div className="inline-block px-4 py-2 bg-[#1e293b]/50 rounded-lg border border-purple-500/20">
              <span className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                {timer}s
              </span>
            </div>
          </div>


          {/* Input Form */}
          <div className={`${isGameStarted ? 'block' : 'hidden'}`}>
            <div className="mb-8 transform transition-all duration-500 ease-in-out">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value.toLowerCase());
                      setError(""); // Clear error when user types
                    }}
                    onPaste={ (e) => e.preventDefault() }
                    placeholder="Type a word starting with 'R'..."
                    className="w-full px-6 py-4 bg-[#1e293b]/50 border border-purple-500/20 rounded-lg text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-geist-mono text-sm hover:shadow-[0_0_10px_rgba(147,51,234,0.5)] transition-all duration-300 transform hover:scale-105"
                  >
                    Submit
                  </button>
                </div>
                {error && (
                  <div className="text-red-400 font-geist-mono text-sm animate-pulse">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Word List */}
          <div className={`${isGameStarted ? 'block' : 'hidden'} bg-[#1e293b]/50 rounded-lg p-6 border border-purple-500/20 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]`}>
            <h3 className="text-sm text-gray-400 font-geist-mono mb-4">
              Live Score: <span className="font-bold font-2xl animate-bounce bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent px-2">{score}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {arr.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1  bg-gradient-to-r from-cyan-800 to-blue-600 rounded-full text-purple-300 font-geist-mono text-sm transform transition-all duration-300 hover:scale-105 hover:bg-purple-500/30"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>


        </div>


      </div>
         <LeaderboardPage 
           gameId={gameID} 
           isGameStarted={isGameStarted} 
           finishGame={finishGame}
           newHighScore={userHigheScore} 
         />
         <CustomToast
           isVisible={toast.isVisible}
           message={toast.message}
           type={toast.type}
           modelOPen={true}
           onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
         />
    </main>
  );
}
