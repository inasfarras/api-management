'use client';

import { QuestionMarkCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function UsageStats() {
  return (
    <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="p-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full mb-2">
            CURRENT PLAN
          </span>
          <h1 className="text-4xl font-bold text-white">Researcher</h1>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-white font-medium">API Usage</span>
            <button className="ml-2 text-white/80 hover:text-white" title="Learn more about API usage">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-2">
            <span className="text-white font-medium">Plan</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-1">
            <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <div className="flex justify-end">
            <span className="text-white text-sm">0 / 1,000 Credits</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input 
              type="checkbox" 
              id="payAsYouGo" 
              className="sr-only" 
              defaultChecked 
            />
            <div className="h-5 w-10 bg-white rounded-full p-1 flex">
              <div className="h-3 w-3 rounded-full bg-purple-500 transform translate-x-5"></div>
            </div>
          </div>
          <span className="text-white flex items-center ml-2">
            Pay as you go
            <QuestionMarkCircleIcon className="h-4 w-4 ml-2 text-white/80" />
          </span>
        </div>
      </div>
      
      <div className="bg-white/10 px-6 py-3 flex justify-end">
        <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-white/90 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Manage Plan
        </button>
      </div>
    </div>
  );
} 