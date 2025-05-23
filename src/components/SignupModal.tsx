'use client';

import React, { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const avatars = [
  'https://picsum.photos/seed/player1/200',
  'https://picsum.photos/seed/player2/200',
  'https://picsum.photos/seed/player3/200',
  'https://picsum.photos/seed/player4/200',
  'https://picsum.photos/seed/player5/200',
];

const MAX_USERNAME_LENGTH = 10;
const MIN_USERNAME_LENGTH = 3;

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: avatars[0]
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div onClick={onClose} className={`fixed inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 w-full max-w-4xl mx-4 relative transform transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-20 opacity-0'} shadow-2xl border border-white/10`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-3xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400">
            Create Account
          </h2>
          <p className="text-gray-400 font-geist-mono text-sm mt-2">
            Join the word game community
          </p>
        </div>

        {/* Form */}
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
                  onClick={() => setFormData({ ...formData, avatar })}
                  className={`w-15 h-15 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    formData.avatar === avatar
                      ? 'border-cyan-400 ring-4 ring-cyan-400/20'
                      : 'border-transparent hover:border-purple-500/50'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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
                Password
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
                required
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
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 font-geist-mono">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full group relative px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-sm font-medium">
              Create Account
            </span>
          </button>
        </form>
      </div>
    </div>
  );
} 