"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import KeyType from "@/src/components/KeyType";

// demo strings for random string generation
const randomWord2 =
  "the flows when your mind is free to wander and explore typing fast requires practice focus and a bit of";
const randomWord3 =
  "Bright stars twinkle in the night sky inspiring dreams Challenge you daily to improve and never stop learning";
const randomWord4 =
  "A calm mind solves problems more easily than a restless one Books open new worlds full of knowledge and adventure";
const randomWord1 =
  "The quick brown fox jumps over the lazy dog Every journey begins with single step towards the goal";
const randomWord5 =
  "Explore new ideas each day with focus and energy Clear thoughts bring better decisions and lasting change";
const randomWord6 =
  "Typing skills grow with steady effort and calm practice Simple steps lead to big gains over time";

let words = [
  randomWord2,
  randomWord3,
  randomWord4,
  randomWord1,
  randomWord5,
  randomWord6,
];

export default function page() {
  const [word, setword] = useState<string>("");

  interface ARR_STR {
    arrStr: string[];
  }

  useEffect(() => {
    // function to generate random strings
    const randomString = ({ arrStr }: ARR_STR) => {
      let finalString = "";

      for (let i = 0; i < 15; i++) {
        for (const item of arrStr) {
          const randomString = item.split(" ");
          finalString +=
            randomString[Math.floor(Math.random() * randomString.length)] + " ";
        }
      }

      setword(finalString.trim());
    };

    randomString({ arrStr: words });
  }, []);

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
      </div>

      <div className="w-fit max-w-8xl m-auto px-24">
        <div className="flex items-start flex-col justify-center min-h-[70vh] ">
          <p className="text-purple-400 mb-4 text-xl">Start Typing</p>
          <KeyType word={word.toLocaleLowerCase()} />
        </div>
      </div>
    </main>
  );
}
