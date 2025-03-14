'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { HomeIcon, UserIcon, CogIcon, CreditCardIcon, BeakerIcon, DocumentTextIcon, CommandLineIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: HomeIcon },
    { name: 'My Account', href: '/account', icon: UserIcon, hasDropdown: true, dropdownItems: [
      { name: 'Settings', href: '/settings', icon: CogIcon },
      { name: 'Plan', href: '/plan', icon: CreditCardIcon },
      { name: 'Billing', href: '/billing', icon: CreditCardIcon },
    ]},
    { name: 'Research Assistant', href: '/research-assistant', icon: BeakerIcon },
    { name: 'Research Reports', href: '/research-reports', icon: DocumentTextIcon },
    { name: 'API Playground', href: '/api-playground', icon: CommandLineIcon },
    { name: 'Documentation', href: '/documentation', icon: DocumentIcon, isExternal: true },
  ];

  const accountMenuOpen = pathname.startsWith('/account') || 
                          pathname === '/settings' || 
                          pathname === '/plan' || 
                          pathname === '/billing';

  return (
    <div className={`${isOpen ? 'w-60' : 'w-0 sm:w-16'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
      {/* Logo and account selector */}
      <div className={`p-4 border-b border-gray-200 ${!isOpen && 'sm:flex sm:justify-center'}`}>
        <div className={`flex items-center mb-4 ${!isOpen && 'sm:justify-center'}`}>
          <Image 
            src="/api-key-logo.svg" 
            alt="API-Key Logo" 
            width={80} 
            height={80} 
            className={`h-10 w-auto ${!isOpen && 'sm:mx-auto'}`}
          />
          <span className={`ml-2 text-xl font-semibold text-gray-800 ${!isOpen && 'sm:hidden'}`}>API-Key</span>
        </div>
        <div className={`relative ${!isOpen && 'sm:hidden'}`}>
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            <span>Personal</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 p-4 space-y-1 ${!isOpen && 'sm:p-2'}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                        (item.hasDropdown && accountMenuOpen);
          const Icon = item.icon;
          
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${!isOpen && 'sm:justify-center sm:px-2'} ${
                  isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                }`}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
              >
                <Icon className={`${isOpen ? 'mr-3' : 'sm:mr-0'} h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {isOpen && (
                  <>
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {item.isExternal && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </>
                )}
              </Link>
              
              {isOpen && item.hasDropdown && accountMenuOpen && item.dropdownItems && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.dropdownItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = pathname === subItem.href;
                    
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
                          isSubActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <SubIcon className={`mr-3 h-5 w-5 ${isSubActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User profile */}
      <div className={`p-4 border-t border-gray-200 ${!isOpen && 'sm:hidden'}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">
              I
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Inas Farras</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 