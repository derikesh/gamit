'use server';

import {prisma} from '../prisma';
import { USER_INTERFACE } from '@/src/interface/dataInterface';

export const createUser = async ({username, email, password, avatar}: USER_INTERFACE) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email: email || undefined,
        password,
        avatar: avatar || 1
      }
    });

    return newUser;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}
