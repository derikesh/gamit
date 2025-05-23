'use client'

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useState } from "react";

export default function NavHeader() {


  const [open, setOpen] = useState(false);
  const [openSign, setOpenSign] = useState(false);



  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-5xl press font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Gameit
        </h1>
        <p className="text-xl text-cyan-300/90 font-geist-mono tracking-wide">
          • Outsmart stranger • Own the board • Flex your flair
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-4">

        <button
        onClick={ ()=>setOpenSign(true) }
        className="group hover:cursor-pointer relative px-6 py-2.5 bg-transparent border border-purple-500/20 hover:border-purple-500/50 rounded-lg overflow-hidden transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group hover:cursor-pointer-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-sm">Login</span>
          </button>
          
          <button
        onClick={ ()=>setOpen(true) }
          
          className="group hover:cursor-pointer relative px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-sm">Create User</span>
          </button>

         
         
        </div>
        <p className="text-xs text-gray-400 font-geist-mono">
          Quick setup, no personal data required
        </p>
      </div>

      <SignupModal isOpen={open} onClose={()=>{setOpen(false)}} />
      <LoginModal signUp={()=>setOpen(true)} isOpen={openSign} onClose={()=>setOpenSign(false)} />

    </div>
  );
}
