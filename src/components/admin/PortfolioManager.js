'use client';
import { useState, useEffect } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const PortfolioManager = () => {
  const { userData } = useDashboard();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    serviceType: 'landscaping',
    projectDate: '',
    clientName: '',
    projectDuration: '',
    projectCost: '',
    projectSize: '',
    challenges: '',
    solutions: '',
    customerFeedback: '',
    tags: '',
    status: 'draft',
    images: []
  });

  // Fetch portfolios
  const fetchPortfolios = async () => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/portfolio`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.data.success) {
        setPortfolios(response.data.data);
      } else {
        toast.error('Failed to fetch portfolios');
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [userData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle portfolio creation
  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.location || 
        !formData.serviceType || !formData.projectDate) {
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
      const response = await axios.post(`${API_URL}/portfolio`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`,
        },
        timeout: 30000, // 30-second timeout
      });
      
      if (response.data.success) {
        toast.success('Portfolio created successfully');
        setIsModalOpen(false);
        fetchPortfolios();
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to create portfolio');
      }
    } catch (error) {
      console.error('Full error:', error);
      
      if (error.response) {
        console.log('Error response data:', error.response.data);
        toast.error(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        console.log('Error request:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        console.log('Error message:', error.message);
        toast.error(error.message || 'Network error occurred');
      }
    }
  };

  // Handle portfolio update
  const handleUpdatePortfolio = async (e) => {
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
      const response = await axios.put(`${API_URL}/portfolio/${selectedPortfolio._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.data.success) {
        toast.success('Portfolio updated successfully');
        setIsModalOpen(false);
        fetchPortfolios();
        resetForm();
      } else {
        toast.error('Failed to update portfolio');
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast.error(error.response?.data?.message || 'Failed to update portfolio');
    }
  };

  // Handle portfolio deletion
  const handleDeletePortfolio = async (id) => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        const response = await axios.delete(`${API_URL}/portfolio/${id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        if (response.data.success) {
          toast.success('Portfolio deleted successfully');
          fetchPortfolios();
        } else {
          toast.error('Failed to delete portfolio');
        }
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        toast.error(error.response?.data?.message || 'Failed to delete portfolio');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      serviceType: 'landscaping',
      projectDate: '',
      clientName: '',
      projectDuration: '',
      projectCost: '',
      projectSize: '',
      challenges: '',
      solutions: '',
      customerFeedback: '',
      tags: '',
      status: 'draft',
      images: []
    });
    setSelectedPortfolio(null);
  };

  // Open modal for editing
  const handleEdit = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      location: portfolio.location,
      serviceType: portfolio.serviceType,
      projectDate: new Date(portfolio.projectDate).toISOString().split('T')[0],
      clientName: portfolio.clientName || '',
      projectDuration: portfolio.projectDuration || '',
      projectCost: portfolio.projectCost || '',
      projectSize: portfolio.projectSize || '',
      challenges: portfolio.challenges || '',
      solutions: portfolio.solutions || '',
      customerFeedback: portfolio.customerFeedback || '',
      tags: portfolio.tags.join(', '),
      status: portfolio.status,
      images: portfolio.images
    });
    setIsModalOpen(true);
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header with Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Portfolio Items</h2>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Add New Portfolio
          </Button>
        </div>
        {/* Portfolio Grid */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No portfolios found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {portfolio.images[0] && (
                  <img
                    src={portfolio.images[0].url}
                    alt={portfolio.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{portfolio.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{portfolio.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(portfolio.projectDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(portfolio)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeletePortfolio(portfolio._id)}
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
        {/* Modal for Add/Edit Portfolio */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">
                {selectedPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
              </h3>
              <form onSubmit={selectedPortfolio ? handleUpdatePortfolio : handleCreatePortfolio}>
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
                      <label className="block text-sm font-medium text-gray-700">Service Type</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      >
                        <option value="landscaping">Landscaping</option>
                        <option value="garden-design">Garden Design</option>
                        <option value="lawn-care">Lawn Care</option>
                        <option value="irrigation">Irrigation</option>
                        <option value="hardscaping">Hardscaping</option>
                        <option value="maintenance">Maintenance</option>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Cost</label>
                      <input
                        type="number"
                        name="projectCost"
                        value={formData.projectCost}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Size</label>
                      <input
                        type="text"
                        name="projectSize"
                        value={formData.projectSize}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Challenges</label>
                    <textarea
                      name="challenges"
                      value={formData.challenges}
                      onChange={handleInputChange}
                      rows="2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Solutions</label>
                    <textarea
                      name="solutions"
                      value={formData.solutions}
                      onChange={handleInputChange}
                      rows="2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Feedback</label>
                    <textarea
                      name="customerFeedback"
                      value={formData.customerFeedback}
                      onChange={handleInputChange}
                      rows="2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
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
                          images: files
                        }));
                      }}
                      className="mt-1 block w-full"
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
                    {selectedPortfolio ? 'Update' : 'Create'}
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

export default PortfolioManager; 