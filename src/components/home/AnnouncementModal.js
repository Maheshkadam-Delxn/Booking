'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnouncementModal = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/announcements/active`);
        if (response.data) {
          setAnnouncement(response.data);
          setIsVisible(true);
          // Hide the announcement after the specified duration
          setTimeout(() => {
            setIsVisible(false);
          }, response.data.displayDuration * 1000);
        }
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    fetchActiveAnnouncement();
  }, []);

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{announcement.title}</h3>
          <p className="text-gray-600">{announcement.message}</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal; 