"use client";
import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import getStripe from '../../../lib/stripe';
import StripePaymentForm from '../../../components/payment/StripePaymentForm';
import { toast } from 'react-hot-toast';
import { useDashboard } from '@/contexts/DashboardContext';
import axios from 'axios';

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const { userData } = useDashboard();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const stripePromise = getStripe();

  useEffect(() => {
    if (appointmentId && userData?.token) {
      fetchAppointment();
    } else if (!appointmentId) {
      setLoading(false);
    }
  }, [appointmentId, userData]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setAppointment(response.data.data);
    } catch (error) {
      toast.error('Failed to load appointment details');
      router.push('/customers/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (payment) => {
    setPaymentData(payment);
    setPaymentSuccess(true);
    setTimeout(() => {
      router.push('/customers/appointments');
    }, 3000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <p className="text-green-800 font-medium">Payment Details</p>
            <div className="flex justify-between mt-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{appointment?.service?.name}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${appointment?.payment?.amount}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Redirecting to appointments...</p>
          <button 
            onClick={() => router.push('/customers/appointments')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  if (appointmentId && !appointment) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Appointment not found</p>
          <button 
            onClick={() => router.push('/customers/appointments')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Back to Appointments
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
            Complete Payment
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Pay for your completed gardening service
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8 md:flex">
            <div className="md:w-1/2 md:pr-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Details</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service</label>
                  <p className="text-gray-900">{appointment.service?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-gray-900">{appointment.status}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Summary</h3>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{appointment.service?.name}</span>
                  <span className="font-medium">${appointment.payment?.amount}</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${appointment.payment?.amount}</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
              
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  amount={parseFloat(appointment.service?.basePrice || appointment.payment?.amount || 50)}
                  paymentType="Full Payment"
                  customerId={appointment.customer?._id}
                  appointmentId={appointment._id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;