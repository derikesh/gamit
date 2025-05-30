'use client'

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useState, useEffect } from "react";
import { gameitStore } from "../store/store";
import { userLogout } from "@/app/lib/prisma/actions/userActions";

import { USERDATA_INTERFACE } from "../store/store";

export default function NavHeader() {
  const [open, setOpen] = useState(false);
  const [openSign, setOpenLog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { activeUser, removeUser } = gameitStore();

  const [editProfile, setEditProfile] = useState<USERDATA_INTERFACE | null>(null);

  async function handleLogout(){
    try{
      setIsLoggingOut(true);
      await userLogout();
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      removeUser();
      setShowUserMenu(false);
    }catch(err){
      throw err;
    } finally {
      setIsLoggingOut(false);
    }
  }


    function handleEmail(){
        if(activeUser){
          setEditProfile(activeUser);
          setOpen(true);
        }
    }


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
        <div className="flex gap-4 items-center">
          {activeUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 group hover:cursor-pointer"
              >
                <div className="w-10 h-10 overflow-hidden rounded-full bg-white/80 flex items-center justify-center text-white font-bold">
                  <img src={`/images/avatars/${activeUser.avatar}.png`} className="scale-[1.2] h-full w-full mt-1" alt="" />
                </div>
                <span className="text-white font-geist-mono group-hover:text-purple-300 transition-colors">
                  {activeUser.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute hover:cursor-pointer right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-purple-500/20 rounded-lg shadow-lg overflow-hidden z-50">
                   <button
                        onClick={handleEmail}
                        className="w-full hover:cursor-pointer px-4 py-3 text-left text-white font-geist-mono text-sm hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                        >
                        <span>Edit Profile</span>
                        <span className="text-red-400">+</span>
                  </button> 
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full hover:cursor-pointer px-4 py-3 text-left text-white font-geist-mono text-sm hover:bg-purple-500/20 transition-colors flex items-center gap-2 ${
                      isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    <span className="text-red-400">{isLoggingOut ? '⌛' : '→'}</span>
                  </button>
                        
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setOpenLog(true)}
                className="group hover:cursor-pointer relative px-6 py-2.5 bg-transparent border border-purple-500/20 hover:border-purple-500/50 rounded-lg overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white font-geist-mono text-sm">Login</span>
              </button>
              
              <button
                onClick={() => setOpen(true)}
                className="group hover:cursor-pointer relative px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white font-geist-mono text-sm">Create User</span>
              </button>
            </>
          )}
        </div>
        
        {!activeUser && (
          <p className="text-xs text-gray-400 font-geist-mono">
            Quick setup, no personal data required
          </p>
        )}
      </div>

      <SignupModal isOpen={open} onClose={() => setOpen(false)} logOpen={() => setOpenLog(true)} editProfile={editProfile} />
      <LoginModal signUp={() => setOpen(true)} isOpen={openSign} onClose={() => setOpenLog(false)} />
    </div>
  );
}
