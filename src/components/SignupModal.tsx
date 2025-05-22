'use client';

import React, { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup submission
    console.log(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e293b] rounded-xl p-8 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-press font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Create Account
          </h2>
          <p className="text-gray-400 font-geist-mono text-sm mt-2">
            Join the word game community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-geist-mono text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-[#1e293b]/50 border border-purple-500/20 rounded-lg text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-geist-mono text-gray-300 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#1e293b]/50 border border-purple-500/20 rounded-lg text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-geist-mono text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-[#1e293b]/50 border border-purple-500/20 rounded-lg text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-geist-mono text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-[#1e293b]/50 border border-purple-500/20 rounded-lg text-white font-geist-mono placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white font-geist-mono text-sm">
              Create Account
            </span>
          </button>
        </form>
      </div>
    </div>
  );
} 