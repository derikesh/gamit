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

const updateScoreHook  = ( {userHighScore , gameId , newScore,finishGame}:UpdateScoreProps )=>{


    const [ isSuccess , setIsSuccess ] = useState(<boolean>(false));
    const [ isSuccessChamp , setIsSuccessChamp ] = useState(<boolean>(false));

    const { activeUser , setUser} = gameitStore();

    useEffect(() => {
        
        async function handleHighScore() {

            if(!activeUser?.id) return;

            try {
              const result = await updateUserHighScore({
                userId: activeUser?.id,
                gameId: gameId,
                newScore: newScore
              });
      
              if (result.success) {

                setIsSuccess(true);

                // setUserHigheScore(Number(result.score));
                // setToast({
                //   isVisible: true,
                //   message: 'New High Score!',
                //   type: 'success'
                // });
                // setShowConfetti(true);
                // setTimeout(() => setShowConfetti(false), 5000);
      
                // Check if user is top 3 or top 1 and update champ flags
                if( !activeUser.champ || !activeUser.champ2 ){
                   try {
                    const champStatus = await checkTop3({
                      userId: activeUser.id,
                      gameId: gameId
                    });
      
        
                    if( champStatus.user.champ2 || champStatus.user.champ ){
                        // setToast({
                        //   type:'info',
                        //   message:'New Avatar Unlocked',
                        //   isVisible:true
                        // });
                        setIsSuccessChamp(true);
                        setUser( {...activeUser , champ:champStatus.user.champ , champ2:champStatus.user.champ2} )
                    }
        
                  } catch (err) {
                    console.error('Error checking top 3:', err);
                    throw err;
                  }
                }
              }
      
            } catch (error) {
              console.error('Error updating high score:', error);
            //   setToast({
            //     isVisible: t}
            //     ailed to update high score',
            //     type: 'error'
            //   });
            }
        }
        
        if (finishGame && newScore > userHighScore) {
            handleHighScore();
        }

      }, [finishGame, userHighScore, activeUser?.id, gameId]);

    return { isSuccess , isSuccessChamp }

}

export default updateScoreHook;