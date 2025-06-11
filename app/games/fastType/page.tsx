'use client'

import React, { useEffect, useState } from 'react'
import Link from "next/link";

const randomWord2 = "the flows when your mind is free to wander and explore typing fast requires practice focus and a bit of";
const randomWord3 = "Bright stars twinkle in the night sky inspiring dreams Challenge you daily to improve and never stop learning";
const randomWord4 = "A calm mind solves problems more easily than a restless one Books open new worlds full of knowledge and adventure";
const randomWord1 = "The quick brown fox jumps over the lazy dog Every journey begins with single step towards the goal";

let words = [randomWord2, randomWord3, randomWord4, randomWord1]

export default function page() {
  const [word, setword] = useState<string>("");
  const [isBuilding] = useState(true); // Building mode state

  interface ARR_STR {
    arrStr: string[]
  }

  useEffect(() => {
    const randomString = ({ arrStr }: ARR_STR) => {
      let finalString = "";

      for (let i = 0; i < 12; i++) {
        for (const item of arrStr) {
          const randomString = item.split(" ")
          finalString += randomString[Math.floor(Math.random() * randomString.length)] + ' '
        }
      }

      setword(finalString.trim());
    }

    randomString({ arrStr: words });
  }, [])

  return (
    <main className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <button className="group relative px-4 py-2 bg-transparent border border-purple-500/20 hover:border-purple-500/50 rounded-lg overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white font-geist-mono text-sm">
                ← Back
              </span>
            </button>
          </Link>
          <h1 className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 ml-4">
            Fast Type Challenge
          </h1>
        </div>

        <div className='w-fit m-auto max-w-8xl px-24'>
          {/* Game Container */}
          <div className="flex items-center flex-col justify-center min-h-[70vh]">
            {isBuilding ? (
              <div className="text-center">
                <p className="text-2xl text-purple-400 font-mono mb-4">🚧 Under Construction 🚧</p>
                <p className="text-gray-400 font-mono">This game is currently being built. Check back soon!</p>
              </div>
            ) : (
              <>
                <p className='text-purple-400 mb-4'>Start Typing</p>
                <p className="text-3xl text-gray-300 font-mono text-center leading-relaxed">
                  {word.toLowerCase()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
