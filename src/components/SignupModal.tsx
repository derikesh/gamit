'use client';

import React, { useEffect, useState } from 'react';
import { createUser } from '../../app/lib/prisma/actions/userActions';
import CustomToast from './CustomToast';
import { motion, AnimatePresence } from 'framer-motion';

import { USERDATA_INTERFACE } from '../store/store';

import { checkBadWord } from '../varibles/badWords';

import { updateUser } from '../../app/lib/prisma/actions/userActions';

import { gameitStore } from '../store/store';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  logOpen : ()=>void;
  editProfile:USERDATA_INTERFACE | null
}

const avatars = [1,2,3,4,5,6,7,8,9,10];

const MAX_USERNAME_LENGTH = 15;
const MIN_USERNAME_LENGTH = 3;

export default function SignupModal({ isOpen, onClose, logOpen , editProfile=null }: SignupModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: 1
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  const { activeUser, setTempCredentials } =  gameitStore();


  // to update the form 
  useEffect(() => {
    if (editProfile) {
      setFormData({
        username: editProfile.username || '',
        email: editProfile.email || '',
        password: '',
        confirmPassword: '',
        avatar: editProfile.avatar || 1
      });
    }
  }, [editProfile]);
  
  const validateEmail = (email: string) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (formData.username.length < MIN_USERNAME_LENGTH) {
      newErrors.username = `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
    } else if (formData.username.length > MAX_USERNAME_LENGTH) {
      newErrors.username = `Username must be at most ${MAX_USERNAME_LENGTH} characters`;
    }else if( !checkBadWord(formData.username) ){
      newErrors.username = `Username failed try another`
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

   if(!editProfile){
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
   }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const avatarIndex = avatars.indexOf(formData.avatar) + 1;
        let result :any
        if(editProfile){
           result = await updateUser({
            id:activeUser?.id,
            username: formData.username,
            email: formData.email || undefined,
            password: formData?.password,
            avatar: avatarIndex
          })
        }else{
           result = await createUser({
            username: formData.username,
            email: formData.email || undefined,
            password: formData.password,
            avatar: avatarIndex
          });
        }

        if (result) {
          // Save credentials for login
          setTempCredentials({
            username: formData.username,
            password: formData.password
          });

          setToast({
            isVisible: true,
            message: editProfile ? 'Profile updated successfully!' : 'Account created successfully! Welcome to Gameit 🎮',
            type: 'success'
          });

         setTimeout(() => {
            onClose();
            editProfile ?? logOpen();
            setFormData({
              username:'',
              avatar:1,
              confirmPassword:'',
              email:'',
              password:''
            });
          }, 1500);
        }
      } catch (error: any) {
        console.error('Error creating user:', error);
        setToast({
          isVisible: true,
          message: error.message || 'Failed to create account. Please try again.',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAvatarClick = (avatar: number) => {
    if (avatar >= 6) {
      setToast({
        isVisible: true,
        message: 'Achieve #1 rank in any game to unlock this premium avatar!',
        type: 'info'
      });
      return;
    }
    setFormData({ ...formData, avatar });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            onClick={e => e.stopPropagation()}
            className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-fit relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white font-geist-mono">
                { editProfile ? 'Edit Profile' : 'Create Your Account' } 
              </h2>
              { !editProfile &&
                <p className="text-gray-400 font-geist-mono text-sm mt-2">
                Join the word game community
              </p>
              }
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Selection */}
              <div className="flex flex-col items-center gap-4">
                <label className="text-sm font-geist-mono text-gray-300 bg-white/5 px-4 py-2 rounded-full">
                  Choose Your Avatar
                </label>
                <div className="flex gap-4">
                  {avatars.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAvatarClick(avatar)}
                      className={`w-15 h-15 bg-slate-200 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        formData.avatar === avatar
                          ? 'border-cyan-400 ring-4 ring-cyan-400/20'
                          : 'border-transparent'
                      } ${avatar >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      // disabled={avatar >= 6}
                    >
                      <div className="relative">
                        <img
                          src={`/images/avatars/${avatar}.png`}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover mt-1 scale-[1.2]"
                        />
                        {avatar >= 6 && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full">
                            <span className="text-white text-xl">🔒</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-geist-mono text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.username ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20`}
                    placeholder={`${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters`}
                    required
                  />
                  {errors.username && (
                    <p className="text-sm text-red-400 font-geist-mono">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-geist-mono text-gray-300">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.email ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20`}
                    placeholder="Enter your email"
                  />
                  <p className="text-sm text-gray-400 font-geist-mono">
                    Get notified when someone beats your score
                  </p>
                  {errors.email && (
                    <p className="text-sm text-red-400 font-geist-mono">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-geist-mono text-gray-300">
                    { editProfile ? 'New' : '' } Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.password ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20`}
                    placeholder="Create a password"
                    required={!editProfile}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400 font-geist-mono">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-geist-mono text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20`}
                    placeholder="Confirm your password"
                    required={!editProfile}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400 font-geist-mono">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full hover:cursor-pointer group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:scale-[1.02] ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white font-geist-mono text-sm font-medium">
                  {isLoading ? editProfile ? 'Updataing Account...' : 'Creating Account...' : editProfile ? 'Update Accoundt' : 'Create Account'}
                </span>
              </button>
            </form>
          </motion.div>

          <CustomToast
            modelOPen = {isOpen}
            isVisible={toast.isVisible}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 