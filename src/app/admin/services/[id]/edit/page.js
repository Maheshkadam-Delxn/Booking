'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceForm from '@/components/admin/ServiceForm';
import { serviceApi } from '@/lib/api/services';

const EditServicePage = ({ params }) => {
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchService();
  }, [params.id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const data = await serviceApi.getService(params.id);
      setService(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout>
        <div className="text-gray-500">Service not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-1">Update service details and packages</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ServiceForm service={service} isEditing={true} />
      </div>
    </AdminLayout>
  );
};

export default EditServicePage; 