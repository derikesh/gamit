"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRef } from "react";
import TimerComponent from "./TimerComponent";

export default function KeyType({ word , handlGameEnd}: { word: any , handlGameEnd:(newState:boolean,wpm:number) => void }) {
  const [splited, setSplited] = useState<String[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [ wpm , setWpm ] = useState<number>(0);

  const[ gameStart , setGameStart ] = useState<boolean>(false);

  const charRef = useRef<HTMLSpanElement[][]>([]);
  //   splited words
  useEffect(() => {
    if (word) {
      setSplited(word.split(" "));
    }
  }, [word]);


  //   function to check input
  const checkInput = ({ singleWord }: { singleWord: string }) => {

    setGameStart(true);

    const activCheck = splited[activeIndex].split("");
    const currentInput = singleWord.split("");


    if (singleWord.endsWith(" ") && currentInput.length > 1) {
      setActiveIndex((prev) => prev + 1);
      return;
    }

    // Reset all characters to default color first
    for (let i = 0; i < activCheck.length; i++) {
      if (charRef.current[activeIndex]?.[i]) {
        charRef.current[activeIndex][i].classList.remove(
          "text-lime-200",
          "text-red-500"
        );
        charRef.current[activeIndex][i].classList.add("text-gray-300");
      }
    }

    // Then check and color current input
    for (let i = 0; i < currentInput.length; i++) {
      if (activCheck[i] === currentInput[i]) {
        if (charRef.current[activeIndex]?.[i]) {
          charRef.current[activeIndex][i].classList.add("text-lime-200");
          setWpm( (prev) => prev + 1 );
        }
      } else {
        if (charRef.current[activeIndex]?.[i]) {
          charRef.current[activeIndex][i].classList.add("text-red-500");
          setWpm((prev) => prev > 0 ? prev - 1 : 0)
        }
      }
    }
  };

  const inputClasses = `
    w-full 
    bg-transparent 
    border-none 
    outline-none 
    text-transparent 
    caret-cyan-600 
    transition-all 
    duration-900 
    ease-in-out
    transform
    translate-x-0
    hover:translate-x-1
`;

  return (
    <>
      <TimerComponent gameStart={gameStart}  setGameStart={setGameStart} endGame={()=>handlGameEnd(true,wpm)} />
      <div
        className={` text-3xl flex gap-x-10 flex-wrap 
            text-gray-300 
            font-mono 
            text-start 
            leading-relaxed 
            overflow-hidden 
            w-full
            transition-all 
            duration-500 
            ease-in-out
            origin-top
            ${activeIndex > 30 ? "h-[230px]" : "h-[150px]"}
        `}
      >
        {splited &&
          splited.map((item, index) => {
            const text = item.split("");

            return (
              <div
                key={index}
                className="single_word  relative w-fit transition-all duration-300 ease-in-out"
              >
                {text.map((char, charIndex) => (
                  <span
                    ref={(el) => {
                      if (!charRef.current[index]) {
                        charRef.current[index] = [];
                      }
                      charRef.current[index][charIndex] = el;
                    }}
                    key={charIndex}
                    className="transition-colors duration-200"
                  >
                    {char}
                  </span>
                ))}

                {/* input div */}
                <div className="absolute top-0 w-full transition-all duration-300 ease-in-out">
                  {activeIndex === index && (
                    <input
                      className={inputClasses}
                      autoFocus
                      
                      onChange={(e) => {
                        checkInput({ singleWord: e.target.value });
                      }}
                      type="text"
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
