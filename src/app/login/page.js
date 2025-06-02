// 'use client';

// import React, { useState, Suspense } from 'react';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import AuthFormContainer from '../../components/auth/AuthFormContainer';
// import Input from '../../components/ui/Input';
// import Button from '../../components/ui/Button';
// import SocialButton from '../../components/auth/SocialButton';
// import { useDashboard } from '../../contexts/DashboardContext';
// import { jwtDecode } from 'jwt-decode';

// // Create a client component that safely uses useSearchParams
// function LoginContent() {
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const router = useRouter();
//   const { loginWithRole } = useDashboard();
//   const searchParams = useSearchParams();
//   const redirectPath = searchParams.get('redirect') || '/dashboard';
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear field-specific error when user types
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Simple email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setShowError(false);
//     setShowSuccess(false);

//     try {
//       const response = await fetch(`${API_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Login failed');
//       }

//       const { token } = await response.json();
//       if (!token) throw new Error('No token received');

//       const userData = await loginWithRole(token, rememberMe);
//       setShowSuccess(true);

//       setTimeout(() => {
//         if (redirectPath !== '/dashboard') {
//           router.push(redirectPath); // Use query param redirect if provided
//         } else {
//           router.push(
//             userData.role === 'admin' ? '/admin' :
//             userData.role === 'professional' ? '/professional' :
//             '/customers'
//           );
//         }
//       }, 1500);

//     } catch (error) {
//       setShowError(error.message || 'Login failed');
//       console.error('Login error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialLogin = (provider) => {
//     console.log(`Login with ${provider}`);
//     setIsLoading(true);
    
//     // Simulate API call for social login
//     setTimeout(() => {
//       // Default social login as customer
//       const userData = { id: 5, name: 'Social User', email: 'social@example.com' };
//       loginWithRole('customer', userData);
      
//       setShowSuccess(true);
//       setIsLoading(false);
      
//       // Redirect after 1.5 seconds
//       setTimeout(() => {
//         router.push('/customer');
//       }, 1500);
//     }, 1000);
//   };

//   return (
//     <AuthFormContainer 
//       title="Log in to your account" 
//       subtitle="Welcome back to Gildordo Rochin"
//     >
//       {showSuccess && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
//           <p className="font-bold">Success!</p>
//           <p className="text-sm">You have successfully logged in. Redirecting to dashboard...</p>
//         </div>
//       )}
      
//       {showError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
//           <p className="font-bold">Login failed</p>
//           <p className="text-sm">Invalid email or password.</p>
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//         <Input
//           label="Email Address"
//           type="email"
//           id="email"
//           name="email"
//           placeholder="you@example.com"
//           value={formData.email}
//           onChange={handleChange}
//           error={errors.email}
//           required
//         />
        
//         <Input
//           label="Password"
//           type="password"
//           id="password"
//           name="password"
//           placeholder="••••••••"
//           value={formData.password}
//           onChange={handleChange}
//           error={errors.password}
//           required
//         />
//         <div>
//           <div className="flex items-center">
//             <input
//               id="rememberMe"
//               name="rememberMe"
//               type="checkbox"
//               checked={rememberMe}
//               onChange={(e) => setRememberMe(e.target.checked)}
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
//               Remember me
//             </label>
//           </div>
        
//           <div className="text-right">
//             <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-500">
//               Forgot your password?
//             </Link>
//           </div>
//         </div>
        
//         <Button
//           type="submit"
//           variant="primary"
//           fullWidth
//           isLoading={isLoading}
//         >
//           Log in
//         </Button>
        
//         <div className="relative my-4">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="bg-white px-2 text-gray-500">Or continue with</span>
//           </div>
//         </div>
        
//         <SocialButton 
//           provider="Google" 
//           onClick={() => handleSocialLogin('Google')} 
//         />
        
//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </form>
//     </AuthFormContainer>
//   );
// }

// // Loading fallback for the Suspense boundary
// function LoginLoading() {
//   return (
//     <AuthFormContainer 
//       title="Log in to your account" 
//       subtitle="Welcome back to Gildordo Rochin"
//     >
//       <div className="flex justify-center items-center py-10">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
//       </div>
//     </AuthFormContainer>
//   );
// }

// export default function LoginPage() {
//   return (
//     <Suspense fallback={<LoginLoading />}>
//       <LoginContent />
//     </Suspense>
//   );
// }








'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SocialButton from '../../components/auth/SocialButton';
import { useDashboard } from '../../contexts/DashboardContext';
import { jwtDecode } from 'jwt-decode';

function LoginContent() {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const { loginWithRole } = useDashboard();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { token } = await response.json();
      if (!token) throw new Error('No token received');

      const userData = await loginWithRole(token, rememberMe);
      setShowSuccess(true);

      setTimeout(() => {
        if (redirectPath !== '/dashboard') {
          router.push(redirectPath);
        } else {
          router.push(
            userData.role === 'admin' ? '/admin' :
            userData.role === 'professional' ? '/professional' :
            '/customers'
          );
        }
      }, 1500);

    } catch (error) {
      setShowError(error.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    setIsLoading(true);
    
    setTimeout(() => {
      const userData = { id: 5, name: 'Social User', email: 'social@example.com' };
      loginWithRole('customer', userData);
      
      setShowSuccess(true);
      setIsLoading(false);
      
      setTimeout(() => {
        router.push('/customer');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Image and benefits */}
        <div 
          className="md:w-1/2 p-6 text-white flex flex-col justify-center relative bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/landscaping-image.png)",
            minHeight: "400px"
          }}
        >
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-4 leading-tight">
              Welcome Back to <span className="text-yellow-300">Gildordo Rochin</span>
            </h1>
            
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white border-opacity-20">
              <h2 className="text-lg font-semibold mb-3 text-yellow-300">Member Benefits:</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Exclusive Discounts</h3>
                    <p className="text-gray-200 text-xs">Special offers for returning customers</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Priority Booking</h3>
                    <p className="text-gray-200 text-xs">Early access to premium time slots</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Loyalty Rewards</h3>
                    <p className="text-gray-200 text-xs">Earn points with every service</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <p className="text-gray-200 text-sm font-medium">24/7 Customer Support</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white">
          {showSuccess ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Login Successful!</h2>
              <p className="text-gray-600 text-sm mb-6">
                You're being redirected to your dashboard...
              </p>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-800 mb-1">Welcome Back</h2>
                <p className="text-gray-600 text-sm">Log in to manage your account and bookings</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {showError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                    <p className="text-red-700">{showError}</p>
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  icon={
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  }
                />
                
                <Input
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  icon={
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  }
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-4 py-2.5 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <SocialButton 
                  provider="Google" 
                  onClick={() => handleSocialLogin('Google')} 
                />
                
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-green-600 hover:text-green-500 hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6 text-white flex flex-col justify-center relative bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/landscaping-image.png)",
            minHeight: "400px"
          }}>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-4 leading-tight">
              Welcome Back to <span className="text-yellow-300">Gildardo Rochin</span>
            </h1>
          </div>
        </div>
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}