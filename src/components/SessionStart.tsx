'use client'

import {  useEffect } from "react";
import { gameitStore } from "../store/store";

export function SessionStart( {user}:{user:any} ){

    const { setUser , removeUser } = gameitStore();

    useEffect( ()=>{

        if(user?.expired === true){
            alert('Session Expired, Login in again');
            removeUser();
        }

        if(user){
            setUser(user.user);
        }

    } , [  ])
    

    return(
        <></>
    )

}