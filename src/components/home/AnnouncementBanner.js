'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isAttentionAnimating, setIsAttentionAnimating] = useState(false);

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
          // Small delay before showing to ensure smooth animation
          setTimeout(() => {
            setIsVisible(true);
            // Start attention animation after being visible
            setTimeout(() => {
              setIsAttentionAnimating(true);
              // Stop the attention animation after 2 seconds
              setTimeout(() => {
                setIsAttentionAnimating(false);
              }, 2000);
            }, 300);
          }, 300);
          
          // Hide the announcement after the specified duration
          if (response.data.displayDuration) {
            setTimeout(() => {
              handleDismiss();
            }, response.data.displayDuration * 1000);
          }
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

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for exit animation to complete before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!announcement || !isVisible) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 w-full max-w-md z-50 transform transition-all duration-300 ${
        isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      } ${isAttentionAnimating ? 'attention-animation' : ''}`}
    >
      <div className={`bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-green-500 ${
        isAttentionAnimating ? 'pulse-border' : ''
      }`}>
        <div className="p-4">
          <div className="flex items-start">
            {/* Notification icon with attention animation */}
            <div className={`flex-shrink-0 bg-green-100 rounded-full p-2 ${
              isAttentionAnimating ? 'icon-bounce' : ''
            }`}>
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="ml-3 w-0 flex-1">
              <h3 className="text-lg font-medium text-green-800">{announcement.title}</h3>
              <div className="mt-1 text-sm text-gray-700">
                <p>{announcement.message}</p>
              </div>
            </div>
            
            {/* Close button */}
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={handleDismiss}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for timed notifications */}
        {announcement.displayDuration && (
          <div className="bg-gray-100 h-1 w-full">
            <div 
              className="bg-green-500 h-1" 
              style={{
                width: '100%',
                animation: `shrink ${announcement.displayDuration}s linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      {/* Add keyframes for all animations */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes attention {
          0% { transform: translateY(0) scale(1); }
          10% { transform: translateY(-10px) scale(1.02); }
          20% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-6px) scale(1.01); }
          40% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.005); }
          60% { transform: translateY(0) scale(1); }
          100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes iconBounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulseBorder {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        
        .attention-animation {
          animation: attention 2s ease-in-out;
        }
        
        .icon-bounce {
          animation: iconBounce 1s ease-in-out infinite;
        }
        
        .pulse-border {
          animation: pulseBorder 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBanner;