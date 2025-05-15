'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';

const GalleryPage = () => {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments?status=Completed`);
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
          notes: appointment.notes,
          thumbnail: appointment.photos?.afterService?.[0]?.url ||
                     appointment.photos?.beforeService?.[0]?.url || ''
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

  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <Container>
          <div className="text-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Loading our beautiful transformations...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <PageHeader
        title="Transformation Gallery"
        description="Explore our portfolio of beautiful landscapes and outdoor transformations"
        backgroundImage="/images/services-header.jpg"
      />
      <Container>
        {/* View Controls */}
        <div className="flex justify-between items-center mb-8 py-5 flex-wrap gap-4">
          <p className="text-gray-700">
            <span className="font-semibold">{completedProjects.length}</span> completed projects
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} transition-colors`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} transition-colors`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {completedProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No projects to display yet</h3>
            <p className="text-gray-500">Completed projects with photos will appear here</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      <span className="text-xs font-medium uppercase tracking-wider">{project.category}</span>
                    </div>
                    <h3 className="font-bold text-lg truncate">{project.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.date}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {project.beforePhotos.length + project.afterPhotos.length} Photos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {completedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => openProjectDetails(project)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 lg:w-1/4">
                    <div className="aspect-video bg-gray-100 h-full">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5 md:w-2/3 lg:w-3/4">
                    <div className="flex flex-col md:flex-row justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-xs font-medium text-green-600 uppercase tracking-wider">{project.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      </div>
                      <div className="mt-2 md:mt-0 text-sm text-gray-500">{project.date}</div>
                    </div>
                    {project.notes?.professional && (
                      <p className="text-gray-600 line-clamp-2 mb-3">{project.notes.professional}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{project.beforePhotos.length + project.afterPhotos.length} Photos</span>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium hover:text-green-700">View Details →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100 flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">{selectedProject.title}</h2>
                <button
                  onClick={closeProjectDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-green-600 uppercase tracking-wider">{selectedProject.category}</span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Completed: {selectedProject.date}
                  </div>
                </div>

                {/* Before & After Sections */}
                <div className="space-y-8">
                  {selectedProject.beforePhotos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">Before</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject.beforePhotos.map((photo, index) => (
                          <div key={`before-${index}`} className="relative overflow-hidden rounded-lg shadow-sm group">
                            <div className="aspect-video bg-gray-100">
                              <img
                                src={photo.url}
                                alt={`Before ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            {photo.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                                {photo.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.afterPhotos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">After</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject.afterPhotos.map((photo, index) => (
                          <div key={`after-${index}`} className="relative overflow-hidden rounded-lg shadow-sm group">
                            <div className="aspect-video bg-gray-100">
                              <img
                                src={photo.url}
                                alt={`After ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            {photo.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                                {photo.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedProject.notes?.professional && (
                  <div className="mt-8 p-5 bg-green-50 rounded-lg border border-green-100">
                    <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                      </svg>
                      Project Notes
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedProject.notes.professional}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default GalleryPage;