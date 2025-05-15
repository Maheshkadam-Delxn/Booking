"use client";

import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useStore from '../../lib/store';
import { useSearchParams } from 'next/navigation';

const ServiceSelection = ({ onNext }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;

  const searchParams = useSearchParams();

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`);
      const data = await response.json();
      setServices(data.data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Only handle URL parameters, don't auto-skip
  useEffect(() => {
    const urlServiceId = searchParams.get('serviceId');
    if (urlServiceId) {
      const selectedService = services.find(service => service._id === urlServiceId);
      if (selectedService) {
        updateCurrentBooking({ 
          serviceId: urlServiceId,
          selectedService: selectedService 
        });
      }
    }
  }, [searchParams, updateCurrentBooking, services]);

  const handleSelectService = (serviceId) => {
    const selectedService = services.find(service => service._id === serviceId);
    updateCurrentBooking({ 
      serviceId,
      selectedService // Store the full service object
    });
    console.log("Selected service:", selectedService);
    onNext();
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Select a Service</h2>

      {loading ? (
        <p>Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service._id} 
              hoverable 
              className={`cursor-pointer h-full transition-all ${
                currentBooking.serviceId === service._id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => handleSelectService(service._id)}
            >
              <div className="aspect-[16/9] bg-gray-100 rounded-t-md overflow-hidden">
                <img
                  src={service.image.url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>

              <div className="px-4 pb-4">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click firing too
                    handleSelectService(service._id);
                  }}
                >
                  Select Service
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;




