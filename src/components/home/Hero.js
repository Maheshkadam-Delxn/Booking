'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useDashboard } from '@/contexts/DashboardContext';
import { ArrowRight, Leaf, Calendar, Star, ChevronDown } from 'lucide-react';

const Hero = () => {
  const { userData, isLoading } = useDashboard();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    // { icon: <Leaf className="w-6 h-6" />, title: "Landscaping Excellence", description: "Expert design and installation for stunning outdoor" },
    { icon: <Calendar className="w-6 h-6" />, title: "Budgeted Maintenance", description: "Consistent care to keep your yard pristine" },
    { icon: <Star className="w-6 h-6" />, title: "Premium Service", description: "Good quality with attention to each detail" }
  ];

  useEffect(() => {
    const token = userData?.token || null;
    setIsLoggedIn(!!token);

    // Rotate through features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToBookingDetail = () => {
    const token = userData?.token;
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "customer") {
        router.push("/booking");
      } else {
        alert("Access Denied: You are not authorized to access this page.");
      }
    } catch (error) {
      console.error("Invalid token", error);
      router.push("/login");
    }
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          {/* Image option with modern parallax effect */}
          <div
            className="absolute inset-0 bg-cover bg-center h-full w-full transform scale-110"
            style={{
              backgroundImage: 'url(/images/landscaping-image.png)',
              animation: 'subtle-zoom 20s infinite alternate',
            }}
          ></div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
      </div>

      {/* Content area */}
      <div className="relative z-10 h-full flex flex-col justify-center pt-16">
        <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Text content */}
          <div className="text-white space-y-5 max-w-xl mt-10">

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
                Outdoor Space
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Professional landscaping and lawn care services customized to your needs.
              From regular maintenance to complete redesigns, we'll keep your yard
              looking its best all year round.
            </p>

            {/* Static Feature Card */}
            <div className="mt-1">
              <div className="bg-white rounded-lg p-4 border-2 border-green-200 inline-block">
                <div className="flex items-center space-x-3">
                  <div className="text-green-600 p-2 bg-green-50 rounded-full flex-shrink-0">
                    {features[activeFeature].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-green-800">{features[activeFeature].title}</h3>
                    <p className="text-sm text-green-600">{features[activeFeature].description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                onClick={goToBookingDetail}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group">
                Book Now
              </Button>
              <Link
                href="/admin/create-estimate"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:scale-105 transition-transform bg-white px-6 py-3"
                >
                  Request Estimate
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Visual element */}
          <div className="hidden md:block">
            <div className="relative mt-10">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-2xl"></div>

              {/* Card element - changed to light green background with border */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>

                {/* Sample content - replace with relevant info */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-green-800">Ready for a beautiful yard?</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-green-100">
                      <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-green-800 font-medium">Fast Scheduling</h4>
                        <p className="text-sm text-green-600">Book your service in just minutes</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-green-100">
                      <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-green-800 font-medium">Top-Rated Service</h4>
                        <p className="text-sm text-green-600">Trusted by homeowners across the region</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={goToBookingDetail}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
                  >
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>

      {/* Add custom keyframes animation */}
      <style jsx>{`
        @keyframes subtle-zoom {
          0% {
            transform: scale(1.1) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-5px, -5px);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;