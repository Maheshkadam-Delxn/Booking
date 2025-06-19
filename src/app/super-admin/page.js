'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../../contexts/DashboardContext';
import SuperAdminLayout from '../../components/admin/SuperAdminLayout';
import DashboardStats from '../../components/admin/DashboardStats';
import TenantManagement from '../../components/admin/TenantManagement';
import SystemSettings from '../../components/admin/SystemSettings';
import ActivityLogs from '../../components/admin/ActivityLogs';
import BillingManagement from '../../components/admin/BillingManagement';
import UserManagement from '../../components/admin/UserManagement';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { userData, isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (!isLoading && (!userData || userData.role !== 'superAdmin')) {
      router.push('/login');
    }
  }, [userData, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'superAdmin') {
    return null;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'tenants', name: 'Tenant Management', icon: '🏢' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'billing', name: 'Billing & Subscriptions', icon: '💳' },
    { id: 'settings', name: 'System Settings', icon: '⚙️' },
    { id: 'logs', name: 'Activity Logs', icon: '📋' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'tenants':
        return <TenantManagement />;
      case 'users':
        return <UserManagement />;
      case 'billing':
        return <BillingManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'logs':
        return <ActivityLogs />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userData?.name || 'Super Administrator'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userData?.email}</p>
                  <p className="text-xs text-gray-500">Super Administrator</p>
                </div>
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userData?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
