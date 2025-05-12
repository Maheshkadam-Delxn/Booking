"use client";

import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';

const DateTimeSelection = ({ onNext, onBack }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const [selectedDate, setSelectedDate] = useState(currentBooking.date || '');
  const [selectedTime, setSelectedTime] = useState(currentBooking.timeSlot || '');
  const [selectedFrequency, setSelectedFrequency] = useState(currentBooking.frequency || 'one-time');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock available times
  const availableTimes = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM'
  ];

  // Mock available frequencies
  const frequencies = [
    { id: 'one-time', label: 'One-Time Service' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'bi-weekly', label: 'Bi-Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const [startTime, endTime] = selectedTime.split(' - ');

    try {
      const response = await fetch('http://localhost:5000/api/v1/appointments/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime,
          endTime
        })
      });

      const data = await response.json();

      if (!data.success || !data.available) {
        setErrorMessage(data.message || 'Selected time slot is not available. Please choose another.');
        return;
      }

      // Update the store with the new booking details
      updateCurrentBooking({
        appointmentDate: selectedDate,
        startTime,
        endTime,
        frequency: selectedFrequency
      });

      onNext(); // Move to the next step
    } catch (error) {
      console.error('Error checking availability:', error);
      setErrorMessage('An error occurred while checking availability. Please try again.');
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Schedule Your Service</h2>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Select a Date</h3>
            <Card className="p-4">
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Frequency
                </label>
                <div className="space-y-2">
                  {frequencies.map((frequency) => (
                    <label
                      key={frequency.id}
                      className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={frequency.id}
                        checked={selectedFrequency === frequency.id}
                        onChange={() => setSelectedFrequency(frequency.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 mr-3"
                      />
                      <span>{frequency.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Select a Time Slot</h3>
            <Card className="p-4">
              <div className="space-y-2">
                {availableTimes.map((time) => (
                  <label
                    key={time}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedTime === time ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={time}
                      checked={selectedTime === time}
                      onChange={() => setSelectedTime(time)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 mr-3"
                      required
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Services
          </Button>
          <Button type="submit">Continue to Details</Button>
        </div>
      </form>
    </div>
  );
};

export default DateTimeSelection;
