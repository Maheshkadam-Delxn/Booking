'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, BarChart3, LifeBuoy } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/super-admin/tenants', label: 'Tenant Management', icon: Users },
  { href: '/super-admin/billing', label: 'Billing', icon: FileText },
  { href: '/super-admin/activity-logs', label: 'Activity Logs', icon: BarChart3 },
  { href: '/super-admin/settings', label: 'Global Settings', icon: Settings },
];

const SuperAdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 flex flex-col h-screen fixed left-0 top-0 shadow-lg">
      <div className="text-2xl font-bold mb-8 text-center text-green-600 dark:text-green-500">
        SuperAdmin
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/super-admin' && pathname.startsWith(item.href));
            // Temporary check for '/super-admin' route existence before prefixing other routes
            // This logic might need adjustment based on how you structure your super-admin routes
            const finalHref = item.href.startsWith('/') ? item.href : `/super-admin${item.href}`;
            return (
              <li key={item.href} className="mb-2">
                <Link
                  href={finalHref} // Use finalHref
                  className={`flex items-center p-3 rounded-lg transition-colors 
                              ${isActive 
                                ? 'bg-green-500 text-white dark:bg-green-600'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div>
        <Link
          href="/super-admin/support" // Assuming support is also under /super-admin
          className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <LifeBuoy size={20} className="mr-3" />
          Support
        </Link>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
