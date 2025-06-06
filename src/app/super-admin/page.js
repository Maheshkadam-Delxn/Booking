'use client';

import React from 'react';
import { Users, FileText, DollarSign, Activity, ShieldCheck, AlertTriangle, Settings } from 'lucide-react'; // Added Settings icon

const StatCard = ({ title, value, icon: Icon, trend, trendColor, bgColorClass = 'bg-white dark:bg-gray-800' }) => (
  <div className={`p-6 rounded-xl shadow-lg ${bgColorClass} transition-all hover:shadow-2xl`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
      <Icon className="text-green-500" size={28} />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    {trend && (
      <p className={`text-sm mt-1 ${trendColor || 'text-gray-500 dark:text-gray-400'}`}>{trend}</p>
    )}
  </div>
);

const QuickActionButton = ({ label, icon: Icon, onClick, colorClass = 'bg-green-500 hover:bg-green-600' }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center px-6 py-3 rounded-lg text-white ${colorClass} transition-colors shadow-md hover:shadow-lg w-full text-sm md:text-base`}
  >
    <Icon size={20} className="mr-2" />
    {label}
  </button>
);

export default function SuperAdminDashboardPage() {
  // Placeholder data - in a real app, this would come from an API
  const stats = [
    { title: 'Total Tenants', value: '128', icon: Users, trend: '+5 this month', trendColor: 'text-green-500' },
    { title: 'Active Subscriptions', value: '110', icon: FileText, trend: '92% active', trendColor: 'text-blue-500' },
    { title: 'Monthly Recurring Revenue', value: '$12,500', icon: DollarSign, trend: '+2.5% vs last month', trendColor: 'text-green-500' },
    { title: 'Platform Uptime', value: '99.98%', icon: ShieldCheck, trend: 'Last 30 days', trendColor: 'text-green-500' },
  ];

  const criticalAlerts = [
    { id: 1, message: 'High CPU usage on billing server.', severity: 'High', time: '15 mins ago' },
    { id: 2, message: 'Failed payment processing for Tenant X.', severity: 'Medium', time: '1 hour ago' },
  ];

  // Placeholder functions for navigation - replace with Next.js router.push()
  const navigateTo = (path) => {
    alert(`Navigating to ${path}... (replace with router.push)`);
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    // router.push(path);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Super Admin Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionButton label="Create New Tenant" icon={Users} onClick={() => navigateTo('/super-admin/tenants/new')} />
        <QuickActionButton label="View System Logs" icon={Activity} onClick={() => navigateTo('/super-admin/activity-logs')} colorClass="bg-blue-500 hover:bg-blue-600" />
        <QuickActionButton label="Manage Global Settings" icon={Settings} onClick={() => navigateTo('/super-admin/settings')} colorClass="bg-indigo-500 hover:bg-indigo-600" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Critical Alerts Section */}
      {criticalAlerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            <AlertTriangle size={24} className="mr-2 text-red-500" /> Critical Alerts
          </h2>
          <ul className="space-y-3">
            {criticalAlerts.map(alert => (
              <li key={alert.id} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time} - Severity: {alert.severity}</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600 self-start sm:self-center">Acknowledge</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Placeholder for Recent Activity or Tenant Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[24rem]">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Tenant Activity (Placeholder)</h2>
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <p>Chart or list of recent activities will go here.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[24rem]">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Tenant Growth Overview (Placeholder)</h2>
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <p>Chart showing tenant sign-ups over time.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
