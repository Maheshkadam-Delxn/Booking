"use client";
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../../lib/stripe';
import StripePaymentForm from '../../../components/payment/StripePaymentForm';
import { toast } from 'react-hot-toast';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    serviceType: 'lawn-mowing',
    frequency: 'weekly',
    acceptTerms: false
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const stripePromise = getStripe();

  const serviceOptions = [
    { id: 'lawn-mowing', name: 'Lawn Mowing', price: 35 },
    { id: 'hedge-trimming', name: 'Hedge Trimming', price: 45 },
    { id: 'garden-cleanup', name: 'Garden Cleanup', price: 60 },
    { id: 'planting', name: 'Planting Services', price: 75 },
    { id: 'full-maintenance', name: 'Full Maintenance', price: 120 }
  ];

  const frequencyOptions = [
    { id: 'weekly', name: 'Weekly', discount: 0 },
    { id: 'bi-weekly', name: 'Bi-Weekly', discount: 0 },
    { id: 'monthly', name: 'Monthly', discount: 5 },
    { id: 'one-time', name: 'One-Time', discount: 0 }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateTotal = () => {
    const selectedService = serviceOptions.find(s => s.id === formData.serviceType);
    const selectedFrequency = frequencyOptions.find(f => f.id === formData.frequency);
    
    let total = selectedService.price;
    if (selectedFrequency.discount > 0) {
      total = total - (total * selectedFrequency.discount / 100);
    }
    
    return total.toFixed(2);
  };

  const handlePaymentSuccess = (payment) => {
    setPaymentData(payment);
    setPaymentSuccess(true);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for choosing our gardening services. Your booking is confirmed.</p>
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <p className="text-green-800 font-medium">Payment Details</p>
            <div className="flex justify-between mt-2">
              <span className="text-gray-600">{serviceOptions.find(s => s.id === formData.serviceType).name}</span>
              <span className="font-medium">${calculateTotal()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-medium">{frequencyOptions.find(f => f.id === formData.frequency).name}</span>
            </div>
            {paymentData && (
              <div className="flex justify-between mt-1">
                <span className="text-gray-600">Receipt:</span>
                <span className="font-medium">{paymentData.receiptNumber}</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setPaymentSuccess(false)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Complete Your Gardening Service Booking
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Fill in your details to schedule your gardening service
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 md:flex">
            <div className="md:w-1/2 md:pr-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {serviceOptions.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} (${service.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {frequencyOptions.map(freq => (
                    <option key={freq.id} value={freq.id}>
                      {freq.name} {freq.discount > 0 ? `(${freq.discount}% discount)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Order Summary</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{serviceOptions.find(s => s.id === formData.serviceType).name}</span>
                  <span className="font-medium">${serviceOptions.find(s => s.id === formData.serviceType).price}</span>
                </div>
                {frequencyOptions.find(f => f.id === formData.frequency).discount > 0 && (
                  <div className="flex justify-between mb-1 text-green-600">
                    <span>Frequency Discount ({frequencyOptions.find(f => f.id === formData.frequency).discount}%)</span>
                    <span>-${(serviceOptions.find(s => s.id === formData.serviceType).price * frequencyOptions.find(f => f.id === formData.frequency).discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
              
              <div className="flex items-center mb-6">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-green-600 hover:text-green-700">terms and conditions</a>
                </label>
              </div>

              {formData.acceptTerms && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    amount={parseFloat(calculateTotal())}
                    paymentType="Full Payment"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;