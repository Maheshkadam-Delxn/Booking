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



'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimeSlotPicker = ({ selectedDate, onTimeSelect, selectedSlot, serviceId, theme = 'default' }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !serviceId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
        );
        
        // Transform the API response to match our expected format
        const formattedSlots = response.data.data.map(slot => ({
          startTime: slot.start,
          endTime: slot.end,
          available: true // Assuming all slots from this endpoint are available
        }));
        
        setTimeSlots(formattedSlots);
      } catch (err) {
        setError('Failed to load time slots');
        console.error('Error fetching time slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, serviceId, API_URL]);

  const handleSlotClick = (slot) => {
    if (slot.available) {
      onTimeSelect(slot.startTime, slot.endTime);
    }
  };

  if (!selectedDate) {
    return <div className="text-center py-4 text-gray-500">Please select a date first</div>;
  }

  if (loading) {
    return <div className="text-center py-4">Loading available slots...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (timeSlots.length === 0) {
    return <div className="text-center py-4 text-gray-500">No available time slots for this date</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {timeSlots.map((slot, index) => {
        const slotText = `${slot.startTime} - ${slot.endTime}`;
        const isSelected = selectedSlot === slotText;
        
        let buttonClass = '';
        let displayContent = slotText;
        
        if (theme === 'tree') {
          displayContent = slot.available ? '🌲' : '🪵';
          buttonClass = `text-2xl p-2 rounded-md text-center ${
            slot.available 
              ? 'hover:bg-green-50 cursor-pointer' 
              : 'cursor-not-allowed opacity-50'
          } ${
            isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`;
        } else {
          buttonClass = `p-2 border rounded-md text-center text-sm ${
            slot.available 
              ? 'hover:bg-gray-50 cursor-pointer' 
              : 'bg-gray-100 cursor-not-allowed opacity-50'
          } ${
            isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
          }`;
        }

        return (
          <button
            key={index}
            type="button"
            className={buttonClass}
            onClick={() => handleSlotClick(slot)}
            disabled={!slot.available}
            aria-label={slotText}
            title={slotText}
          >
            {theme === 'tree' ? (
              <div className="flex flex-col items-center">
                <span className="text-3xl">{displayContent}</span>
                <span className="text-xs mt-1">
                  {new Date(`2000-01-01T${slot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ) : (
              `${new Date(`2000-01-01T${slot.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(`2000-01-01T${slot.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;