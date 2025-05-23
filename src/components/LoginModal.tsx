'use client';

import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  signUp:()=>void;
}

export default function LoginModal({ isOpen, onClose , signUp }: LoginModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div onClick={onClose} className={`fixed inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 w-full max-w-sm mx-4 relative transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-20 opacity-0'} shadow-2xl border border-white/10`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400">
            Welcome Back!
          </h2>
          <p className="text-gray-400 font-geist-mono text-sm mt-1">
            Quick setup, no personal data required
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-geist-mono text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-white/5 border ${
                errors.username ? 'border-red-500/50' : 'border-white/10'
              } rounded-xl text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="Enter your username"
              required
            />
            {errors.username && (
              <p className="text-sm text-red-400 font-geist-mono">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-geist-mono text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-white/5 border ${
                errors.password ? 'border-red-500/50' : 'border-white/10'
              } rounded-xl text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all duration-300 focus:ring-2 focus:ring-cyan-400/20`}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <p className="text-sm text-red-400 font-geist-mono">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-sm font-medium">
              Sign In
            </span>
          </button>

          <p className="text-center text-sm text-gray-400 font-geist-mono">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-cyan-400 hover:text-cyan-300 transition-colors hover:cursor-pointer"
              onClick={() => {
                onClose();
                signUp(); 
              }}
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
} 