// TimeSlotPicker.jsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimeSlotPicker = ({ selectedDate, onTimeSelect, selectedSlot, serviceId }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
    useEffect(() => {
      const fetchAvailableSlots = async () => {
        if (!selectedDate || !serviceId) return;
        
        try {
          setLoading(true);
          const response = await axios.get(
            `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
          );
          setAvailableSlots(response.data.data);
        } catch (error) {
          console.error('Error fetching time slots:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAvailableSlots();
    }, [selectedDate, serviceId]);
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {loading ? (
        <div className="col-span-2 text-center py-4">Loading available slots...</div>
      ) : availableSlots.length > 0 ? (
        availableSlots.map((slot) => (
          <button
            key={slot.start}
            type="button"
            onClick={() => onTimeSelect(slot.start, slot.end)}
            className={`p-3 text-center rounded-md border ${
              selectedSlot === `${slot.start} - ${slot.end}`
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            {new Date(`2000-01-01T${slot.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
            {new Date(`2000-01-01T${slot.end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </button>
        ))
      ) : (
        <div className="col-span-2 text-center py-4 text-gray-500">
          No available time slots for this date
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;