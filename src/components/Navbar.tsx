'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, sidebarOpen }: NavbarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };
  
  return (
    <div className={`fixed top-0 right-0 w-full bg-white z-50 border-b border-gray-200 ${sidebarOpen ? 'pl-60' : 'pl-0 sm:pl-16'} transition-all duration-300`}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left side with toggle and logo */}
        <div className="flex items-center">
          {/* Sidebar toggle */}
          <button 
            onClick={toggleSidebar}
            className="p-1 mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          
          <Image 
            src="/api-key-logo.svg" 
            alt="API-Key Logo" 
            width={120} 
            height={40} 
            className="h-10 w-auto"
          />
          <span className="ml-2 text-xl font-semibold text-gray-800">API-Key</span>
        </div>
        
        {/* Right side with user menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
          {/* Status indicator */}
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Operational
            </span>
          </div>

          {/* GitHub icon */}
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <div className="text-gray-600 hover:text-gray-900 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
          </Link>

          {/* Twitter icon */}
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <div className="text-gray-600 hover:text-gray-900 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </div>
          </Link>

          {/* Email icon */}
          <Link href="mailto:contact@example.com">
            <div className="text-gray-600 hover:text-gray-900 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </Link>

          {/* Theme toggle */}
          <button className="text-gray-600 hover:text-gray-900 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 