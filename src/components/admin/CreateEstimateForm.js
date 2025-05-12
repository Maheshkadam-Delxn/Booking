"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';
import axios from 'axios';

const CreateEstimateForm = ({ appointmentId }) => {
  const router = useRouter();
  const { appointments, createEstimate } = useStore();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const appointment = appointmentId
    ? appointments.find(app => app.id === parseInt(appointmentId))
    : null;

  const [formData, setFormData] = useState({
    appointmentId: appointment?.id || '',
    customer: appointment?.customerId || '',
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
    additionalFees: [{ name: '', amount: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/services');
        const serviceList = res.data.data;
        setServices(serviceList);
        setLoadingServices(false);

        if (appointment) {
          const selectedService = serviceList.find(s => s._id === appointment.serviceId);
          if (selectedService) {
            setFormData(prev => ({
              ...prev,
              services: [{
                id: selectedService._id,
                name: selectedService.name,
                quantity: 1,
                unitPrice: selectedService.basePrice,
                total: selectedService.basePrice
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

    fetchServices();
  }, [appointment]);

  // Calculate totals
  useEffect(() => {
    const servicesTotal = formData.services.reduce((sum, s) => sum + s.total, 0);
    const feesTotal = formData.additionalFees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
    const subtotal = servicesTotal + feesTotal;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    setFormData(prev => ({
      ...prev,
      budget: { min: total, max: total },
      subtotal,
      tax,
      total
    }));
  }, [formData.services, formData.additionalFees]);

  const updateServiceTotal = (index, field, value) => {
    const updated = [...formData.services];
    updated[index][field] = value;
    const qty = parseFloat(updated[index].quantity) || 0;
    const price = parseFloat(updated[index].unitPrice) || 0;
    updated[index].total = qty * price;
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const handleServiceChange = (index, serviceId) => {
    const service = services.find(s => s._id === serviceId);
    if (!service) return;

    const updated = [...formData.services];
    updated[index] = {
      id: service._id,
      name: service.name,
      quantity: updated[index].quantity,
      unitPrice: service.basePrice,
      total: updated[index].quantity * service.basePrice
    };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const addServiceLine = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { id: '', name: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeServiceLine = (index) => {
    const updated = [...formData.services];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const updateFee = (index, field, value) => {
    const updated = [...formData.additionalFees];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, additionalFees: updated }));
  };

  const addFeeLine = () => {
    setFormData(prev => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: '', amount: 0 }]
    }));
  };

  const removeFeeLine = (index) => {
    const updated = [...formData.additionalFees];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, additionalFees: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (formData.services.length === 0 || formData.services.some(s => !s.id)) {
      setError('Please add at least one valid service');
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      services: formData.services.map(s => ({
        service: s.id,
        quantity: parseInt(s.quantity)
      })),
      property: {
        address: formData.property.address,
        size: formData.property.size,
        details: formData.property.details
      },
      customerNotes: formData.customerNotes,
      budget: formData.budget,
      accessInfo: formData.accessInfo,
      createdBy: localStorage.getItem('userId')
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/estimates/request', requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      createEstimate(res.data.data);
      router.push('/admin');
    } catch (err) {
      console.error('Error creating estimate:', err);
      setError(err.response?.data?.message || 'Failed to create estimate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Estimate</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Services Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Services</h3>
          </Card.Header>
          <Card.Content>
            {formData.services.map((service, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4 items-end">
                <select
                  value={service.id || ''}
                  className="col-span-2 border p-2 rounded"
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
                  onChange={(e) => updateServiceTotal(index, 'quantity', e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="border p-2 rounded"
                  value={service.unitPrice}
                  onChange={(e) => updateServiceTotal(index, 'unitPrice', e.target.value)}
                  required
                />
                <div className="flex items-center space-x-2">
                  <span>${service.total.toFixed(2)}</span>
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

        {/* Additional Fees Section */}
        {/* <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Additional Fees</h3>
          </Card.Header>
          <Card.Content>
            {formData.additionalFees.map((fee, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4 items-end">
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Fee Name"
                  value={fee.name}
                  onChange={(e) => updateFee(index, 'name', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="border p-2 rounded"
                  placeholder="Amount"
                  value={fee.amount}
                  onChange={(e) => updateFee(index, 'amount', e.target.value)}
                />
                {formData.additionalFees.length > 1 && (
                  <button 
                    type="button" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFeeLine(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              onClick={addFeeLine}
              variant="secondary"
            >
              + Add Fee
            </Button>
          </Card.Content>
        </Card> */}

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
              type="text"
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
              placeholder="Customer Notes"
              className="border p-2 rounded w-full"
              rows={3}
              value={formData.customerNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, customerNotes: e.target.value }))}
            />
          </Card.Content>
        </Card>






        

        {/* Summary Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold">Estimate Summary</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${formData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${formData.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                <p>Budget Range: ${formData.budget.min.toFixed(2)} - ${formData.budget.max.toFixed(2)}</p>
              </div>
            </div>
          </Card.Content>
        </Card>



        

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Estimate'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEstimateForm;