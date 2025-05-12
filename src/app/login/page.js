'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthFormContainer from '../../components/auth/AuthFormContainer';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SocialButton from '../../components/auth/SocialButton';
import { useDashboard } from '../../contexts/DashboardContext';
import { jwtDecode } from 'jwt-decode';


export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const { loginWithRole } = useDashboard();
  
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
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Simple email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error('Login failed: Server returned ' + response.status);
      }
  
      const data = await response.json();
  
      if (!data.token) {
        throw new Error('Token not received from server');
      }
  
      // Use the context to handle login
      loginWithRole(data.token, rememberMe);
  
      setShowSuccess(true);
  
      // Decode token to get role for redirection
      const decodedToken = jwtDecode(data.token);
      const role = decodedToken.role;
      
      setTimeout(() => {
        router.push(
          role === 'admin' ? '/admin' : 
          role === 'professional' ? '/professional' : 
          role === 'customer' ? '/customers' : '/'
        );
      }, 1500);
  
      // If the user is a customer, fetch customer data
      if (role === 'customer') {
        try {
          const res = await fetch(`${API_URL}/customers/me`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          });
  
          const customerData = await res.json();
          if (customerData.success) {
            localStorage.setItem('customerId', customerData.data._id);
          }
        } catch (customerErr) {
          console.error('Error fetching customer data:', customerErr);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setShowError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    setIsLoading(true);
    
    // Simulate API call for social login
    setTimeout(() => {
      // Default social login as customer
      const userData = { id: 5, name: 'Social User', email: 'social@example.com' };
      loginWithRole('customer', userData);
      
      setShowSuccess(true);
      setIsLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/customer');
      }, 1500);
    }, 1000);
  };

  return (
    <AuthFormContainer 
      title="Log in to your account" 
      subtitle="Welcome back to Green Gardens"
    >
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Success!</p>
          <p className="text-sm">You have successfully logged in. Redirecting to dashboard...</p>
        </div>
      )}
      
      {showError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Login failed</p>
          <p className="text-sm">Invalid email or password.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
        />
        <div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Log in
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
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthFormContainer>
  );
}
