'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../lib/api/apiClient';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (token) {
          const decodedToken = jwtDecode(token);

          if (decodedToken?.id && decodedToken?.role) {
            setUserRole(decodedToken.role);

            try {
              // ✅ Get full user details from API
              const response = await apiClient.get('/auth/me');
              const user = response.data.data;

              const newUserData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: decodedToken.role,
                token: token,
              };

              setUserData(newUserData);
              console.log('Fetched full user data:', newUserData);
            } catch (error) {
              console.log('Could not fetch user data, using token data:', error.message);
              // Fallback to token data if API call fails
              const fallbackUserData = {
                id: decodedToken.id,
                name: decodedToken.name || 'User',
                email: decodedToken.email || 'user@example.com',
                role: decodedToken.role,
                token: token,
              };
              setUserData(fallbackUserData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const clearAuthData = () => {
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };

 const loginWithRole = async (token, rememberMe) => {
  try {
    console.log('🔐 loginWithRole called with token:', token ? 'Present' : 'Missing');
    
    // Basic validation
    if (!token) throw new Error('No token provided');
    
    // Decode token
    const decoded = jwtDecode(token);
    console.log('🔍 Decoded token:', decoded);
    
    if (!decoded.id || !decoded.role) throw new Error('Invalid token payload');

    // Store token first
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
    console.log('💾 Token stored in storage');

    // Create initial user object from token data
    const initialUser = {
      _id: decoded.id,
      id: decoded.id,
      name: decoded.name || 'Super Administrator',
      email: decoded.email || 'superadmin@landscaping.com',
      role: decoded.role,
      token: token
    };

    // Update state immediately with token data
    setUserData(initialUser);
    setUserRole(decoded.role);
    console.log('👤 Initial user data set:', initialUser);

    // Try to fetch complete user data (optional)
    try {
      console.log('🔄 Attempting to fetch complete user data...');
      const response = await apiClient.get('/auth/me');
      const user = response.data.data;
      
      if (user) {
        const completeUser = {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          role: decoded.role,
          token: token
        };
        
        setUserData(completeUser);
        console.log('✅ Complete user data fetched:', completeUser);
        return completeUser;
      }
    } catch (error) {
      console.log('⚠️ Could not fetch complete user data, using token data:', error.message);
      // Continue with token data if API call fails
    }

    return initialUser;
  } catch (error) {
    console.error('❌ Login error:', error);
    clearAuthData();
    throw error;
  }
};

  const logout = clearAuthData;

  const value = {
    userRole,
    userData,
    isLoading,
    loginWithRole,
    logout,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;

