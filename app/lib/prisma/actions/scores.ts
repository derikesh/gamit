'use server';

import {prisma} from '../prisma';
import dotenv from 'dotenv';

dotenv.config();

interface SCORE_INTERFACE {
    gameId:number,
    userId:number,
    score:number
}


// get all the ranks
export const getGameData = async ()=>{
        try{
            const allGames = await prisma.game.findMany({
                include:{
                    leaderBoard:{
                        orderBy:{
                            score:'desc'
                        },
                        include:{
                            user:{
                                select:{
                                    username:true,
                                    avatar:true
                                }
                            }
                        }
                    }
                }
            });
            return { messsage:'Retrived Game data' , data :allGames }
        }catch(err){
                console.error(`Error fetching scores`)
                throw err
        }

}



// update score of each player
export const calculateScores = async ({gameId,userId,score}:SCORE_INTERFACE)=>{

           try {
            const genScore = await prisma.score.create({
                data:{
                    score,
                    gameId,
                    userId
                }
            });

            return { message:'score updated',score:genScore.score }

           }catch(err){
            console.error(`error in scoreupdate : ${err}`)
            throw err;
           }

}