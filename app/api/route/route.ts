import { TokenExpiredError } from "jsonwebtoken";
import { currentUser } from "../../lib/prisma/actions/userActions";
import { cookies } from "next/headers";


export async function GET(){

    try{
        const data = await currentUser();

        if(!data){
            return Response.json({error:'Authtication fialed'})
        }

        return Response.json({user:data.user});
    }catch(err:any){
         if(err instanceof TokenExpiredError){
            (await cookies()).delete('gameit_token');
            return Response.json({error:'Token Expired'});
         }else{
            return Response.json({ error: 'Authentication failed in route' });
         }
         
    }
}