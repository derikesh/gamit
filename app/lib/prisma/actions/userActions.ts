'use server';

import {prisma} from '../prisma';
import { USER_INTERFACE } from '@/src/interface/dataInterface';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// token sigurations 
const tokenSignature = process.env.JWT_SECRET;
// for login


// server action for creating a new users
export const createUser = async ({username, email, password, avatar}: USER_INTERFACE) => {

  'use server'

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const exitingName = await prisma.user.findUnique({
      where:{
        username:username
      }
    })

    if(exitingName){
      throw new Error('Username already exists');
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email: email || undefined,
        password: hashedPassword,
        avatar: avatar || 1
      }
    });

    return newUser;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

interface LoginInterface {
  username:string,
  password:string
}



// Server action for login method
export const loginUser = async ({username, password}:LoginInterface) => {

  'use server'

  if(!tokenSignature){
    throw new Error('some error in jwt token');
  } 

  try {
    // Find user by username
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      tokenSignature,
      { expiresIn: '14d' }
    );


    (await cookies()).set( 'gameit_token' , token , {
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24  * 14 ,
      path:'/',
      sameSite:'lax'
    } )

    return { user : {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      champ:user.champ,
      champ2:user.champ2
    } };

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}



// server action to check the user authentication 
export const currentUser = async () => {

  'use server'

  try {
    const userCookies = (await cookies()).get('gameit_token')?.value;

    if (!userCookies || !tokenSignature) throw new Error('No token found');

    const validToken = jwt.verify(userCookies, tokenSignature) as { userId: number };

    if (!validToken?.userId) return null;

    const user = await prisma.user.findFirst({
      where: {
        id: validToken.userId
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        score:true,
        champ:true,
        champ2:true
      }
    });

    return { user:user, expired:false };
  } catch (error:any) {
    if (error.name === 'TokenExpiredError') {
      console.log('JWT Token has expired. Deleting cookie...');
      return { expired: true };
    }else{
      console.error('Current user error:', error);
      return null;
    }

  }
}



// server action for loutout 
export const userLogout = async ()=>{

    'use server'

      try{
        (await cookies()).delete('gameit_token');
        return { success: true, message: 'User logged out' };
      }catch(err){
        console.error(`logout error ${err}`)
        throw err;
      }
}




// add email function 

export const updateUser = async ({ id, username, email, password, avatar }:USER_INTERFACE)=>{

   try {

    const updateData:any = {}

    if(username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const validUser = prisma.user.update({
      where:{id:id},
      data:updateData,
      select:{
        id:true,
        username:true,
        email:true,
        avatar:true,
        score:true,
        champ:true,
        champ2:true
      }
    });

    return { message:'email updated successfully', data : validUser };

   }catch(err){
    console.error(`Error adding email ${err}`);
    throw err;
   }

}


export const checkTop3 = async ( {userId,gameId}:{ userId:number,gameId:number } )=>{

      try {
        
        const gameCheck = await prisma.game.findFirst({
          where:{id:gameId},
          select:{ leaderBoard:{ orderBy:{score:'desc'} , take:3 , select:{ userId:true } }   }
        })

        if (!gameCheck) throw new Error('Game not found');

        let champFirst = false;
        let champTop3 = false;

        if(gameCheck && gameCheck.leaderBoard[0].userId === userId){
          champFirst = true;
          champTop3 = true;
        }else if( gameCheck?.leaderBoard.some( (item) => item.userId === userId ) ){
          champTop3 = true
        }

        const userFirst = await prisma.user.update({
          where:{ id:userId },
          data:{ champ2:champFirst , champ:champTop3 },
          select:{ champ:true , champ2:true }
        })


        return { message:'User scoer update', user:userFirst }

      }catch(err){
        console.log('Error in Checking top 3',err)
        throw err;
      }

}