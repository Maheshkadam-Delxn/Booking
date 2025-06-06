'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Eye, Edit3, Trash2, ToggleLeft, ToggleRight, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation'; // For navigation

// Placeholder data - replace with API call
const initialTenants = [
  {
    id: 'tenant-001',
    businessName: 'GreenScape Landscaping',
    subdomain: 'greenscape.gardningweb.com',
    status: 'active',
    onboardingDate: '2023-01-15',
    lastActivity: '2025-06-04 10:30 AM',
    usageMetrics: { appointments: 120, estimates: 45, revenue: '$5,500' },
  },
  {
    id: 'tenant-002',
    businessName: 'Bloom & Grow Gardens',
    subdomain: 'bloomgrow.gardningweb.com',
    status: 'inactive',
    onboardingDate: '2023-03-22',
    lastActivity: '2025-05-10 02:15 PM',
    usageMetrics: { appointments: 30, estimates: 12, revenue: '$1,200' },
  },
  {
    id: 'tenant-003',
    businessName: 'Evergreen Solutions',
    subdomain: 'evergreen.gardningweb.com',
    status: 'trial',
    onboardingDate: '2025-05-01',
    lastActivity: '2025-06-05 09:00 AM',
    usageMetrics: { appointments: 10, estimates: 5, revenue: '$300' },
  },
  {
    id: 'tenant-004',
    businessName: 'Yard Masters Inc.',
    subdomain: 'yardmasters.gardningweb.com',
    status: 'disabled',
    onboardingDate: '2022-11-10',
    lastActivity: '2024-12-01 11:00 AM',
    usageMetrics: { appointments: 250, estimates: 90, revenue: '$10,500' },
  },
];

const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-500';
  switch (status.toLowerCase()) {
    case 'active': colorClass = 'bg-green-500'; break;
    case 'inactive': colorClass = 'bg-yellow-500'; break;
    case 'trial': colorClass = 'bg-blue-500'; break;
    case 'disabled': colorClass = 'bg-red-500'; break;
  }
  return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${colorClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState(initialTenants);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'businessName', direction: 'ascending' });
  const router = useRouter();

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [tenants, sortConfig]);

  const filteredTenants = sortedTenants.filter(tenant => 
    tenant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspendTenant = (tenantId) => {
    // Placeholder: API call to suspend tenant
    setTenants(tenants.map(t => t.id === tenantId ? { ...t, status: t.status === 'disabled' ? 'active' : 'disabled' } : t));
    alert(`Tenant ${tenantId} status toggled.`);
  };

  const handleDeleteTenant = (tenantId) => {
    // Placeholder: API call to delete tenant
    if (window.confirm(`Are you sure you want to delete tenant ${tenantId}? This action cannot be undone.`)) {
      setTenants(tenants.filter(t => t.id !== tenantId));
      alert(`Tenant ${tenantId} deleted.`);
    }
  };
  
  // Function to navigate to tenant details page
  const viewTenantDetails = (tenantId) => {
    router.push(`/super-admin/tenants/${tenantId}`);
  };

  // Function to navigate to edit tenant page
  const editTenant = (tenantId) => {
    router.push(`/super-admin/tenants/${tenantId}/edit`); // Assuming an edit route
  };


  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} className="opacity-50" />;
  };

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
              placeholder="Search by business name or subdomain..."
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
                  { key: 'businessName', label: 'Business Name' },
                  { key: 'subdomain', label: 'Subdomain' },
                  { key: 'status', label: 'Status' },
                  { key: 'onboardingDate', label: 'Onboarded' },
                  { key: 'lastActivity', label: 'Last Activity' },
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
                <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tenant.businessName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tenant.subdomain}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tenant.onboardingDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tenant.lastActivity}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                    <button onClick={() => viewTenantDetails(tenant.id)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700" title="View Details">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => editTenant(tenant.id)} className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-100 dark:hover:bg-gray-700" title="Edit">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleSuspendTenant(tenant.id)} className={`${tenant.status === 'disabled' ? 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300' : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'} p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700`} title={tenant.status === 'disabled' ? 'Enable Tenant' : 'Suspend Tenant'}>
                      {tenant.status === 'disabled' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => handleDeleteTenant(tenant.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-gray-700" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No tenants found matching your criteria.
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
