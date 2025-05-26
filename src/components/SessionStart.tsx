'use client'

import { useEffect } from "react";
import { gameitStore } from "../store/store";


export function SessionStart( {user}:{user:any} ){

    const setUser = gameitStore( (s) => s.setUser );

    useEffect( ()=>{

        if(user){
            setUser(user);
        }

    } , [])
    

    return(
        <></>
    )

}