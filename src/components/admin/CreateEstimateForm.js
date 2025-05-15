"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';
import axios from 'axios';
import { useDashboard } from '../../contexts/DashboardContext';

const CreateEstimateForm = ({ appointmentId }) => {
  const router = useRouter();
  const { appointments } = useStore();
  const { userData } = useDashboard();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const appointment = appointmentId
    ? appointments.find(app => app.id === parseInt(appointmentId))
    : null;

  const [formData, setFormData] = useState({
    appointmentId: appointment?.id || '',
    services: [],
    property: {
      address: {
        street: appointment?.property?.address?.street || '',
        city: appointment?.property?.address?.city || '',
        state: appointment?.property?.address?.state || '',
        zipCode: appointment?.property?.address?.zipCode || ''
      },
      size: appointment?.property?.size || '',
      details: appointment?.property?.details || ''
    },
    budget: {
      min: 0,
      max: 0
    },
    accessInfo: appointment?.accessInfo || '',
    customerNotes: appointment?.notes || '',
    photos: []
  });

  // Handle photo selection
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create previews
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPhotoPreviews([...photoPreviews, ...previews]);
    setPhotos([...photos, ...files]);
  };

  // Remove photo from selection
  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index].preview);
    
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  // Upload photos to server
  const uploadPhotos = async (estimateId) => {
    if (photos.length === 0) return;
    
    setUploadingPhotos(true);
    
    try {
      const formData = new FormData();
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
      
      const res = await axios.post(
        `${API_URL}/estimates/${estimateId}/photos`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${userData?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return res.data;
    } catch (err) {
      console.error('Error uploading photos:', err);
      throw err;
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/services`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`
          }
        });
        const serviceList = res.data.data;
        setServices(serviceList);
        setLoadingServices(false);

        if (appointment) {
          const selectedService = serviceList.find(s => s._id === appointment.serviceId);
          if (selectedService) {
            setFormData(prev => ({
              ...prev,
              services: [{
                service: selectedService._id,
                quantity: 1
              }]
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setLoadingServices(false);
        setError('Failed to load services. Please try again.');
      }
    };

    if (userData?.token) {
      fetchServices();
    }
  }, [appointment, userData?.token]);

  // Clean up photo previews
  useEffect(() => {
    return () => {
      photoPreviews.forEach(preview => {
        URL.revokeObjectURL(preview.preview);
      });
    };
  }, [photoPreviews]);

  const handleServiceChange = (index, serviceId) => {
    const updated = [...formData.services];
    updated[index] = {
      service: serviceId,
      quantity: updated[index]?.quantity || 1
    };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const updateServiceQuantity = (index, value) => {
    const updated = [...formData.services];
    updated[index] = {
      ...updated[index],
      quantity: parseInt(value) || 1
    };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const addServiceLine = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { service: '', quantity: 1 }]
    }));
  };

  const removeServiceLine = (index) => {
    const updated = [...formData.services];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (formData.services.length === 0 || formData.services.some(s => !s.service)) {
      setError('Please add at least one valid service');
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      services: formData.services.map(s => ({
        service: s.service,
        quantity: parseInt(s.quantity)
      })),
      property: {
        address: formData.property.address,
        size: formData.property.size,
        details: formData.property.details
      },
      customerNotes: formData.customerNotes,
      budget: formData.budget,
      accessInfo: formData.accessInfo
    };

    try {
      // First create the estimate
      const res = await axios.post(
        `${API_URL}/estimates/request`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`
          }
        }
      );

      const estimateId = res.data.data._id;

      // Then upload photos if any
      if (photos.length > 0) {
        await uploadPhotos(estimateId);
      }

      router.push('/customers/estimates');
    } catch (err) {
      console.error('Error creating estimate:', err);
      setError(err.response?.data?.message || 'Failed to create estimate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData?.token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Request Estimate</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Services Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Services Needed</h3>
          </Card.Header>
          <Card.Content>
            {formData.services.map((service, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4 items-end">
                <select
                  value={service.service || ''}
                  className="col-span-3 border p-2 rounded"
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  required
                >
                  <option value="">Select service</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  className="border p-2 rounded"
                  value={service.quantity}
                  onChange={(e) => updateServiceQuantity(index, e.target.value)}
                  required
                />
                <div className="flex items-center space-x-2">
                  {formData.services.length > 1 && (
                    <button 
                      type="button" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeServiceLine(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              onClick={addServiceLine}
              variant="secondary"
            >
              + Add Service
            </Button>
          </Card.Content>
        </Card>

        {/* Property Details Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Property Details</h3>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street Address"
                className="border p-2 rounded"
                value={formData.property.address.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  property: {
                    ...prev.property,
                    address: {
                      ...prev.property.address,
                      street: e.target.value
                    }
                  }
                }))}
                required
              />
              <input
                type="text"
                placeholder="City"
                className="border p-2 rounded"
                value={formData.property.address.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  property: {
                    ...prev.property,
                    address: {
                      ...prev.property.address,
                      city: e.target.value
                    }
                  }
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="State"
                className="border p-2 rounded"
                value={formData.property.address.state}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  property: {
                    ...prev.property,
                    address: {
                      ...prev.property.address,
                      state: e.target.value
                    }
                  }
                }))}
                required
              />
              <input
                type="text"
                placeholder="Zip Code"
                className="border p-2 rounded"
                value={formData.property.address.zipCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  property: {
                    ...prev.property,
                    address: {
                      ...prev.property.address,
                      zipCode: e.target.value
                    }
                  }
                }))}
                required
              />
            </div>
            <input
              type="number"
              placeholder="Property Size (sq ft)"
              className="border p-2 rounded w-full"
              value={formData.property.size}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  size: e.target.value
                }
              }))}
            />
            <textarea
              placeholder="Additional Property Details"
              className="border p-2 rounded w-full"
              rows={3}
              value={formData.property.details}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                property: {
                  ...prev.property,
                  details: e.target.value
                }
              }))}
            />
          </Card.Content>
        </Card>

        {/* Budget Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Budget Range</h3>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minimum ($)</label>
                <input
                  type="number"
                  min="0"
                  className="border p-2 rounded w-full"
                  value={formData.budget.min}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      min: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maximum ($)</label>
                <input
                  type="number"
                  min="0"
                  className="border p-2 rounded w-full"
                  value={formData.budget.max}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      max: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Photos Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Property Photos</h3>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                onChange={handlePhotoUpload}
                multiple
                accept="image/*"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Select Photos
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Upload photos of the property (JPEG, PNG)
              </p>
            </div>

            {/* Photo previews */}
            {photoPreviews.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected Photos:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Access & Notes Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Access & Notes</h3>
          </Card.Header>
          <Card.Content className="space-y-4">
            <textarea
              placeholder="Access Information (gate codes, parking instructions, etc.)"
              className="border p-2 rounded w-full"
              rows={3}
              value={formData.accessInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, accessInfo: e.target.value }))}
            />
            <textarea
              placeholder="Additional Notes"
              className="border p-2 rounded w-full"
              rows={3}
              value={formData.customerNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, customerNotes: e.target.value }))}
            />
          </Card.Content>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/customer')}
            disabled={isSubmitting || uploadingPhotos}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || uploadingPhotos}
          >
            {isSubmitting || uploadingPhotos ? 'Processing...' : 'Request Estimate'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEstimateForm;