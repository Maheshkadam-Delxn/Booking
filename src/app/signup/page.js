'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthFormContainer from '../../components/auth/AuthFormContainer';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SocialButton from '../../components/auth/SocialButton';
import { useDashboard } from '../../contexts/DashboardContext';

export default function SignupPage() {
  const router = useRouter();
  const { loginWithRole } = useDashboard();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone:'',
    confirmPassword: '',
    role: '', // <-- Add this
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
  
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
  
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
  
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
  
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
  
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If no errors, return true
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone:formData.phone,
          password: formData.password,
          role: formData.role
        })
        
      });
  
      const data = await res.json();
  console.log("done",data);
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
  
      // Assume server sets token in cookie or returns user data
      console.log('Signup successful:', data);
  
      // loginWithRole('customer', data.data || { name: formData.name, email: formData.email });
  
      setShowSuccess(true);
  
      setTimeout(() => {
        // Redirect based on role
        if (formData.role === 'admin') {
          router.push('/admin');
        } else if (formData.role === 'professional') {
          router.push('/professional');
        } else {
          router.push('/');
        }
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ email: error.message }); // Example: show API error on email field
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
    setIsLoading(true);
    
    // Simulate API call for social signup
    setTimeout(() => {
      // Generate a random user for demo
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        name: `${provider} User`,
        email: `${provider.toLowerCase()}user${Math.floor(Math.random() * 1000)}@example.com`,
        createdAt: new Date().toISOString()
      };
      
      // By default, social signups are customers
      loginWithRole('customer', newUser);
      
      setShowSuccess(true);
      setIsLoading(false);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 1000);
  };

  return (
    <AuthFormContainer 
      title="Create your account" 
      subtitle="Join Your Landscaping Company to book services"
    >
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Success!</p>
          <p className="text-sm">Your account has been created successfully. Redirecting to dashboard...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          label="Full Name"
          type="text"
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
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
          label="Phone Number"
          type="tel"
          id="phone"
          name="phone"
          placeholder="1234567890"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          pattern="[0-9]{10}"
          title="10-digit phone number"
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
        
        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        <label className="block mb-2 text-sm font-medium text-gray-700">Select Role</label>
<select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full p-2 border rounded-md"
>
  <option value="">-- Choose Role --</option>
  <option value="customer">Customer</option>
  <option value="professional">Professional</option>
  <option value="admin">Admin</option>
</select>
{errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="font-light text-gray-600">
              I agree to the <Link href="/terms-of-service" className="text-green-600 hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</Link>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Create Account
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
          onClick={() => handleSocialSignup('Google')} 
        />
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </AuthFormContainer>
  );
} 