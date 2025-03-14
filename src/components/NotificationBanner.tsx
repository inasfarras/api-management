'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface NotificationBannerProps {
  type: 'success' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function NotificationBanner({ 
  type = 'info', 
  message, 
  isVisible, 
  onClose,
  autoHideDuration = 5000 
}: NotificationBannerProps) {
  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 mr-2" />;
      case 'warning':
        return <XCircleIcon className="h-5 w-5 mr-2" />;
      default:
        return <span className="mr-2">📢</span>;
    }
  };

  return (
    <div className={`${getBgColor()} text-white py-2 px-4 flex items-center justify-center relative shadow-md`}>
      <div className="flex items-center">
        {getIcon()}
        <p>{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="absolute right-4 text-white hover:text-gray-200"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
} 