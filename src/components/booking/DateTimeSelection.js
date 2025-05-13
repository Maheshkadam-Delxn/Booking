"use client";

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';
import TimeSlotPicker from '../ui/TimeSlotPicker';
import { useSearchParams } from 'next/navigation';

const DateTimeSelection = ({ onNext, onBack }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const [selectedDate, setSelectedDate] = useState(currentBooking.appointmentDate || '');
  const [selectedFrequency, setSelectedFrequency] = useState(currentBooking.frequency || 'one-time');
  const [errorMessage, setErrorMessage] = useState('');

  const searchParams = useSearchParams();
// const [errorMessage, setErrorMessage] = useState('');
  const frequencies = [
    { id: 'one-time', label: 'One-Time Service' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'bi-weekly', label: 'Bi-Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  // Auto-skip logic for existing booking data or URL params
  useEffect(() => {
    const urlDate = searchParams.get('appointmentDate');
    const urlSlot = searchParams.get('timeSlot');

    if (urlDate && !currentBooking.appointmentDate) {
      setSelectedDate(urlDate);
      updateCurrentBooking({ appointmentDate: urlDate });
    }

    if (urlSlot && !currentBooking.timeSlot) {
      updateCurrentBooking({ timeSlot: urlSlot });
    }

    // If already selected, skip this step
    if (currentBooking.appointmentDate && currentBooking.timeSlot) {
      onNext(); // Skip to the next step
    }
  }, [searchParams, currentBooking, updateCurrentBooking, onNext]);

  const handleTimeSelect = (startTime, endTime) => {
    updateCurrentBooking({ 
      startTime,
      endTime,
      timeSlot: `${startTime} - ${endTime}`
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !currentBooking.timeSlot) {
      setErrorMessage("Please select both a date and a time slot.");
      return;
    }
    updateCurrentBooking({
      appointmentDate: selectedDate,
      frequency: selectedFrequency
    });
    onNext();
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
                  min={new Date().toISOString().split('T')[0]}
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
              <TimeSlotPicker 
                selectedDate={selectedDate}
                onTimeSelect={handleTimeSelect}
                selectedSlot={currentBooking.timeSlot}
                serviceId={currentBooking.serviceId}
              />
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Services
          </Button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-6 rounded-lg disabled:opacity-50"
          >
            Continue to Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateTimeSelection;
