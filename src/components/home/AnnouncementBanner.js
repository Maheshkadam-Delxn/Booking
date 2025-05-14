'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        // The base URL already includes /api/v1 at the end
        // We need to replace the /api/v1 prefix from all endpoints
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = `${baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'))}/api/v1/announcements/active`;
        
        console.log('Fetching announcement from:', apiUrl);
        const response = await axios.get(apiUrl);
        console.log('Announcement response:', response.data);
        
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
        if (error.response) {
          console.error('Error response:', error.response.status, error.response.data);
        }
      }
    };

    fetchActiveAnnouncement();
  }, []);

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="bg-green-50 border-green-500 border-l-4 p-4 mb-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-green-800">{announcement.title}</h3>
            <div className="mt-2 text-green-700">
              <p>{announcement.message}</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner; 