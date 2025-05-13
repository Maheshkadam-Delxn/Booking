'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/admin/AdminLayout';
import Dashboard from '../../components/admin/Dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
const AdminPage = () => {

  const router = useRouter();
  const { userData, isLoading } = useDashboard();

  useEffect(() => {
    if (!isLoading) {
      if (!userData?.role) {
        router.push('/login');
      } else if (userData.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [isLoading, userData, router]);

  if (isLoading) return <p>Loading...</p>;

  if (userData?.role !== 'admin') return null;

  // useEffect(() => {
  //   // Get token from both storage locations
  //   const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  //   setToken(storedToken || 'No token found');
  // }, []);

  return (
    <AdminLayout>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Authentication Token:</h2>
        <div className="bg-white p-3 rounded border">
          <code className="break-all">{token}</code>
        </div>
      </div>
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminPage; 