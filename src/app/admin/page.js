'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Dashboard from '../../components/admin/Dashboard';

const AdminPage = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from both storage locations
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    setToken(storedToken || 'No token found');
  }, []);

  return (
    <AdminLayout>
      
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminPage; 