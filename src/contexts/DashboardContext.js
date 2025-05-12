'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
          try {
            const decodedToken = jwtDecode(token);
            
            if (decodedToken) {
              setUserRole(decodedToken.role);
              setUserData({
                id: decodedToken.id,
                role: decodedToken.role,
                token: token // Store the actual token here
              });
            }
          } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            clearAuthData();
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
      // First validate the token structure
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: Token must be a string');
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token: Malformed JWT structure');
      }

      // Then decode it
      const decodedToken = jwtDecode(token);
      
      if (!decodedToken?.id || !decodedToken?.role) {
        throw new Error('Invalid token: Missing required claims');
      }

      const newUserData = {
        id: decodedToken.id,
        role: decodedToken.role,
        token: token
      };
      
      setUserRole(decodedToken.role);
      setUserData(newUserData);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', token);

      return true; // Indicate success
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      throw error; // Re-throw for handling in the calling component
    }
  };

  const logout = clearAuthData;

  const value = {
    userRole,
    userData,
    isLoading,
    loginWithRole,
    logout
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;