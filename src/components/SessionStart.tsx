'use client'

import {  useEffect } from "react";
import { gameitStore } from "../store/store";

export function SessionStart(  ){

    const { setUser , removeUser } = gameitStore();

    // fetch the user
    useEffect( ()=>{

        async function fetchUser(){

           try{

            const res = await fetch('/api/route');
            const data = await res.json();

            if (data.error === 'Token Expired') {
                removeUser();
                alert('Session expired login again')
                return;
            }

            if(data.user){
                setUser(data.user);
            }

           }catch(err){

            console.error('Authentication failed',err);

           }
            
        }

        fetchUser();

    } ,[])

    console.log('this rund');
    



    return null;

}