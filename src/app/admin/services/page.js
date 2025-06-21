// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import AdminLayout from '@/components/admin/AdminLayout';
// import Button from '@/components/ui/Button';
// import { serviceApi } from '@/lib/api/services';
// import { useDashboard } from '@/contexts/DashboardContext';
// import axios from 'axios';

// const ServicesPage = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortField, setSortField] = useState('createdAt'); // Default sort by creation date
//   const [sortDirection, setSortDirection] = useState('desc'); // Default newest first
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const { userData, isLoading } = useDashboard();
//   const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;

//   const CATEGORIES = [
//     'all',
//     'Lawn Maintenance',
//     'Gardening',
//     'Tree Service',
//     'Landscaping Design',
//     'Irrigation',
//     'Seasonal',
//     'Other'
//   ];

//   useEffect(() => {
//     fetchServices();
//   }, [currentPage, selectedCategory, sortField, sortDirection, searchTerm]);

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory !== 'all' ? selectedCategory : undefined,
//         sort: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
//         search: searchTerm || undefined
//       };

//       const response = await serviceApi.getAllServices(params);
//       setServices(response.data);
//       setTotalPages(Math.ceil(response.total / 10));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch services');
//     } finally {
//       setLoading(false);
//     }
//   };




'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { serviceApi } from '@/lib/api/services';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTenant } from '@/contexts/TenantContext';
import axios from 'axios';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { userData, isLoading } = useDashboard();
  const { tenant } = useTenant();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const CATEGORIES = [
    'all',
    'Lawn Maintenance',
    'Gardening',
    'Tree Service',
    'Landscaping Design',
    'Irrigation',
    'Seasonal',
    'Residential',
    'Other'
  ];

  useEffect(() => {
    if (userData && !isLoading && tenant) {
      fetchServices();
    }
  }, [currentPage, selectedCategory, sortField, sortDirection, searchTerm, userData, isLoading, tenant]);

 // Modify the fetchServices function to ensure it's using the correct tenant ID
const fetchServices = async () => {
  try {
    setLoading(true);
    
    // Ensure we have the tenant ID in the correct format
    const tenantId = userData?.tenantId?._id || userData?.tenantId;
    if (!tenantId) {
      throw new Error('No tenant associated with this user');
    }

    const params = {
      tenantId, // Simplified
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchTerm || undefined,
      sort: `${sortField}:${sortDirection}`
    };

    // Clean up params to remove undefined values
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const response = await axios.get(`${API_URL}/services`, {
      params: cleanedParams,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    
    setServices(response.data?.data || []);
    setError(null);
    
  } catch (err) {
    console.error('Error fetching services:', err);
    setError(err.response?.data?.message || err.message || 'Failed to fetch services');
    setServices([]);
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

  // Calculate starting serial number based on current page
  const getSerialNumber = (index) => {
    return (currentPage - 1) * 10 + index + 1;
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('category')}>
                  Category
                  {sortField === 'category' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('basePrice')}>
                  Price
                  {sortField === 'basePrice' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                  Date Added
                  {sortField === 'createdAt' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">No services found</td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{getSerialNumber(index)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.image ? (
                        <img src={service.image?.url} alt={service.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.basePrice ? `$${service.basePrice.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
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

        {/* Pagination */}
        {services.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * 10, services.length + (currentPage - 1) * 10)}</span> of{' '}
                  <span className="font-medium">{services.length + (currentPage - 1) * 10}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ServicesPage;