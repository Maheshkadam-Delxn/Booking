'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ProjectPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments/${params.id}`);
        const appointment = response.data.data;

        if (!appointment || appointment.status !== 'Completed') {
          toast.error('Project not found');
          return;
        }

        setProject({
          id: appointment._id,
          title: appointment.service?.name || 'Landscaping Project',
          category: appointment.service?.category || 'Landscaping',
          date: new Date(appointment.date).toLocaleDateString(),
          beforePhotos: appointment.photos?.beforeService || [],
          afterPhotos: appointment.photos?.afterService || [],
          customer: appointment.customer,
          service: appointment.service,
          notes: appointment.notes
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <Link href="/gallery">
              <span className="text-green-600 hover:text-green-700">
                Return to Gallery
              </span>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Link href="/gallery">
            <span className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Gallery
            </span>
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <p className="text-green-600">{project.category}</p>
                <p className="text-gray-500 mt-1">Completed: {project.date}</p>
              </div>

              {/* Before & After Photos */}
              <div className="space-y-8">
                {/* Before Photos */}
                {project.beforePhotos.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Before</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <p className="text-sm text-gray-500 mt-2">{photo.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* After Photos */}
                {project.afterPhotos.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">After</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <p className="text-sm text-gray-500 mt-2">{photo.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Project Details */}
              {project.notes?.professional && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Details</h2>
                  <p className="text-gray-700 whitespace-pre-line">{project.notes.professional}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProjectPage; 