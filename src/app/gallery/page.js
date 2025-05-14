'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';

const GalleryPage = () => {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
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
          customer: appointment.customer,
          service: appointment.service,
          notes: appointment.notes
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading our beautiful projects...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <Container>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-green-600">Transformation</span> Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Witness the stunning before-and-after results of our landscaping expertise
          </p>
          <div className="mt-6 h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {completedProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No projects to display yet</h3>
            <p className="text-gray-500">Completed projects with photos will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {completedProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-green-600 uppercase tracking-wider">{project.category}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{project.title}</h2>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Completed: {project.date}
                    </div>
                  </div>

                  {/* Before & After Sections */}
                  <div className="space-y-8">
                    {/* Before Photos */}
                    {project.beforePhotos.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-gray-800">Before</h3>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.beforePhotos.map((photo, index) => (
                            <div 
                              key={`before-${index}`} 
                              className="relative group overflow-hidden rounded-lg shadow-sm"
                            >
                              <div className="aspect-w-16 aspect-h-10 bg-gray-100">
                                <img
                                  src={photo.url}
                                  alt={`Before ${index + 1}`}
                                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                {photo.caption && (
                                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* After Photos */}
                    {project.afterPhotos.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-gray-800">After</h3>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.afterPhotos.map((photo, index) => (
                            <div 
                              key={`after-${index}`} 
                              className="relative group overflow-hidden rounded-lg shadow-sm"
                            >
                              <div className="aspect-w-16 aspect-h-10 bg-gray-100">
                                <img
                                  src={photo.url}
                                  alt={`After ${index + 1}`}
                                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                {photo.caption && (
                                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  {project.notes?.professional && (
                    <div className="mt-8 p-5 bg-green-50 rounded-lg border border-green-100">
                      <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                        </svg>
                        Project Notes
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{project.notes.professional}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default GalleryPage;