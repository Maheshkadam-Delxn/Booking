'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { serviceApi } from '@/lib/api/services';
import { useDashboard } from '@/contexts/DashboardContext';
import axios from 'axios';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { userData, isLoading } = useDashboard();
  const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;

  const CATEGORIES = [
    'all',
    'Lawn Maintenance',
    'Gardening',
    'Tree Service',
    'Landscaping Design',
    'Irrigation',
    'Seasonal',
    'Other'
  ];

  useEffect(() => {
    fetchServices();
  }, [currentPage, selectedCategory, sortField, sortDirection]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
        search: searchTerm || undefined
      };

      const response = await serviceApi.getAllServices(params);
      setServices(response.data);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`${API_URL}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      // Refresh services list after deletion
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">Manage the services your landscaping business offers</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/admin/services/new">
            <Button variant="primary">Add New Service</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('category')}>Category</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('basePrice')}>Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">No services found</td>
                </tr>
              ) : (
                services.map(service => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.image ? (
                        <img src={service.image?.url} alt={service.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${service.basePrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/services/${service._id}/edit`}>
                        <Button variant="secondary" size="sm" className="mr-2">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleteLoading}
                        onClick={() => handleDelete(service._id)}
                      >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServicesPage;
