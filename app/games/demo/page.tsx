'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DemoGame() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#ffffff');

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'];

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const handleReset = () => {
    setCount(0);
    setColor('#ffffff');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset Game
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">Demo Game</h1>
        
        <div 
          className="p-8 rounded-lg shadow-lg text-center transition-colors duration-300"
          style={{ backgroundColor: color }}
        >
          <p className="text-4xl font-bold mb-4">Count: {count}</p>
          <button
            onClick={handleIncrement}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Click Me!
          </button>
        </div>
      </div>
    </div>
  );
} 