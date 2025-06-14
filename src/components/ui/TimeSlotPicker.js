// // TimeSlotPicker.jsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TimeSlotPicker = ({ selectedDate, onTimeSelect, selectedSlot, serviceId }) => {
//     const [availableSlots, setAvailableSlots] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
//     useEffect(() => {
//       const fetchAvailableSlots = async () => {
//         if (!selectedDate || !serviceId) return;
        
//         try {
//           setLoading(true);
//           const response = await axios.get(
//             `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
//           );
//           setAvailableSlots(response.data.data);
//         } catch (error) {
//           console.error('Error fetching time slots:', error);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchAvailableSlots();
//     }, [selectedDate, serviceId]);
  
//   return (
//     <div className="grid grid-cols-2 gap-3">
//       {loading ? (
//         <div className="col-span-2 text-center py-4">Loading available slots...</div>
//       ) : availableSlots.length > 0 ? (
//         availableSlots.map((slot) => (
//           <button
//             key={slot.start}
//             type="button"
//             onClick={() => onTimeSelect(slot.start, slot.end)}
//             className={`p-3 text-center rounded-md border ${
//               selectedSlot === `${slot.start} - ${slot.end}`
//                 ? 'bg-green-500 text-white border-green-600'
//                 : 'bg-white hover:bg-gray-50 border-gray-300'
//             }`}
//           >
//             {new Date(`2000-01-01T${slot.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
//             {new Date(`2000-01-01T${slot.end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </button>
//         ))
//       ) : (
//         <div className="col-span-2 text-center py-4 text-gray-500">
//           No available time slots for this date
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeSlotPicker;



"use client";

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const TimeSlotPicker = ({ selectedDate,onTimeSelect, selectedSlot, serviceId, theme }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (selectedDate && serviceId) {
      fetchTimeSlots();
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, serviceId]);

  const fetchTimeSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTimeSlots(data.data || []);
      } else {
        throw new Error(data.error || 'No time slots available');
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError(err.message);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const getSlotEmoji = (available) => {
    if (theme === 'tree') {
      return available ? '🌲' : '🪵';
    }
    return available ? '✅' : '❌';
  };

  // const getSlotVariant = (slot) => {
  //   if (selectedSlot === `${slot.start} - ${slot.end}`) {
  //     return 'primary';
  //   }
  //   return slot.available ? 'outline' : 'disabled';
  // };

 const getSlotVariant = (slot) => {
    // Only show as selected if the slot matches AND we have a selected date
    if (selectedSlot === `${slot.start} - ${slot.end}` && selectedDate) {
      return 'primary';
    }
    return slot.available ? 'outline' : 'disabled';
  };
  
  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-3"></div>
          <p className="text-gray-600">Loading available time slots...</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 rounded-lg text-red-600 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((slot, index) => (
          <Button
            key={index}
            type="button"
            variant={getSlotVariant(slot)}
            onClick={() => slot.available && onTimeSelect(slot.start, slot.end)}
            disabled={!slot.available}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all h-24 w-full ${
              slot.available ? 'hover:shadow-md hover:-translate-y-0.5' : ''
            }`}
          >
            <span className="text-3xl mb-1">{getSlotEmoji(slot.available)}</span>
            <span className="text-sm font-medium">
              {slot.start} - {slot.end}
            </span>
            {!slot.available && (
              <span className="text-xs mt-1 text-gray-500">Booked</span>
            )}
          </Button>
        ))}
      </div>
      
      {!loading && timeSlots.length === 0 && !error && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">Please select a date to see available time slots</p>
        </div>
      )}
      
      {!loading && timeSlots.length === 0 && error && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No time slots available for this date</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;