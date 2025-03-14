'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="https://github.com" className="text-sm text-gray-500 hover:text-gray-700">
            Github
          </Link>
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
            Terms of use
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
            Contact
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          © {currentYear} MTLIK.com. All Rights Reserved.
        </div>
      </div>
    </div>
  );
} 