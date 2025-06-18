'use client'

import { useEffect, useState } from "react";
import { gameitStore } from "../store/store";
import { updateUserHighScore } from "@/app/lib/prisma/actions/scores";
import { checkTop3 } from "@/app/lib/prisma/actions/userActions";

interface UpdateScoreProps {
    userHighScore: number;
    gameId: number;
    newScore: number;
    finishGame: boolean;
}

export function useUpdateScore({ userHighScore, gameId, newScore, finishGame }: UpdateScoreProps) {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isSuccessChamp, setIsSuccessChamp] = useState<boolean>(false);
    const { activeUser, setUser } = gameitStore();

    useEffect(() => {
        async function handleHighScore() {
            if (!activeUser?.id) return;

            try {
                const result = await updateUserHighScore({
                    userId: activeUser?.id,
                    gameId: gameId,
                    newScore: newScore
                });

                if (result.success) {
                    setIsSuccess(true);

                    // Check if user is top 3 or top 1 and update champ flags
                    if (!activeUser.champ || !activeUser.champ2) {
                        try {
                            const champStatus = await checkTop3({
                                userId: activeUser.id,
                                gameId: gameId
                            });

                            if (champStatus.user.champ2 || champStatus.user.champ) {
                                setIsSuccessChamp(true);
                                setUser({ ...activeUser, champ: champStatus.user.champ, champ2: champStatus.user.champ2 });
                            }else{
                              setIsSuccessChamp(false);
                            }
                        } catch (err) {
                            console.error('Error checking top 3:', err);
                            throw err;
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating high score:', error);
            }
        }

        console.log('before compare',userHighScore);

        if (finishGame && newScore > userHighScore) {
            handleHighScore();
        }else{
          setIsSuccess(false);
        }

        console.log( 'new score : ',newScore );
        console.log( 'user sscore : ',userHighScore );


    }, [finishGame, userHighScore, activeUser?.id, gameId, newScore, setUser]);

    return { isSuccess, isSuccessChamp };
}