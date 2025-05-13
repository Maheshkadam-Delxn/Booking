'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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

  const clearAuthData = () => {
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };

  const fetchUserData = async (token) => {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken?.id && decodedToken?.role) {
        setUserRole(decodedToken.role);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.data;

        setUserData({
          id: user._id,
          name: user.name,
          email: user.email,
          role: decodedToken.role,
          token: token,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      fetchUserData(token).catch(() => {
        // Handle error if needed
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithRole = async (token, rememberMe) => {
    try {
      if (!token) throw new Error('No token provided');
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', token);
      
      await fetchUserData(token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    // Optional: Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

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