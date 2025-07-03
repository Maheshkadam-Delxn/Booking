'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Eye, Edit3, Trash2, ToggleLeft, ToggleRight, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api/apiClient';

const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-500';
  switch (status?.toLowerCase()) {
    case 'active': colorClass = 'bg-green-500'; break;
    case 'inactive': colorClass = 'bg-yellow-500'; break;
    case 'trialing': colorClass = 'bg-blue-500'; break;
    case 'suspended': colorClass = 'bg-red-500'; break;
    case 'disabled': colorClass = 'bg-red-500'; break;
  }
  return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${colorClass}`}>
    {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
  </span>;
};

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const router = useRouter();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/super-admin/tenants');
      setTenants(response.data.data || []);
    } catch (error) {
      console.error('❌ Error fetching tenants:', error);
      setError('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTenants = React.useMemo(() => {
    let sortableItems = [...tenants];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [tenants, sortConfig]);

  const filteredTenants = sortedTenants.filter(tenant => 
    tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subdomain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspendTenant = async (tenantId) => {
    try {
      const tenant = tenants.find(t => t._id === tenantId);
      const newStatus = tenant.subscription?.status === 'suspended' ? 'active' : 'suspended';
      
      await apiClient.post(`/super-admin/tenants/${tenantId}/${newStatus === 'suspended' ? 'suspend' : 'activate'}`);
      
      setTenants(tenants.map(t => 
        t._id === tenantId 
          ? { ...t, subscription: { ...t.subscription, status: newStatus } }
          : t
      ));
    } catch (error) {
      console.error('❌ Error updating tenant status:', error);
      alert('Failed to update tenant status');
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(`/super-admin/tenants/${tenantId}`);
      setTenants(tenants.filter(t => t._id !== tenantId));
    } catch (error) {
      console.error('❌ Error deleting tenant:', error);
      alert('Failed to delete tenant');
    }
  };
  
  const viewTenantDetails = (tenantId) => {
    router.push(`/super-admin/tenants/${tenantId}`);
  };

  const editTenant = (tenantId) => {
    router.push(`/super-admin/tenants/${tenantId}/edit`);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} className="opacity-50" />;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Tenant Management</h1>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-40 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Tenant Management</h1>
          <Link href="/super-admin/tenants/new" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg">
            <PlusCircle size={20} className="mr-2" /> Create New Tenant
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button 
            onClick={fetchTenants}
            className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Tenant Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
  <div className="relative flex-grow">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </div>
    <input
      type="text"
      placeholder="Search tenants by name, subdomain or owner..."
      className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      aria-label="Search tenants"
    />
    {searchTerm && (
      <button
        onClick={() => setSearchTerm('')}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        aria-label="Clear search"
      >
        <svg
          className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>
  
  <Link
    href="/super-admin/tenants/new"
    className="shrink-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:shadow-inner active:translate-y-px"
  >
    <PlusCircle size={20} className="mr-2 flex-shrink-0" />
    <span className="hidden sm:inline whitespace-nowrap">Create Tenant</span>
    <span className="sm:hidden whitespace-nowrap">Create</span>
  </Link>
</div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Business Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('subdomain')}
                >
                  <div className="flex items-center">
                    Subdomain
                    {getSortIcon('subdomain')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('subscription.status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('subscription.status')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('owner.name')}
                >
                  <div className="flex items-center">
                    Owner
                    {getSortIcon('owner.name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Created
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tenant.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {/* Subdomain as clickable URL (strip www from main domain) */}
                      {tenant.subdomain ? (() => {
                        let mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN;
                        if (mainDomain) {
                          // Remove protocol and www if present
                          mainDomain = mainDomain.replace(/^https?:\/\//, '').replace(/^www\./, '');
                        } else if (typeof window !== 'undefined') {
                          const hostParts = window.location.hostname.split('.');
                          mainDomain = hostParts.slice(-2).join('.');
                        } else {
                          mainDomain = 'localhost:3000';
                        }
                        const url = `https://${tenant.subdomain}.${mainDomain}`;
                        return (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                            title={`Go to ${url}`}
                          >
                            {tenant.subdomain}
                          </a>
                        );
                      })() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={tenant.subscription?.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tenant.owner?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(tenant.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewTenantDetails(tenant._id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => editTenant(tenant._id)}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 p-1 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleSuspendTenant(tenant._id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
                          title={tenant.subscription?.status === 'suspended' ? 'Activate' : 'Suspend'}
                        >
                          {tenant.subscription?.status === 'suspended' ? (
                            <ToggleLeft size={18} className="text-red-500" />
                          ) : (
                            <ToggleRight size={18} className="text-green-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteTenant(tenant._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No tenants found {searchTerm && `matching "${searchTerm}"`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}