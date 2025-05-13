'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authToken =
          localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const storedUser = JSON.parse(
          localStorage.getItem('userData') || sessionStorage.getItem('userData')
        );

        if (authToken && storedUser) {
          const decoded = jwtDecode(authToken);
          if (decoded.exp * 1000 < Date.now()) {
            clearAuthData();
            return;
          }
          setUserData({ ...storedUser, token: authToken });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setUserData(null);
  };

  const loginWithRole = (token, userData, rememberMe) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.id || !decoded.role) throw new Error('Invalid token');
      if (!userData?._id || !userData?.email || !userData?.role)
        throw new Error('Invalid user data');

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', token);
      storage.setItem('userData', JSON.stringify(userData));
      setUserData({ ...userData, token });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    window.location.href = '/login';
  };

  const value = {
    userData,
    isLoading,
    loginWithRole,
    logout,
    isAuthenticated: !!userData?.token
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for easy usage
export const useDashboard = () => useContext(DashboardContext);
