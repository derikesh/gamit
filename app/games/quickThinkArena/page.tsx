"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import allword from "./filtered_valid_words.json";
import { tree } from "next/dist/build/templates/app-page";

export default function page() {
  const sets = new Set(allword);

  const [keyword, setKeyword] = useState("");
  // const [sets, setsets] = useState<any>();
  const [arr, setArr] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sets.has(keyword) && keyword[0] === "a") {
      setArr((prev) => [...prev, keyword]);
      setKeyword("");
    } else {
      console.log("invalid");
    }
  };

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
          <h1 className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ml-4">
            Quick Think Arena
          </h1>
        </div>

        {/* Game Container */}
        <div className="bg-[#1e293b]/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
          {/* Game Instructions */}
          <div className="text-center mb-8 transform transition-all duration-500 ease-in-out">
            <p className="text-gray-300 font-geist-mono mb-2 text-lg">
            Think fast. Type faster. Only real words starting with
              <span className="text-cyan-300 font-bold animate-pulse text-xl "> R </span>count
            </p>
            <p className="text-gray-400 font-geist-mono text-sm">
            You’ve got 60 seconds. Speed and vocabulary are your weapons.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white font-geist-mono text-sm flex items-center gap-2">
                <span>Start Challenge</span>
                <span className="text-lg">⚡</span>
              </span>
            </button>
            <button 
              className="group relative px-6 py-3 bg-transparent border border-purple-500/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/50 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white font-geist-mono text-sm flex items-center gap-2">
                <span>Change Letter</span>
                <span className="text-lg">🔄</span>
              </span>
            </button>
          </div>

          {/* Input Form */}
          <div className="mb-8 transform transition-all duration-500 ease-in-out">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value.toLowerCase())}
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
            </form>
          </div>

          {/* Word List */}
          <div className="bg-[#1e293b]/50 rounded-lg p-6 border border-purple-500/20 transform transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]">
            <h3 className="text-sm text-gray-400 font-geist-mono mb-4">
              Your Words:
            </h3>
            <div className="flex flex-wrap gap-2">
              {arr.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 font-geist-mono text-sm transform transition-all duration-300 hover:scale-105 hover:bg-purple-500/30"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
