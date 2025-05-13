'use client';

import React, { useState, useEffect } from 'react';
import Container from '../ui/Container';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';

const Gallery = () => {
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
        toast.error('Failed to load gallery projects');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedAppointments();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Project Gallery</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our portfolio of completed landscaping projects and get inspired for
            your own outdoor transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {completedProjects.slice(0, 6).map((project) => (
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative group">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-xl mb-2">{project.title}</h3>
                    <Link href={`/gallery/${project.id}`}>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
                        View Project
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <span className="text-sm text-green-600 font-medium">{project.category}</span>
                <h3 className="font-bold text-gray-900 text-lg mt-1">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Completed: {project.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/gallery">
            <span className="inline-block bg-white border border-green-600 text-green-600 px-6 py-3 rounded-md font-medium hover:bg-green-600 hover:text-white transition-colors duration-300">
              View All Projects
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default Gallery;
