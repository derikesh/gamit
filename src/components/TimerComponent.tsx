import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/src/store/gameStore'

interface TIMER_INTERFACE {
    gameStart: boolean,
    setGameStart: () => void;
    endGame: () => void
}

export default function TimerComponent({ gameStart, setGameStart, endGame }: TIMER_INTERFACE) {
    const [time, setTime] = useState<number>(8);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!gameStart) return;

        timerRef.current = setInterval(() => {
            setTime((prev) => {
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameStart]);

    useEffect(() => {
        if (time <= 0 && gameStart) {
            setGameStart();
            endGame();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [time, gameStart]);


    return (
        <>
            <p className="text-purple-400 mb-4 text-xl">
                {gameStart ? time : 'Start Typing'} 
                <span className=" text-gray-500 ml-2 font-light ">
                    {!gameStart && '( Press Tab to Restart )'}
                </span>
            </p>
        </>
    )
}
