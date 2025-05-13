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
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</h1>
          <p className="text-xl text-gray-600">
            Explore our completed landscaping projects and transformations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {completedProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                    <p className="text-green-600">{project.category}</p>
                    <p className="text-gray-500 mt-1">Completed: {project.date}</p>
                  </div>
                </div>

                {/* Before & After Photos */}
                <div className="space-y-6">
                  {/* Before Photos */}
                  {project.beforePhotos.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Before</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.beforePhotos.map((photo, index) => (
                          <div key={`before-${index}`} className="relative group">
                            <div className="aspect-w-16 aspect-h-9">
                              <img
                                src={photo.url}
                                alt={`Before ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            {photo.caption && (
                              <p className="text-sm text-gray-500 mt-1">{photo.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* After Photos */}
                  {project.afterPhotos.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">After</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.afterPhotos.map((photo, index) => (
                          <div key={`after-${index}`} className="relative group">
                            <div className="aspect-w-16 aspect-h-9">
                              <img
                                src={photo.url}
                                alt={`After ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            {photo.caption && (
                              <p className="text-sm text-gray-500 mt-1">{photo.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                {project.notes?.professional && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                    <p className="text-gray-700">{project.notes.professional}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default GalleryPage;