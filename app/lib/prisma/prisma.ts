// creating a primsa client instance to use its object into mutating db in neon or whereever

import { PrismaClient } from "@/src/generated/prisma";
import dotenv from 'dotenv'

dotenv.config();

// its an object with globalthis type to store prisma instance
const prismaFromGlobal = globalThis as unknown as {
    prsima : PrismaClient | undefined,
}

// so on every how reload this will create another instanc or new Prismalcient which is heavy and unnecessary so we use globalThis to store its value throughout differetn enviorement
export  const prisma = prismaFromGlobal.prsima ?? new PrismaClient({
    log:['query']
})


if( process.env.NODE_ENV !== 'production' ){
    prismaFromGlobal.prsima = prisma;
}