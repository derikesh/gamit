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
                                    avatar:true,
                                    score:true,
                                    id:true
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



// fetching game score out of id 

export const gameIdScore = async ( {gameId}:{gameId:number} )=>{

    try{

        const gameFound = await prisma.game.findFirst({
            where:{
                id:Number(gameId),
            },
            include:{
                leaderBoard:{
                    orderBy:{
                        score:'desc'
                    },
                    include:{
                        user:{
                            select:{
                                avatar:true,
                                username:true,
                                score:true
                            }
                        }
                    }
                },

            }           
            // select:{
            //     leaderBoard:true
            // },
            
        })

        return { message:'Data found' , data :gameFound }

    }catch(err){
        console.log('Game score Fetch Error',err);
    }

}



// update new high score

interface NewHighScore {
    userId:number,
    newScore:number,
    gameId:number
}

export const newHighScore = async ( { userId, newScore ,gameId}:NewHighScore )=>{
            
        try{

            const userUpdate = await prisma.score.update({
                where:{
                    id:gameId,
                    userId,
                },data:{
                    score:newScore
                },
                select:{
                    score:true
                }
            })

            return { message:'Scored Updated Successfully ',data:userUpdate }

        }catch(err){
            console.log('Error Updateing Score : ',err);
            throw err;
        }

}

export async function getUserScore({ userId, gameId }: { userId: number; gameId: number }) {
  try {
    const userScore = await prisma.score.findFirst({
      where: {
        userId: userId,
        gameId: gameId
      },
      select: {
        score: true
      }
    });

    return { 
      success: true, 
      score: userScore?.score || 0 
    };
  } catch (error) {
    console.error('Error fetching user score:', error);
    return { 
      success: false, 
      score: 0,
      error: 'Failed to fetch user score' 
    };
  }
}

export async function updateUserHighScore({ userId, gameId, newScore }: { userId: number; gameId: number; newScore: number }) {
  try {
    // First check if a score record exists
    const existingScore = await prisma.score.findFirst({
      where: {
        userId: userId,
        gameId: gameId
      }
    });

    if (existingScore) {
      // Update existing score if new score is higher
      if (newScore > existingScore.score) {
        const updatedScore = await prisma.score.update({
          where: {
            id: existingScore.id
          },
          data: {
            score: newScore
          }
        });
        return { success: true, score: updatedScore.score };
      }
      return { success: true, score: existingScore.score };
    } else {
      // Create new score record
      const newScoreRecord = await prisma.score.create({
        data: {
          userId: userId,
          gameId: gameId,
          score: newScore
        }
      });
      return { success: true, score: newScoreRecord.score };
    }
  } catch (error) {
    console.error('Error updating high score:', error);
    return { success: false, error: 'Failed to update high score' };
  }
}