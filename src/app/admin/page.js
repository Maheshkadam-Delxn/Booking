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