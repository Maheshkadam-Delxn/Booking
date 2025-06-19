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
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const router = useRouter();

  // Fetch tenants from API
  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/super-admin/tenants');
      console.log('📋 Fetched tenants:', response.data);
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
        
        // Handle nested objects and dates
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
      
      // Update local state
      setTenants(tenants.map(t => 
        t._id === tenantId 
          ? { ...t, subscription: { ...t.subscription, status: newStatus } }
          : t
      ));
      
      console.log(`✅ Tenant ${tenantId} status updated to ${newStatus}`);
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
      console.log(`✅ Tenant ${tenantId} deleted successfully`);
    } catch (error) {
      console.error('❌ Error deleting tenant:', error);
      alert('Failed to delete tenant');
    }
  };
  
  // Function to navigate to tenant details page
  const viewTenantDetails = (tenantId) => {
    router.push(`/super-admin/tenants/${tenantId}`);
  };

  // Function to navigate to edit tenant page
  const editTenant = (tenantId) => {
    router.push(`/super-admin/tenants/${tenantId}/edit`);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} className="opacity-50" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tenant Management</h1>
          <div className="bg-gray-200 dark:bg-gray-700 h-10 w-40 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tenant Management</h1>
          <Link href="/super-admin/tenants/new" legacyBehavior>
            <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg">
              <PlusCircle size={20} className="mr-2" /> Create New Tenant
            </a>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tenant Management</h1>
        <Link href="/super-admin/tenants/new" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg">
            <PlusCircle size={20} className="mr-2" /> Create New Tenant
          </a>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input 
              type="text"
              placeholder="Search by business name, subdomain, or owner..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[
                  { key: 'name', label: 'Business Name' },
                  { key: 'subdomain', label: 'Subdomain' },
                  { key: 'subscription.status', label: 'Status' },
                  { key: 'owner.name', label: 'Owner' },
                  { key: 'createdAt', label: 'Created' },
                ].map(col => (
                  <th 
                    key={col.key} 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      <span className="ml-1">{getSortIcon(col.key)}</span>
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {tenant.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {tenant.subdomain}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <StatusBadge status={tenant.subscription?.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {tenant.owner?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                    <button 
                      onClick={() => viewTenantDetails(tenant._id)} 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700" 
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => editTenant(tenant._id)} 
                      className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-100 dark:hover:bg-gray-700" 
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleSuspendTenant(tenant._id)} 
                      className={`${tenant.subscription?.status === 'suspended' ? 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300' : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'} p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700`} 
                      title={tenant.subscription?.status === 'suspended' ? 'Activate Tenant' : 'Suspend Tenant'}
                    >
                      {tenant.subscription?.status === 'suspended' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteTenant(tenant._id)} 
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-gray-700" 
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTenants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No tenants found matching your search.' : 'No tenants found.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
