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
    return ;
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
      { expiresIn: '24h' }
    );


    (await cookies()).set( 'gameit_token' , token , {
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24  * 4,
      path:'/',
      sameSite:'lax'
    } )

    return { user : {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
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

    if (!userCookies || !tokenSignature) return null;

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
        score:true
      }
    });

    return user;
  } catch (error) {
    console.error('Current user error:', error);
    return null;
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