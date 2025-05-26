'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  modelOPen:boolean
  onClose: () => void;
}

const toastStyles = {
  success: {
    bg: 'bg-gradient-to-r from-green-500/60 to-emerald-500/50',
    border: 'border-green-500/30',
    icon: '🎉',
    text: 'text-green-400'
  },
  error: {
    bg: 'bg-gradient-to-r from-red-500/60 to-rose-500/50',
    border: 'border-red-500/30',
    icon: '❌',
    text: 'text-red-400'
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-500/60 to-cyan-500/50',
    border: 'border-blue-500/30',
    icon: 'ℹ️',
    text: 'text-blue-400'
  }
};

export default function CustomToast({ message, type, isVisible, onClose , modelOPen }: ToastProps) {
  useEffect(() => {
    if (isVisible && modelOPen) {
      const timer = setTimeout(() => {
        onClose();
      }, 1300);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed w-full top-4 right-4 z-50 `}
        >
          <div className={`flex items-center gap-3 w-fit m-auto backdrop-blur-sm border px-6 py-4 rounded-xl  ${toastStyles[type].bg} ${toastStyles[type].border} shadow-lg`}>
            <span className="text-xl">{toastStyles[type].icon}</span>
            <p className={`font-geist-mono text-sm ${toastStyles[type].text}`}>{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 