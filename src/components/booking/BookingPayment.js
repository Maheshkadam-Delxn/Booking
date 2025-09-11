'use client';

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../lib/stripe';
import StripePaymentForm from '../payment/StripePaymentForm';
import useStore from '../../lib/store';
import { useDashboard } from '../../contexts/DashboardContext';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import axios from 'axios';

const BookingPayment = ({ onBack }) => {
  const router = useRouter();
  const { userData } = useDashboard();
  const { currentBooking, resetCurrentBooking } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const stripePromise = getStripe();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createAppointment = async () => {
    try {
      setIsProcessing(true);
      
      // First create the appointment
      const appointmentData = {
        service: currentBooking.serviceId,
        date: currentBooking.appointmentDate,
        timeSlot: {
          startTime: currentBooking.startTime,
          endTime: currentBooking.endTime,
        },
        notes: currentBooking.notes || "",
        frequency: currentBooking.frequency || "one-time",
      };

      const response = await axios.post(
        `${API_URL}/appointments`,
        appointmentData,
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );

      if (response.status === 201) {
        setAppointmentId(response.data.data._id);
        return response.data.data._id;
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (payment) => {
    // Payment successful, redirect to confirmation
    router.push('/booking/confirmation');
    resetCurrentBooking();
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };

  const calculateAmount = () => {
    return currentBooking?.selectedService?.basePrice || 0;
  };

  if (!currentBooking?.selectedService) {
    return (
      <div className="py-8 bg-emerald-50 min-h-screen px-4 md:px-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Error</h2>
          <p className="text-gray-700 mb-4">No service selected. Please start over.</p>
          <Button onClick={() => router.push('/booking')}>Start New Booking</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-emerald-50 min-h-screen px-4 md:px-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6">Complete Your Payment</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <Card className="bg-white border border-emerald-100 shadow-md">
          <Card.Header className="bg-emerald-100 px-6 py-4 rounded-t-lg">
            <h3 className="text-xl font-semibold text-emerald-900">Booking Summary</h3>
          </Card.Header>
          <Card.Content className="px-6 py-5">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{currentBooking.selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(currentBooking.appointmentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {currentBooking.startTime} - {currentBooking.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{currentBooking.selectedService.duration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">{currentBooking.frequency || 'One-time'}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-emerald-600">${calculateAmount()}</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Payment Form */}
        <Card className="bg-white border border-emerald-100 shadow-md">
          <Card.Header className="bg-emerald-100 px-6 py-4 rounded-t-lg">
            <h3 className="text-xl font-semibold text-emerald-900">Payment Details</h3>
          </Card.Header>
          <Card.Content className="px-6 py-5">
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                amount={calculateAmount()}
                paymentType="Full Payment"
                appointmentId={appointmentId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onBeforePayment={createAppointment}
              />
            </Elements>
          </Card.Content>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Review
        </Button>
      </div>
    </div>
  );
};

export default BookingPayment;