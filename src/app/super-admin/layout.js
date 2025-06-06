'use client';

import React from 'react';
import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminTopbar from '@/components/SuperAdminTopbar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css'; // Ensure global styles are imported

export default function SuperAdminLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-64"> {/* Adjust ml to match sidebar width */}
          <SuperAdminTopbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
            {children}
            <ToastContainer 
              position="bottom-right" 
              autoClose={3000} 
              hideProgressBar={false} 
              newestOnTop={false} 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover 
              theme="colored"
            />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
