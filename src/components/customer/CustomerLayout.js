// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useDashboard } from '../../contexts/DashboardContext';
// import Container from '../ui/Container';

// // Admin navigation items
// const navigationItems = [
//   { name: 'Dashboard', href: '/customers', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//   { name: 'Services', href: '/customers/services', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
//   { name: 'Appointments', href: '/customers/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
//   { name: 'Estimates', href: '/customers/estimates', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
//   // { name: 'Customers', href: '/customers/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
//   // { name: 'Settings', href: '/customers/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
// ];

// const CustomerLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const pathname = usePathname();

//   const { userData } = useDashboard();

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar for desktop */}
//       <div className="hidden md:flex md:flex-shrink-0">
//         <div className="flex flex-col w-64">
//           <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
//             <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-600">
//               <Link href="/admin" className="text-lg font-semibold text-white">
//                 Gildardo Rochins
//               </Link>
//             </div>
//             <div className="flex-1 flex flex-col overflow-y-auto">
//               <nav className="flex-1 px-2 py-4 space-y-1">
//                 {navigationItems.map((item) => {
//                   const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
//                   return (
//                     <Link
//                       key={item.name}
//                       href={item.href}
//                       className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
//                         isActive
//                           ? 'bg-green-100 text-green-700'
//                           : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                       }`}
//                     >
//                       <svg
//                         className={`mr-3 flex-shrink-0 h-6 w-6 ${
//                           isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
//                         }`}
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         aria-hidden="true"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
//                       </svg>
//                       {item.name}
//                     </Link>
//                   );
//                 })}
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile sidebar */}
//       <div
//         className={`${
//           sidebarOpen ? 'block' : 'hidden'
//         } fixed inset-0 flex z-40 md:hidden`}
//         role="dialog"
//         aria-modal="true"
//       >
//         <div
//           className="fixed inset-0 bg-gray-600 bg-opacity-75"
//           aria-hidden="true"
//           onClick={() => setSidebarOpen(false)}
//         ></div>

//         <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
//           <div className="absolute top-0 right-0 -mr-12 pt-2">
//             <button
//               type="button"
//               className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <span className="sr-only">Close sidebar</span>
//               <svg
//                 className="h-6 w-6 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
//             <div className="flex-shrink-0 flex items-center px-4">
//               <span className="text-lg font-semibold text-green-600">Gildardo Rochins</span>
//             </div>
//             <nav className="mt-5 px-2 space-y-1">
//               {navigationItems.map((item) => {
//                 const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
//                 return (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
//                       isActive
//                         ? 'bg-green-100 text-green-700'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <svg
//                       className={`mr-4 flex-shrink-0 h-6 w-6 ${
//                         isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
//                       }`}
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
//                     </svg>
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>
//           <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
//             <div className="flex-shrink-0 group block">
//               <div className="flex items-center">
//                 <div>
//                   <div className="inline-block h-9 w-9 rounded-full bg-gray-300 text-center flex items-center justify-center">
//                     <span className="text-xl text-white font-medium">
//                       {userData?.name?.charAt(0) || 'A'}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
//                     {userData?.name || 'Admin User'}
//                   </p>
//                   <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
//                     View profile
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex flex-col w-0 flex-1 overflow-hidden">
//         <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:hidden">
//           <button
//             type="button"
//             className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 md:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <span className="sr-only">Open sidebar</span>
//             <svg
//               className="h-6 w-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <div className="flex-1 px-4 flex justify-center">
//             <div className="flex-1 flex items-center justify-center">
//               <h1 className="text-lg font-semibold text-green-600">Gildardo Rochins</h1>
//             </div>
//           </div>
//         </div>

//         <main className="flex-1 relative overflow-y-auto focus:outline-none">
//           <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//               {children}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CustomerLayout; 





'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboard } from '../../contexts/DashboardContext';
import Container from '../ui/Container';
import Button from '../ui/Button';

// Admin navigation items
const navigationItems = [
  { name: 'Dashboard', href: '/customers', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Services', href: '/customers/services', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { name: 'Appointments', href: '/customers/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Estimates', href: '/customers/estimates', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  // { name: 'Customers', href: '/admin/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  // { name: 'Settings', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { userData, logout } = useDashboard();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-600">
              <Link href="/" className="text-lg font-semibold text-white">
              Gildardo Rochin
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <svg
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              {/* Logout button at bottom */}
              <div className="p-4 border-t border-gray-200">
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } fixed inset-0 flex z-40 md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-lg font-semibold text-green-600">Gildardo Rochin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg
                      className={`mr-4 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            {/* Logout button at bottom for mobile */}
            <div className="mt-4 px-2">
              <Button 
                onClick={handleLogout}
                className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-center">
            <h1 className="text-lg font-semibold text-green-600">Gildardo Rochin</h1>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 