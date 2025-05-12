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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (token) {
          const decodedToken = jwtDecode(token);

          if (decodedToken?.id && decodedToken?.role) {
            setUserRole(decodedToken.role);

            // ✅ Get full user details from API
            const response = await axios.get('http://localhost:5000/api/v1/auth/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

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

  const loginWithRole = (token, rememberMe) => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: Token must be a string');
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token: Malformed JWT structure');
      }

      const decodedToken = jwtDecode(token);

      if (!decodedToken?.id || !decodedToken?.role) {
        throw new Error('Invalid token: Missing required claims');
      }

      setUserRole(decodedToken.role);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', token);

      // Don't set userData here — it will be fetched by useEffect
      return true;
    } catch (error) {
      console.error('Login error:', error);
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
