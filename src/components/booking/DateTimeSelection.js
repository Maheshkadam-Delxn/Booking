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
  const frequencies = [
    { id: 'one-time', label: 'One-Time Service' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'bi-weekly', label: 'Bi-Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  useEffect(() => {
  const urlDate = searchParams.get('appointmentDate');
  const urlSlot = searchParams.get('timeSlot');
  const urlServiceId = searchParams.get('serviceId');

  // Reset if a different service is being selected
  if (urlServiceId && urlServiceId !== currentBooking.serviceId) {
    updateCurrentBooking({
      serviceId: urlServiceId,
      appointmentDate: '',
      timeSlot: '',
      startTime: '',
      endTime: '',
      frequency: 'one-time'
    });
    setSelectedDate('');
    setSelectedFrequency('one-time');
    return; // Exit early to avoid applying old slot/date
  }

  // Apply from URL if booking not already filled
  if (urlDate && !currentBooking.appointmentDate) {
    setSelectedDate(urlDate);
    updateCurrentBooking({ appointmentDate: urlDate });
  }

  if (urlSlot && !currentBooking.timeSlot) {
    updateCurrentBooking({ timeSlot: urlSlot });
  }

  if (
    urlDate && urlSlot &&
    !currentBooking.appointmentDate &&
    !currentBooking.timeSlot
  ) {
    updateCurrentBooking({ appointmentDate: urlDate, timeSlot: urlSlot });
  }
}, [searchParams, currentBooking, updateCurrentBooking]);



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
    <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Schedule Your Service</h2>

      {errorMessage && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm sm:text-base">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Select a Date</h3>
            <Card className="p-3 sm:p-4">
              <div className="mb-3 sm:mb-4">
                <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Service Frequency
                </label>
                <div className="space-y-1 sm:space-y-2">
                  {frequencies.map((frequency) => (
                    <label
                      key={frequency.id}
                      className="flex items-center p-2 sm:p-3 border rounded-md cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={frequency.id}
                        checked={selectedFrequency === frequency.id}
                        onChange={() => setSelectedFrequency(frequency.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 mr-2 sm:mr-3"
                      />
                      <span>{frequency.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Select a Time Slot</h3>
            <Card className="p-3 sm:p-4">
              <TimeSlotPicker 
                selectedDate={selectedDate}
                onTimeSelect={handleTimeSelect}
                selectedSlot={currentBooking.timeSlot}
                serviceId={currentBooking.serviceId}
              />
            </Card>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
          <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
            Back to Services
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 sm:px-6 rounded-lg disabled:opacity-50"
          >
            Continue to Details
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DateTimeSelection;