"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  CheckCircle, 
  Clock, 
  CalendarDays, 
  Phone, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';
import Container from '../../../components/ui/Container';

// Define your API URL - replace with your actual API URL in your environment variables
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com/api/v1';

export default function ServiceDetail() {
  const router = useRouter();
  const { id } = useParams();

  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  useEffect(() => {
    // Only fetch if ID is available (after hydration)
    if (id) {
      fetchServiceDetail();
    }
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service details (${response.status})`);
      }

      const data = await response.json();
      
      if (data.data) {
        setService(data.data);
        
        // Also fetch related services (assuming the API might return related services or we fetch all)
        const relatedResponse = await fetch(`${API_URL}/services?limit=3`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out the current service and limit to 3
          const filtered = relatedData.data
            .filter(item => item.id !== id)
            .slice(0, 3);
          setRelatedServices(filtered);
        }
      } else {
        throw new Error('Service data not found');
      }
    } catch (err) {
      console.error('Error fetching service detail:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading service details...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        <h3 className="text-lg font-medium text-red-800">Error Loading Service</h3>
      </div>
      <p className="text-red-700 mb-4">{error}</p>
      <div className="flex gap-4">
        <button 
          onClick={fetchServiceDetail}
          className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
        <Link href="/services">
          <span className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors">
            Back to Services
          </span>
        </Link>
      </div>
    </div>
  );

  const renderServiceDetail = () => (
    <>
      {/* Back button */}
      <div className="mb-6">
        <Link href="/services">
          <span className="inline-flex items-center text-green-700 hover:text-green-800 font-medium">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to All Services
          </span>
        </Link>
      </div>

      {/* Service Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-10">
        <div className="aspect-[21/9] md:aspect-[21/6] w-full">
          <img 
            src={service.image || '/api/placeholder/1200/400'} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 md:p-10 w-full">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-4xl mb-4">
              {service.icon}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* Service Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">About this Service</h2>
            
            {service.longDescription && (
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {service.longDescription}
                </p>
              </div>
            )}

            {/* If the service doesn't have a longDescription, we'll use the description as fallback */}
            {!service.longDescription && (
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}

            {/* Features/Benefits Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-green-700 mb-4">Features & Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {service.highlights && service.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Section (Mock data - replace with actual data if available) */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-green-700 mb-6">Our Process</h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Initial Consultation", description: "We'll assess your needs and provide a detailed quote." },
                  { step: 2, title: "Service Planning", description: "Our team develops a comprehensive plan tailored to your specific requirements." },
                  { step: 3, title: "Professional Execution", description: "Skilled technicians carry out the service with attention to detail." },
                  { step: 4, title: "Quality Inspection", description: "We ensure all work meets our high standards before completion." }
                ].map((item, idx) => (
                  <div key={idx} className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQs Section (Mock data - replace with actual data if available) */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { 
                  question: "How often should I schedule this service?", 
                  answer: "The frequency depends on your specific needs and local conditions. For most clients, we recommend regular maintenance every 2-4 weeks during growing seasons." 
                },
                { 
                  question: "What areas do you service?", 
                  answer: "We currently provide our services to the entire metropolitan area and surrounding suburbs within a 30-mile radius." 
                },
                { 
                  question: "Do you provide emergency services?", 
                  answer: "Yes, we offer emergency services for urgent situations. Please contact our customer service line directly for immediate assistance." 
                },
                { 
                  question: "Are your services environmentally friendly?", 
                  answer: "Absolutely! We use eco-friendly products and sustainable practices whenever possible to minimize environmental impact while maintaining excellent results." 
                }
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h4>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pricing & Schedule Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="bg-green-800 text-white p-6">
              <h3 className="text-xl font-bold mb-2">Ready to Book?</h3>
              <p>Get your service scheduled today</p>
            </div>
            <div className="p-6">
              {/* Service info */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Duration: 1-3 hours (typical)</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Next available: Within 48 hours</span>
                </div>
              </div>

              {/* Price estimate */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-gray-600">Starting from</span>
                  <span className="text-2xl font-semibold text-green-700">$149</span>
                </div>
                <p className="text-xs text-gray-500">Final price may vary based on property size and specific requirements</p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Link href="/schedule">
                  <span className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors">
                    Schedule Service
                  </span>
                </Link>
                <Link href="/contact">
                  <span className="block w-full bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 text-center font-semibold py-3 px-4 rounded-lg transition-colors">
                    Request a Quote
                  </span>
                </Link>
              </div>

              {/* Contact options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-3">Need more information?</p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-500 mr-3" />
                    <a href="tel:555-123-4567" className="text-green-700 hover:text-green-800 font-medium">
                      (555) 123-4567
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-500 mr-3" />
                    <a href="#chat" className="text-green-700 hover:text-green-800 font-medium">
                      Live Chat Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-green-800 mb-8">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((relatedService) => (
              <div key={relatedService.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[16/9] w-full">
                  <img 
                    src={relatedService.image || '/api/placeholder/400/225'} 
                    alt={relatedService.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex text-green-600 text-2xl flex-shrink-0 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                      {relatedService.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{relatedService.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{relatedService.description}</p>
                  <Link href={`/services/${relatedService.id}`}>
                    <span className="inline-flex items-center text-green-700 hover:text-green-800 font-medium">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl p-8 md:p-12 text-center mt-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-8 max-w-2xl mx-auto text-green-50 text-lg">
          Contact us today for a free consultation and estimate. Let our experts help you achieve the results you're looking for.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact">
            <span className="inline-block bg-white text-green-800 hover:bg-green-50 font-medium py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </span>
          </Link>
          <Link href="/schedule">
            <span className="inline-block bg-green-600 text-white hover:bg-green-500 font-medium py-3 px-8 rounded-lg transition-colors">
              Schedule Now
            </span>
          </Link>
        </div>
      </div>
    </>
  );

  // If router is not ready yet, show minimal loading
  if (!router.isReady) {
    return (
      <Container className="py-12">
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      {loading ? renderLoading() : error ? renderError() : service ? renderServiceDetail() : null}
    </Container>
  );
}