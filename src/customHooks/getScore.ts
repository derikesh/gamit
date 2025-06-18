'use client'

import { useState, useEffect } from "react";
import { gameitStore } from "../store/store";
import { getUserScore } from "@/app/lib/prisma/actions/scores";

// hook for getting user initial score 
export function useGetScore(gameId: number) {
    // global state user
    const { activeUser } = gameitStore();
    const [userHigheScore, setUserHigheScore] = useState<number>(0);

    // get the user score 
    useEffect(() => {
        const fnc = async () => {
            if (!activeUser?.id) return;
            try {
                const res = await getUserScore({ userId: activeUser?.id, gameId });
                if (res) {
                    setUserHigheScore(res.score);
                }
            } catch (err) {
                console.log('Error in fetching user score', err);
            }
        }
        fnc();
    }, [activeUser?.id, gameId]);


    return { userHigheScore, setUserHigheScore };
}

// hook to update the score in table