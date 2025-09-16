'use client';

import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from '../payment/StripePaymentForm';
import { X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ isOpen, onClose, appointment, onSuccess }) => {
  if (!isOpen || !appointment) return null;

  const handlePaymentSuccess = (paymentData) => {
    onSuccess?.(paymentData);
    onClose();
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Collect Payment</h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-green-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Appointment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Appointment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Service:</span>
                <p className="font-medium">{appointment.service?.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Customer:</span>
                <p className="font-medium">{appointment.customer?.user?.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Amount:</span>
                <p className="font-medium text-green-600">${appointment.payment?.amount || '0.00'}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              amount={appointment.payment?.amount || 0}
              paymentType="service"
              customerId={appointment.customer?._id}
              appointmentId={appointment._id}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;