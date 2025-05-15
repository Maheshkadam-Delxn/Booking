'use client';

import React, { useState, useEffect } from 'react';
import Container from '../ui/Container';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';

const Portfolio = () => {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments?status=Completed`);
        
        // Filter appointments that have photos
        const projectsWithPhotos = response.data.data.filter(
          appointment => 
            (appointment.photos?.beforeService?.length > 0 || 
            appointment.photos?.afterService?.length > 0)
        ).map(appointment => ({
          id: appointment._id,
          title: appointment.service?.name || 'Landscaping Project',
          category: appointment.service?.category || 'Landscaping',
          date: new Date(appointment.date).toLocaleDateString(),
          beforePhotos: appointment.photos?.beforeService || [],
          afterPhotos: appointment.photos?.afterService || [],
          // Use the first "after" photo as the main display photo, fallback to "before" photo
          mainImage: appointment.photos?.afterService?.[0]?.url || 
                    appointment.photos?.beforeService?.[0]?.url
        }));

        setCompletedProjects(projectsWithPhotos);
      } catch (error) {
        console.error('Error fetching completed projects:', error);
        toast.error('Failed to load portfolio projects');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedAppointments();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolio...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <span className="inline-block mb-4 text-green-600 font-semibold">Our Work</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Showcase</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our collection of beautifully transformed outdoor spaces that showcase our craftsmanship and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {completedProjects.slice(0, 6).map((project) => (
            <div key={project.id} className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative overflow-hidden h-64">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span className="text-white/90 text-sm font-medium">{project.category}</span>
                    <h3 className="text-white font-bold text-xl mt-1">{project.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Completed: {project.date}</p>
                <div className="mt-auto">
                  <Link href={`/gallery/${project.id}`}>
                    <button className="w-full py-2 px-4 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completedProjects.length > 6 && (
          <div className="mt-16 text-center">
            <Link href="/gallery">
              <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-sm">
                View Full Portfolio
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Portfolio;