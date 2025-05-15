"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        console.log('data', data);
        setServices(data.data); // Access the "data" property to get the array of services
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading services...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        <h3 className="text-lg font-medium text-red-800">Unable to load services</h3>
      </div>
      <p className="text-red-700 mb-4">{error}</p>
      <button
        onClick={() => {
          setLoading(true);
          setError(null);
        }}
        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderServices = () => (
    <>
      {services.map((service) => {
        // Extract all unique features from all packages
        const allFeatures = [
          ...new Set(
            service.packages?.flatMap(pkg => pkg.additionalFeatures || []) || []
          ),
        ];

        console.log(`Features for ${service.name}:`, allFeatures);

        return (
          <div
            key={service._id || service.id}
            className="mb-16 overflow-hidden group flex flex-col md:flex-row items-stretch bg-white shadow-md overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="w-full md:w-2/5 lg:w-1/3 relative">
              <img
                src={service.image?.url || '/api/placeholder/800/600'}
                alt={service.name}
                className="w-full h-72 rounded-xl object-cover object-center"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                {/* Optional: Add View Details */}
              </div>
            </div>
            <div className="w-full md:w-3/5 lg:w-2/3 p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">{service.name}</h2>
              <p className="text-gray-700 text-lg mb-6 flex-grow">{service.description}</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allFeatures.length > 0 ? (
                    allFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No additional features available.</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/contact">
                    <span className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                      Get a Quote
                    </span>
                  </Link>
                  <Link href={`/booknow?serviceId=${service._id}`}>
                    <span className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
                      Book Now
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <PageHeader
        title="Professional Landscaping Services"
        description="Creating and maintaining beautiful outdoor spaces for your home or business"
        backgroundImage="/images/services-header.jpg"
      />
      <Container className="py-12 md:py-20">
        {loading ? renderLoading() : error ? renderError() : renderServices()}
        <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl p-8 md:p-12 text-center mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Outdoor Space?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-green-50 text-lg">
            Contact us today for a free consultation and estimate. Our experts are ready to help you
            create and maintain the landscape of your dreams.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center bg-white text-green-800 hover:bg-green-50 font-medium py-2.5 px-6 rounded-lg transition-colors">
              Contact Us 
            </span>
          </Link>
        </div>
      </Container>
    </>
  );
}