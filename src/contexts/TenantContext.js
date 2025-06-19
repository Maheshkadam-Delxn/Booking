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
    
    // Handle localhost development
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      const parts = host.split('.');
      if (parts.length > 1 && parts[0] !== 'www') {
        return parts[0];
      }
    }
    
    // Handle production domains
    const parts = host.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }
    
    return null;
  };

  // Fetch tenant information
  const fetchTenantInfo = async (subdomain) => {
    try {
      console.log('🔍 Fetching tenant info for subdomain:', subdomain);
      
      // For now, we'll skip the API call to avoid the tenant resolution issue
      // This can be implemented later when subdomain routing is properly set up
      
      // Mock tenant data for now
      const mockTenantData = {
        name: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} Landscaping`,
        subdomain: subdomain,
        settings: {
          themeColor: '#10B981',
          timezone: 'UTC'
        }
      };
      
      setTenant(mockTenantData);
      
      // Set tenant configuration
      setTenantConfig({
        name: mockTenantData.name,
        subdomain: mockTenantData.subdomain,
        logo: mockTenantData.settings?.logo,
        themeColor: mockTenantData.settings?.themeColor || '#10B981',
        timezone: mockTenantData.settings?.timezone || 'UTC',
        businessEmail: `contact@${subdomain}.com`,
        businessPhone: '(555) 123-4567',
        address: '123 Main St, City, State 12345',
      });

      // Update document title
      if (typeof document !== 'undefined') {
        document.title = `${mockTenantData.name} - Landscaping Services`;
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