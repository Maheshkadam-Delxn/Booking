// 'use client';
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed

// export const DashboardContext = createContext();

// export const DashboardProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initializeAuth = () => {
//       try {
//         const authToken =
//           localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
//         const storedUser = JSON.parse(
//           localStorage.getItem('userData') || sessionStorage.getItem('userData')
//         );

//         if (authToken && storedUser) {
//           const decoded = jwtDecode(authToken);
//           if (decoded.exp * 1000 < Date.now()) {
//             clearAuthData();
//             return;
//           }
//           setUserData({ ...storedUser, token: authToken });
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//         clearAuthData();
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const clearAuthData = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//     sessionStorage.removeItem('authToken');
//     sessionStorage.removeItem('userData');
//     setUserData(null);
//   };

//   const loginWithRole = (token, userData, rememberMe) => {
//     try {
//       const decoded = jwtDecode(token);
//       if (!decoded.id || !decoded.role) throw new Error('Invalid token');
//       if (!userData?._id || !userData?.email || !userData?.role)
//         throw new Error('Invalid user data');

//       const storage = rememberMe ? localStorage : sessionStorage;
//       storage.setItem('authToken', token);
//       storage.setItem('userData', JSON.stringify(userData));
//       setUserData({ ...userData, token });

//       return true;
//     } catch (error) {
//       console.error('Login error:', error);
//       clearAuthData();
//       throw error;
//     }
//   };

//   const logout = () => {
//     clearAuthData();
//     window.location.href = '/login';
//   };

//   const value = {
//     userData,
//     isLoading,
//     loginWithRole,
//     logout,
//     isAuthenticated: !!userData?.token
//   };

//   return (
//     <DashboardContext.Provider value={value}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// // Custom hook for easy usage
// export const useDashboard = () => useContext(DashboardContext);




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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
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

 const loginWithRole = async (token, rememberMe) => {
  try {
    // Basic validation
    if (!token) throw new Error('No token provided');
    
    // Decode token
    const decoded = jwtDecode(token);
    if (!decoded.id || !decoded.role) throw new Error('Invalid token payload');

    // Store token
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', token);

    // Fetch complete user data
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = response.data.data;
    if (!user) throw new Error('Failed to fetch user data');

    // Create complete user object
    const completeUser = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: decoded.role,
      token: token
    };

    // Update state
    setUserData(completeUser);
    setUserRole(decoded.role);

    return completeUser;
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

