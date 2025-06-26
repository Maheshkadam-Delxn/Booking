'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../lib/api/apiClient';
import axios from 'axios';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [tenantConfig, setTenantConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Extract subdomain from current host
  const extractSubdomain = () => {
    if (typeof window === 'undefined') return null;

    const host = window.location.host;

    // Handle localhost development (including www.sub.localhost)
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      const parts = host.split('.');
      if (parts[0] === 'www' && parts.length > 2) {
        return parts[1];
      }
      if (parts.length > 1 && parts[0] !== 'www') {
        return parts[0];
      }
    }

    // Handle production domains
    const parts = host.split('.');
    if (parts[0] === 'www') {
      // www.<sub>.<root>.<tld>
      if (parts.length >= 4) {
        return parts[1];
      }
      return null; // www.<root>.<tld>
    }
    if (parts.length >= 3) {
      return parts[0];
    }

    return null;
  };

  // Fetch tenant information
  const fetchTenantInfo = async (subdomain) => {
    try {
      console.log('🔍 Fetching tenant info for subdomain:', subdomain);
      setIsLoading(true);

      // Call backend public endpoint to obtain tenant details
      const { data } = await apiClient.get('/tenant/info', {
        headers: {
          'X-Tenant-Subdomain': subdomain,
        },
      });

      const tenantData = data.data || data; // controller may wrap in {data}

      setTenant(tenantData);
      console.log('✅ Tenant info loaded:', tenantData);

      // Configure convenient front-end settings
      setTenantConfig({
        name: tenantData.name,
        subdomain: tenantData.subdomain,
        logo: tenantData.logo || tenantData.settings?.logo,
        themeColor: tenantData.settings?.themeColor || '#10B981',
        timezone: tenantData.settings?.timezone || 'UTC',
        businessEmail: tenantData.contactEmail || tenantData.businessEmail,
        businessPhone: tenantData.contactPhone || tenantData.businessPhone,
        address: tenantData.address,
      });

      // Update document title for branding
      if (typeof document !== 'undefined') {
        document.title = `${tenantData.name} | Landscaping Services`;
      }
    } catch (err) {
      console.error('Failed to fetch tenant info:', err);
      setError('Tenant not found or inactive');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize tenant context
  useEffect(() => {
    setIsClient(true);
    
    const subdomain = extractSubdomain();
    
    if (subdomain) {
      fetchTenantInfo(subdomain);
    } else {
      // No subdomain - could be super admin or main domain
      setIsLoading(false);
    }
  }, []);

  // Get tenant-specific API client
  const getTenantApiClient = () => {
    if (!tenant?.subdomain) return apiClient;
    
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        'X-Tenant-Subdomain': tenant.subdomain,
      },
    });
  };

  // Check if current user belongs to this tenant
  const validateUserTenant = (userData) => {
    if (!tenant || !userData) return true; // Allow if no tenant context
    
    // Super admin can access all tenants
    if (userData.role === 'superAdmin') return true;
    
    // Check if user belongs to this tenant
    return userData.tenantId === tenant._id;
  };

  const value = {
    tenant,
    tenantConfig,
    isLoading: !isClient || isLoading, // Show loading until client-side hydration
    error,
    getTenantApiClient,
    validateUserTenant,
    subdomain: isClient ? extractSubdomain() : null,
    isClient,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}; 



// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import apiClient from '../lib/api/apiClient';
// import axios from 'axios';

// const TenantContext = createContext();

// export const useTenant = () => {
//   const context = useContext(TenantContext);
//   if (!context) {
//     throw new Error('useTenant must be used within a TenantProvider');
//   }
//   return context;
// };

// export const TenantProvider = ({ children }) => {
//   const [tenant, setTenant] = useState(null);
//   const [tenantConfig, setTenantConfig] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isClient, setIsClient] = useState(false);

//   const extractSubdomain = () => {
//     if (typeof window === 'undefined') return null;
    
//     const host = window.location.host;
    
//     // Handle localhost development
//     if (host.includes('localhost') || host.includes('127.0.0.1')) {
//       const parts = host.split('.');
//       if (parts.length > 1 && parts[0] !== 'www') {
//         return parts[0];
//       }
//       return 'demo'; // Default for local development
//     }
    
//     // Handle production domains
//     const parts = host.split('.');
//     if (parts.length >= 3 && parts[0] !== 'www') {
//       return parts[0];
//     }
    
//     return null;
//   };

//   const fetchTenantInfo = async (subdomain) => {
//     try {
//       // In a real app, you would fetch tenant info from your API
//       // For demo purposes, we'll use mock data
//       const mockTenantData = {
//         _id: `mock-tenant-id-${subdomain}`,
//         name: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Landscaping`,
//         subdomain: subdomain,
//         settings: {
//           themeColor: '#10B981',
//           timezone: 'UTC'
//         }
//       };
      
//       setTenant(mockTenantData);
      
//       setTenantConfig({
//         name: mockTenantData.name,
//         subdomain: mockTenantData.subdomain,
//         logo: mockTenantData.settings?.logo,
//         themeColor: mockTenantData.settings?.themeColor || '#10B981',
//         timezone: mockTenantData.settings?.timezone || 'UTC',
//         businessEmail: `contact@${subdomain}.com`,
//         businessPhone: '(555) 123-4567',
//         address: '123 Main St, City, State 12345',
//       });

//       if (typeof document !== 'undefined') {
//         document.title = `${mockTenantData.name} - Landscaping Services`;
//       }
      
//     } catch (err) {
//       console.error('Failed to fetch tenant info:', err);
//       setError('Tenant not found or inactive');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     setIsClient(true);
    
//     const subdomain = extractSubdomain();
    
//     if (subdomain) {
//       fetchTenantInfo(subdomain);
//     } else {
//       // No subdomain - could be super admin or main domain
//       setIsLoading(false);
//     }
//   }, []);

//   const getTenantApiClient = () => {
//     if (!tenant?.subdomain) return apiClient;
    
//     return axios.create({
//       baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//       headers: {
//         'X-Tenant-Subdomain': tenant.subdomain,
//       },
//     });
//   };

//   const validateUserTenant = (userData) => {
//     if (!tenant || !userData) return true; // Allow if no tenant context
    
//     // Super admin can access all tenants
//     if (userData.role === 'superAdmin') return true;
    
//     // Check if user belongs to this tenant
//     return userData.tenantId === tenant._id;
//   };

//   const value = {
//     tenant,
//     tenantConfig,
//     isLoading: !isClient || isLoading,
//     error,
//     getTenantApiClient,
//     validateUserTenant,
//     subdomain: isClient ? extractSubdomain() : null,
//     isClient,
//   };

//   return (
//     <TenantContext.Provider value={value}>
//       {children}
//     </TenantContext.Provider>
//   );
// };