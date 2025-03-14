'use client';

import { ReactNode, useState } from 'react';
import NotificationBanner from './NotificationBanner';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [notification, setNotification] = useState({
    type: 'info' as 'success' | 'warning' | 'info',
    message: '',
    isVisible: false
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NotificationBanner 
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <main className={`pt-14 px-8 pb-8 flex-1 ${sidebarOpen ? 'ml-60' : 'ml-0'} transition-all duration-300`}>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
} 