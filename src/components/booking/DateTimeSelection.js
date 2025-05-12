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
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Extract start and end times from selected time slot
    const [startTime, endTime] = selectedTime.split(' - ');
  
    // Update the store with the new booking details
    updateCurrentBooking({
      appointmentDate: selectedDate,
      startTime,
      endTime,
      frequency: selectedFrequency
    });
  
    onNext(); // Move to the next step
  };
  
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Schedule Your Service</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Select a Date</h3>
            <Card className="p-4">
              {/* This would be a real calendar picker in a production app */}
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
                  min={new Date().toISOString().split('T')[0]} // Ensure no past dates are selected
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
          <Button type="submit">
            Continue to Details
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DateTimeSelection;
