'use server';

import {prisma} from '../prisma';
import { USER_INTERFACE } from '@/src/interface/dataInterface';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

import dotenv from 'dotenv';

dotenv.config();

// token sigurations 
const tokenSignature = process.env.JWT_SECRET;
// for login
import jwt from 'jsonwebtoken';

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

export const loginUser = async ({username, password}:LoginInterface) => {

  'use server'

  if(!tokenSignature){
    throw new Error('some error in jwt token');
    return ;
  } 

  try {
    // Find user by username
    const user = await prisma.user.findFirst({
      where: { username }
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

    return { user : user.username };

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}



