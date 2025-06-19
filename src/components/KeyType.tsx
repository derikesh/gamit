"use client";

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import TimerComponent from "./TimerComponent";
import { useGameStore } from "@/src/store/gameStore";

export default function KeyType({
  word,
  handlGameEnd,
}: {
  word: any;
  handlGameEnd: (newState: boolean) => void;
}) {
  const [splited, setSplited] = useState<String[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [gameStart, setGameStart] = useState<boolean>(false);

  const { incrementWpm, setRestart, restart , wpm , resetWpm } = useGameStore();

  const charRef = useRef<HTMLSpanElement[][]>([]);
  const inputRef = useRef<any[]>([]);
  const caretRef = useRef<HTMLDivElement | null>(null);





  // tab to restart the game
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Tab" && caretRef.current) {
        event.preventDefault();
        setGameStart(false);
        setRestart();
        setActiveIndex(0);
        resetWpm();
        caretRef.current.style.transform = `translate(${0}px,0px)`

        if (inputRef.current) {
          inputRef.current.forEach((input) => {
            if (input) input.value = "";
          });

          inputRef.current[0]?.focus();
        }
        // Reset all characters to gray
        charRef.current.forEach((word) => {
          word.forEach((char) => {
            char?.classList.remove("text-red-500", "text-white");
            char?.classList.add("text-white/40");
          });
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [restart]);

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

    // const targetSpan = charRef.current[activeIndex]?.[currentInput.length]; 
   
    const targetSpan = charRef.current[activeIndex]?.[currentInput.length-1];

      if (targetSpan && caretRef.current) {
      const rect = targetSpan.getBoundingClientRect();
      const containerRect = targetSpan.offsetParent?.getBoundingClientRect();

      const left = rect.right - (containerRect?.left || 0);

      caretRef.current.style.transform = `translate(${left}px,0px)`;

      if(currentInput.length == 0 && caretRef.current){
        caretRef.current.style.transform = `translate(${containerRect?.left}px,0px)`
      }

      }

    if (singleWord.endsWith(" ") && currentInput.length > 1) {
      setActiveIndex((prev) => prev + 1);
      for (let i = 0; i < activCheck.length; i++) {
        if (activCheck[i] == currentInput[i]) {
          incrementWpm();
        }
      }
      return;
    }

    // Reset all characters to default color first
    for (let i = 0; i < activCheck.length; i++) {
      if (charRef.current[activeIndex]?.[i]) {
        charRef.current[activeIndex][i].classList.remove(
          "text-white",
          "text-red-500"
        );
        charRef.current[activeIndex][i].classList.add("text-white/40");
      }
    }



    // Then check and color current input
    for (let i = 0; i < currentInput.length; i++) {
      if (activCheck[i] === currentInput[i] ) {
        if (charRef.current[activeIndex]?.[i]) {
          charRef.current[activeIndex][i].classList.add("text-white");
          charRef.current[activeIndex][i].classList.remove("text-white/40");
        }
      } else {
        if (charRef.current[activeIndex]?.[i]) {
          charRef.current[activeIndex][i].classList.add("text-red-500");
          charRef.current[activeIndex][i].classList.remove("text-white/40");
        }
      }
    }
  };


  const gameEnd = (val: boolean) => {
    setGameStart(val);

  };


  useEffect( ()=>{
    console.log(wpm)
  } ,[wpm])

  return (
    <>
      <TimerComponent
        gameStart={gameStart}
        setGameStart={gameEnd}
        endGame={() => handlGameEnd(true)}
      />
      <div
        className={` text-3xl flex gap-x-10 flex-wrap 
            text-white/40 
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
                className="single_word  relative w-fit transition-all duration-100 ease-in-out"
              >
                {activeIndex == index && (
                  <div
                    ref={caretRef}
                    className="absolute h-[2rem] w-[2px] bg-cyan-500 top-1 transition-transform duration-150 ease-in-out"
                    style={{ transform: "translate(0px, 0px)" }}
                  />
                )}

                {text.map((char, charIndex) => (
                  <span
                    ref={(el) => {
                      if (el) {
                        if (!charRef.current[index]) {
                          charRef.current[index] = [];
                        }
                        charRef.current[index][charIndex] = el;
                      }
                    }}
                    key={charIndex}
                    className="transition-colors duration-100 text-white/40"
                  >
                    {char}
                  </span>
                ))}

                {/* input div */}
                <div className="absolute top-0 w-full transition-all duration-300 ease-in-out">
                  {activeIndex === index && (
                    <input
                      className={` w-full bg-transparent border-none outline-none text-transparent caret-none transition-all duration-900 ease-in-out transform translate-x-0 hover:translate-x-1`}
                      autoFocus
                      max={splited[activeIndex].length}
                      onChange={(e: any) => {
                        checkInput({ singleWord: e.target.value });
                      }}
                      ref={(el) => {
                        if (inputRef.current) {
                          inputRef.current[activeIndex] = el;
                        }
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
