'use client';
import { useState, useEffect } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const GalleryManager = () => {
  const { userData } = useDashboard();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'residential',
    projectDate: '',
    clientName: '',
    projectDuration: '',
    tags: '',
    status: 'draft',
    images: []
  });

  // Fetch galleries
  const fetchGalleries = async () => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/gallery`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.data.success) {
        setGalleries(response.data.data);
      } else {
        toast.error('Failed to fetch galleries');
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [userData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formDataToSend = new FormData();
    files.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      const response = await axios.post(`${API_URL}/gallery`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.data.success) {
        toast.success('Images uploaded successfully');
        fetchGalleries();
      } else {
        toast.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    }
  };

  // Handle gallery creation
  const handleCreateGallery = async (e) => {
    e.preventDefault();
    
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.location || 
        !formData.category || !formData.projectDate) {
      toast.error('Please fill all required fields');
      return;
    }
  
    const formDataToSend = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Append image files with proper field name
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });
    }
  
    try {
      const response = await axios.post(`${API_URL}/gallery`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`,
        },
        timeout: 30000, // 30-second timeout
      });
      
      if (response.data.success) {
        toast.success('Gallery created successfully');
        setIsModalOpen(false);
        fetchGalleries();
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to create gallery');
      }
    } catch (error) {
      console.error('Full error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Error response data:', error.response.data);
        toast.error(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error request:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        // Something happened in setting up the request
        console.log('Error message:', error.message);
        toast.error(error.message || 'Network error occurred');
      }
    }
  };

  // Handle gallery update
  const handleUpdateGallery = async (e) => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    e.preventDefault();

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'tags' && typeof formData[key] === 'string') {
        formDataToSend.append(key, formData[key].split(',').map((tag) => tag.trim()));
      } else if (key === 'images') {
        // Only append new images (if any)
        if (formData[key].some(file => file instanceof File)) {
          formData[key].forEach((file) => {
            if (file instanceof File) {
              formDataToSend.append('images', file);
            }
          });
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.put(`${API_URL}/gallery/${selectedGallery._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.data.success) {
        toast.success('Gallery updated successfully');
        setIsModalOpen(false);
        fetchGalleries();
        resetForm();
      } else {
        toast.error('Failed to update gallery');
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      toast.error(error.response?.data?.message || 'Failed to update gallery');
    }
  };

  // Handle gallery deletion
  const handleDeleteGallery = async (id) => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this gallery?')) {
      try {
        const response = await axios.delete(`${API_URL}/gallery/${id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        if (response.data.success) {
          toast.success('Gallery deleted successfully');
          fetchGalleries();
        } else {
          toast.error('Failed to delete gallery');
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        toast.error(error.response?.data?.message || 'Failed to delete gallery');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'residential',
      projectDate: '',
      clientName: '',
      projectDuration: '',
      tags: '',
      status: 'draft',
      images: []
    });
    setSelectedGallery(null);
  };

  // Open modal for editing
  const handleEdit = (gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      location: gallery.location,
      category: gallery.category,
      projectDate: new Date(gallery.projectDate).toISOString().split('T')[0],
      clientName: gallery.clientName || '',
      projectDuration: gallery.projectDuration || '',
      tags: gallery.tags.join(', '),
      status: gallery.status,
      images: gallery.images
    });
    setIsModalOpen(true);
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header with Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gallery Items</h2>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Add New Gallery
          </Button>
        </div>
        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No galleries found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {gallery.images[0] && (
                  <img
                    src={gallery.images[0].url}
                    alt={gallery.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{gallery.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(gallery.projectDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(gallery)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteGallery(gallery._id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Modal for Add/Edit Gallery */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">
                {selectedGallery ? 'Edit Gallery' : 'Add New Gallery'}
              </h3>
              <form onSubmit={selectedGallery ? handleUpdateGallery : handleCreateGallery}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="event">Event</option>
                        <option value="landscaping">Landscaping</option>
                        <option value="garden">Garden</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Date</label>
                      <input
                        type="date"
                        name="projectDate"
                        value={formData.projectDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client Name</label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Duration</label>
                      <input
                        type="text"
                        name="projectDuration"
                        value={formData.projectDuration}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
  type="file"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files // Make sure these are actual File objects
    }));
  }}
/>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {selectedGallery ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default GalleryManager;