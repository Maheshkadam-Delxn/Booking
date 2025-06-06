'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, BarChart2, Users, HardDrive, FileText, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';

// Placeholder data - in a real app, fetch this based on tenantId
const MOCK_TENANT_DATA = {
  'tenant-001': {
    id: 'tenant-001',
    businessName: 'GreenScape Landscaping',
    subdomain: 'greenscape.gardningweb.com',
    status: 'active',
    contactEmail: 'contact@greenscape.com',
    contactPhone: '(555) 123-4567',
    onboardingDate: '2023-01-15',
    lastActivity: '2025-06-04 10:30 AM',
    logoUrl: 'https://via.placeholder.com/100x100.png?text=GS',
    brandingTheme: '#228B22',
    currentPlan: { name: 'Pro Plan', price: '$99/month', renewalDate: '2025-07-15' },
    usageMetrics: {
      appointments: { currentMonth: 120, lastMonth: 110, trend: '+9%' },
      estimates: { currentMonth: 45, lastMonth: 50, trend: '-10%' },
      paymentsProcessed: { amount: 5500, count: 85, currency: 'USD' },
    },
    activeUsers: { admins: 2, professionals: 10, customers: 150 },
    storageUsage: { photos: '2.5 GB', documents: '500 MB', total: '3.0 GB', limit: '10 GB' },
    planHistory: [
      { planName: 'Basic Plan', startDate: '2023-01-15', endDate: '2023-06-30', price: '$49/month' },
      { planName: 'Pro Plan', startDate: '2023-07-01', endDate: null, price: '$99/month' },
    ],
    enabledFeatures: ['Estimates', 'Online Payments', 'Customer CRM', 'Automated Notifications'],
  },
  // Add more mock tenants if needed for testing different IDs
};

const StatCard = ({ title, value, icon: Icon, subValue, bgColor = 'bg-white dark:bg-gray-800' }) => (
  <div className={`p-4 rounded-lg shadow-md ${bgColor}`}>
    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
      {Icon && <Icon size={18} className="mr-2" />} 
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    {subValue && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subValue}</p>}
  </div>
);

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
                ${isActive 
                  ? 'bg-green-500 text-white dark:bg-green-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
  >
    {label}
  </button>
);

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (tenantId) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        const data = MOCK_TENANT_DATA[tenantId];
        if (data) {
          setTenant(data);
        } else {
          // Handle tenant not found, e.g., redirect or show error
          console.error('Tenant not found');
        }
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [tenantId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!tenant) {
    return (
      <div className="text-center py-10">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Tenant Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The tenant with ID '{tenantId}' could not be found.</p>
        <Link href="/super-admin/tenants" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg mx-auto w-fit">
            <ArrowLeft size={18} className="mr-2" /> Back to Tenant List
          </a>
        </Link>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Status" value={tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)} icon={ShieldCheck} />
      <StatCard title="Subdomain" value={tenant.subdomain} icon={Link} />
      <StatCard title="Onboarding Date" value={tenant.onboardingDate} icon={FileText} />
      <StatCard title="Contact Email" value={tenant.contactEmail} icon={Users} />
      <StatCard title="Contact Phone" value={tenant.contactPhone || 'N/A'} icon={Users} />
      <StatCard title="Last Activity" value={tenant.lastActivity} icon={BarChart2} />
      <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Enabled Features</h4>
        <div className="flex flex-wrap gap-2">
          {tenant.enabledFeatures.map(feature => (
            <span key={feature} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 rounded-full">{feature}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsageMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Appointments (Current Month)" value={tenant.usageMetrics.appointments.currentMonth} subValue={`Trend: ${tenant.usageMetrics.appointments.trend}`} icon={BarChart2} />
      <StatCard title="Estimates (Current Month)" value={tenant.usageMetrics.estimates.currentMonth} subValue={`Trend: ${tenant.usageMetrics.estimates.trend}`} icon={FileText} />
      <StatCard title="Payments Processed" value={`$${tenant.usageMetrics.paymentsProcessed.amount.toLocaleString()}`} subValue={`${tenant.usageMetrics.paymentsProcessed.count} transactions`} icon={DollarSign} />
      {/* Placeholder for charts */}
      <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-500">
        Appointment & Estimate Trends Chart (Placeholder)
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Admin Users" value={tenant.activeUsers.admins} icon={Users} />
      <StatCard title="Professional Users" value={tenant.activeUsers.professionals} icon={Users} />
      <StatCard title="Customer Accounts" value={tenant.activeUsers.customers} icon={Users} />
      {/* Placeholder for user list or activity */}
      <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-500">
        User List / Breakdown (Placeholder)
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Photo Storage" value={tenant.storageUsage.photos} icon={HardDrive} />
      <StatCard title="Document Storage" value={tenant.storageUsage.documents} icon={HardDrive} />
      <StatCard title="Total Storage Used" value={`${tenant.storageUsage.total} / ${tenant.storageUsage.limit}`} icon={HardDrive} />
      {/* Placeholder for storage breakdown chart */}
      <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md min-h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-500">
        Storage Usage Breakdown Chart (Placeholder)
      </div>
    </div>
  );

  const renderPlanBilling = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Current Plan</h4>
        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Plan:</span> {tenant.currentPlan.name}</p>
        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Price:</span> {tenant.currentPlan.price}</p>
        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Next Renewal:</span> {tenant.currentPlan.renewalDate}</p>
        <div className="mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm mr-2">Upgrade Plan</button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">Change Billing</button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Plan History</h4>
        <ul className="space-y-2">
          {tenant.planHistory.map((plan, index) => (
            <li key={index} className="text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1 mb-1">
              {plan.planName} ({plan.price}) - {plan.startDate} to {plan.endDate || 'Present'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => router.push('/super-admin/tenants')}
            className="mb-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Tenant List
          </button>
          <div className="flex items-center">
            {tenant.logoUrl && <img src={tenant.logoUrl} alt={`${tenant.businessName} logo`} className="w-16 h-16 rounded-md mr-4 bg-gray-200 dark:bg-gray-700 object-contain"/>}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{tenant.businessName}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">ID: {tenant.id}</p>
            </div>
          </div>
        </div>
        <Link href={`/super-admin/tenants/${tenant.id}/edit`} legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg text-sm">
            <Edit3 size={16} className="mr-2" /> Edit Tenant
          </a>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
        <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Usage Metrics" isActive={activeTab === 'usage'} onClick={() => setActiveTab('usage')} />
        <TabButton label="Users" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <TabButton label="Storage" isActive={activeTab === 'storage'} onClick={() => setActiveTab('storage')} />
        <TabButton label="Plan & Billing" isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-0 sm:p-2 rounded-lg">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'usage' && renderUsageMetrics()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'storage' && renderStorage()}
        {activeTab === 'billing' && renderPlanBilling()}
      </div>
    </div>
  );
}
