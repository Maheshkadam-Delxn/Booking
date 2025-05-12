'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';
import axios from 'axios';
import { useDashboard } from '../../contexts/DashboardContext';

const CustomerDetails = ({ onNext, onBack }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const { userData } = useDashboard();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    propertyDetails: '',
    servicePreferences: '',
    notificationPreferences: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full user profile
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userData?.token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        const user = response.data.data;

        setFormData((prev) => ({
          ...prev,
          customerName: user.name || '',
          customerEmail: user.email || '',
          customerPhone: user.phone || '',
        }));
      } catch (err) {
        console.error('Failed to fetch user details', err);
        setError('Failed to fetch user information');
      }
    };

    fetchUserDetails();
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userData?.id || !userData?.token) {
      setError('Authentication error - please log in again');
      setLoading(false);
      return;
    }

    try {
      const appointmentData = {
        // customer: userData.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: formData.address,
        propertyDetails: formData.propertyDetails,
        servicePreferences: formData.servicePreferences,
        notificationPreferences: formData.notificationPreferences,
        notes: formData.notes,
        service: currentBooking.serviceId,
        date: currentBooking.appointmentDate,
        timeSlot: {
          startTime: currentBooking.startTime,
          endTime: currentBooking.endTime,
        },
      };

      const response = await axios.post(
        'http://localhost:5000/api/v1/appointments',
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        updateCurrentBooking(formData);
        onNext();
      } else {
        setError('Failed to create appointment');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'An error occurred while creating the appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {/* Render form fields here */}
        <input
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        {/* Add other fields similarly */}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button type="button" onClick={onBack}>Back</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Next'}
        </Button>
      </form>
    </Card>
  );
};

export default CustomerDetails;
