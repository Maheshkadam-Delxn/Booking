'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/ui/Button';
import { useDashboard } from '@/contexts/DashboardContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { Upload, Calendar as CalendarIcon, List, Grid } from 'lucide-react';
import RecurringAppointmentModal from './components/RecurringAppointmentModal';
import CrewAssignmentModal from './components/CrewAssignmentModal';
import PaymentStatusModal from './components/PaymentStatusModal';
import { useRouter } from 'next/navigation';

// Status badge component with appropriate colors
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  // Convert to lowercase for comparison to ensure consistent behavior
  const statusLower = status ? status.toLowerCase() : '';

  switch (statusLower) {
    case 'pending':
    case 'pending-estimate':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'scheduled':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'cancelled':
    case 'canceled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      break;
  }

  // Format the status for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    
    // If status contains hyphens, format each word
    if (status.includes('-')) {
      return status
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Otherwise just capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {formatStatus(status)}
    </span>
  );
};

// Add the localizer for the calendar
const localizer = momentLocalizer(moment);
const validFiles = [];
const newPreviewUrls = [];
const AppointmentDetailsModal = ({ appointment, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState(appointment);
  const [selectedPhotos, setSelectedPhotos] = useState({ beforeService: [], afterService: [] });
  const [previewUrls, setPreviewUrls] = useState({ beforeService: [], afterService: [] });
  const [activePhotoTab, setActivePhotoTab] = useState('beforeService');
  const [showFullImage, setShowFullImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadErrors, setUploadErrors]=useState([]);
  const errors = [];


  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading } = useDashboard();

  const [completionDetails, setCompletionDetails] = useState({
    completedAt: appointment.completionDetails?.completedAt || '',
    duration: appointment.completionDetails?.duration || '',
    additionalWorkPerformed: appointment.completionDetails?.additionalWorkPerformed || '',
    customerSignature: appointment.completionDetails?.customerSignature || ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !userData?.token) {
      router.push('/login');
    }
  }, [isLoading, userData, router]);

  // Get auth headers function
  const getAuthHeaders = (contentType = 'application/json') => {
    const token = userData?.token || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token available in modal');
      return {};
    }
    
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType
    };
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const updateData = {
        date: editedAppointment.date,
        timeSlot: {
          startTime: editedAppointment.startTime,
          endTime: editedAppointment.endTime
        },
        status: editedAppointment.status,
        notes: editedAppointment.notes
      };

      const response = await axios.put(
        `${API_URL}/appointments/${appointment.id}`,
        updateData,
        { headers }
      );

      if (response.data.success) {
        onUpdate({
          ...appointment,
          ...editedAppointment
        });
        
        setIsEditing(false);
        toast.success('Appointment updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update appointment');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const response = await axios.delete(
        `${API_URL}/appointments/${appointment.id}`,
        { headers }
      );

      if (response.data.success) {
        toast.success('Appointment deleted successfully');
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to delete appointment');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    setUploadErrors([]); // Clear previous errors
    if (files.length === 0) return;
  
    const validFiles = [];
    const newPreviewUrls = [];
    const errors = [];
  
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Not an image file`);
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) { // 5MB
        errors.push(`${file.name}: File too large (max 5MB)`);
        return;
      }
  
      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });
  
    // Set errors in state so UI can show them
    if (errors.length > 0) {
      setUploadErrors(errors);
      
      // Also show a toast notification
      toast.error(
        <div>
          <p>Some files were invalid:</p>
          <ul className="list-disc pl-5">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>,
        { autoClose: 10000 }
      );
    }
  
    // Only update preview and selected photos if there are valid files
    if (validFiles.length > 0) {
      setSelectedPhotos(prev => ({
        ...prev,
        [type]: [...prev[type], ...validFiles]
      }));
  
      setPreviewUrls(prev => ({
        ...prev,
        [type]: [...prev[type], ...newPreviewUrls]
      }));
    }
  };

  const handlePhotoUpload = async (type) => {
    if (selectedPhotos[type].length === 0) {
      toast.info('Please select photos first');
      return;
    }

    setUploadingPhotos(true);
    const formData = new FormData();
    
    try {
      for (const file of selectedPhotos[type]) {
        formData.append('photos', file);
      }

      formData.append('photoType', type);

      const headers = getAuthHeaders('multipart/form-data');
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const response = await axios.post(
        `${API_URL}/appointments/${appointment.id}/photos`,
        formData,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      toast.success(`Successfully uploaded ${selectedPhotos[type].length} photo${selectedPhotos[type].length > 1 ? 's' : ''}`);

      const updatedAppointment = {
        ...appointment,
        photos: {
          ...appointment.photos,
          [type]: [...(appointment.photos?.[type] || []), ...response.data.data]
        }
      };
      onUpdate(updatedAppointment);

      // Clear previews and selected photos
      setSelectedPhotos(prev => ({ ...prev, [type]: [] }));
      setPreviewUrls(prev => ({ ...prev, [type]: [] }));

    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (type, index) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(previewUrls[type][index]);
    setPreviewUrls(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(urls => {
        urls.forEach(url => URL.revokeObjectURL(url));
      });
    };
  }, [previewUrls]);

  const renderPhotoSection = () => {
    if (appointment.status !== 'Completed') {
      return (
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
          <p className="text-yellow-700">
            Photos can only be uploaded once the appointment is marked as completed.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activePhotoTab === 'beforeService'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setActivePhotoTab('beforeService')}
          >
            Before Service
            {appointment.photos?.beforeService?.length > 0 && (
              <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {appointment.photos.beforeService.length}
              </span>
            )}
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activePhotoTab === 'afterService'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setActivePhotoTab('afterService')}
          >
            After Service
            {appointment.photos?.afterService?.length > 0 && (
              <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {appointment.photos.afterService.length}
              </span>
            )}
          </button>
        </div>

        {appointment.photos && appointment.photos[activePhotoTab]?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Existing Photos</h4>
            <div className="grid grid-cols-3 gap-4">
              {appointment.photos[activePhotoTab].map((photo, index) => (
                <div key={index} className="relative group cursor-pointer" onClick={() => setShowFullImage(photo)}>
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                  {photo.caption && (
                    <p className="text-sm text-gray-600 mt-1 truncate">{photo.caption}</p>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e, activePhotoTab)}
            className="hidden"
            id={`photo-upload-${activePhotoTab}`}
          />
          <label
            htmlFor={`photo-upload-${activePhotoTab}`}
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload photos</span>
          </label>
        </div>

        {previewUrls[activePhotoTab].length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewUrls[activePhotoTab].map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button
                  onClick={() => removePhoto(activePhotoTab, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedPhotos[activePhotoTab].length > 0 && (
          <div className="mt-4">
            <Button
              onClick={() => handlePhotoUpload(activePhotoTab)}
              disabled={uploadingPhotos}
              className="w-full"
            >
              {uploadingPhotos ? 'Uploading...' : 'Upload Selected Photos'}
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading || !userData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editedAppointment.status}
                    onChange={(e) => setEditedAppointment(prev => ({ ...prev, status: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={editedAppointment.date ? new Date(editedAppointment.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditedAppointment(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={editedAppointment.startTime}
                        onChange={(e) => setEditedAppointment(prev => ({ ...prev, startTime: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                      <input
                        type="time"
                        value={editedAppointment.endTime}
                        onChange={(e) => setEditedAppointment(prev => ({ ...prev, endTime: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editedAppointment.notes?.internal || ''}
                    onChange={(e) => setEditedAppointment(prev => ({ 
                      ...prev, 
                      notes: { ...prev.notes, internal: e.target.value }
                    }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Add internal notes..."
                  />
                </div>
              </div>
            ) : (
              <>
                <StatusBadge status={appointment.status} />
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium">
                      {appointment.timeSlot ? 
                        `${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}` :
                        `${appointment.startTime} - ${appointment.endTime}`
                      }
                    </p>
                  </div>
                </div>
                {appointment.notes?.internal && (
                  <div className="mt-4">
                    <p className="text-gray-600">Internal Notes</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{appointment.notes.internal}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mb-6">
          {uploadErrors.length > 0 && (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <h4 className="text-red-800 font-medium">Upload Errors:</h4>
    <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
      {uploadErrors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  </div>
)}
            <h3 className="text-xl font-semibold mb-4">Service Photos</h3>
            {renderPhotoSection()}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
            {isEditing ? (
              <Button onClick={handleUpdate}>Save Changes</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </div>
      </div>

      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <img
              src={showFullImage.url}
              alt={showFullImage.caption || 'Full size image'}
              className="w-full h-full object-contain"
            />
            {showFullImage.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center">
                {showFullImage.caption}
              </p>
            )}
            <button
              onClick={() => setShowFullImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const AppointmentsPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading } = useDashboard();
  
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewType, setViewType] = useState('list');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = userData?.token || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token available');
      return {};
    }
    
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, [userData]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const appointmentsRes = await axios.get(
        `${API_URL}/appointments`,
        { headers }
      );

      if (!appointmentsRes.data.success) {
        throw new Error(appointmentsRes.data.message || 'Failed to fetch appointments');
      }

      const appointments = appointmentsRes.data?.data || [];

      const transformedAppointments = appointments.map((app) => ({
        id: app._id,
        customerName: app.customer?.user?.name || "N/A",
        customerPhone: app.customer?.user?.phone || "N/A",
        address: app.customer?.address ? 
          `${app.customer.address.street || ''}, ${app.customer.address.city || ''}, ${app.customer.address.state || ''}, ${app.customer.address.zip || ''}`.trim() : 
          'N/A',
        serviceName: app.service?.name || "N/A",
        serviceId: app.service?._id || "",
        date: app.date,
        timeSlot: {
          startTime: app.timeSlot?.startTime || 'N/A',
          endTime: app.timeSlot?.endTime || 'N/A'
        },
        startTime: app.timeSlot?.startTime || 'N/A',
        endTime: app.timeSlot?.endTime || 'N/A',
        status: app.status || 'Pending',
        frequency: app.recurringType || 'One-time',
        payment: app.payment || {
          status: 'Pending',
          amount: 0,
          paymentMethod: 'Cash'
        },
        crew: app.crew || {
          leadProfessional: null,
          assignedTo: []
        },
        notes: app.notes || {
          customer: '',
          professional: '',
          internal: ''
        },
        photos: app.photos || {
          beforeService: [],
          afterService: []
        }
      }));
      
      setAppointments(transformedAppointments);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [API_URL, getAuthHeaders]);

  const fetchServices = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const servicesRes = await axios.get(
        `${API_URL}/services`,
        { headers }
      );

      if (!servicesRes.data.success) {
        throw new Error(servicesRes.data.message || 'Failed to fetch services');
      }

      const transformedServices = (servicesRes.data?.data || []).map(service => ({
        _id: service._id,
        name: service.name,
        category: service.category,
        price: service.price
      }));

      setServices(transformedServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error(err.response?.data?.message || err.message || 'Failed to load services');
    }
  }, [API_URL, getAuthHeaders]);

  useEffect(() => {
    if (!isLoading && !userData?.token) {
      router.push('/login');
    }
  }, [isLoading, userData, router]);

  useEffect(() => {
    if (!isLoading && userData?.token) {
      fetchAppointments();
      fetchServices();
    }
  }, [isLoading, userData, fetchAppointments, fetchServices]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAppointments = [...appointments]
    .filter(appointment => {
      const searchMatches = 
        (appointment.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (appointment.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (appointment.serviceName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const statusMatches = statusFilter === 'all' || appointment.status === statusFilter;
      const serviceMatches = serviceFilter === 'all' || appointment.serviceId === serviceFilter;
      
      return searchMatches && statusMatches && serviceMatches;
    })
    .sort((a, b) => {
      const aValue = sortField === 'date' ? new Date(a[sortField]) : a[sortField];
      const bValue = sortField === 'date' ? new Date(b[sortField]) : b[sortField];
      
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      } else if (typeof aValue === 'string') {
        return sortDirection === 'asc'
          ? (aValue || '').localeCompare(bValue || '')
          : (bValue || '').localeCompare(aValue || '');
      } else {
        return sortDirection === 'asc'
          ? (aValue || 0) - (bValue || 0)
          : (bValue || 0) - (aValue || 0);
      }
    });

  const statuses = ['all', ...new Set(appointments.map(a => a.status))];

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const response = await axios.put(
        `${API_URL}/appointments/${updatedAppointment.id}`,
        {
          date: updatedAppointment.date,
          timeSlot: {
            startTime: updatedAppointment.startTime,
            endTime: updatedAppointment.endTime,
          },
          status: updatedAppointment.status,
        },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update appointment');
      }

      setAppointments(appointments.map(apt => 
        apt.id === updatedAppointment.id ? response.data.data : apt
      ));
      
      return response.data.data;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update appointment');
      throw error;
    }
  };

  const handleCalendarView = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      
      if (!headers.Authorization) {
        throw new Error('No authorization token available');
      }
      
      const start = moment().startOf('month').format('YYYY-MM-DD');
      const end = moment().endOf('month').format('YYYY-MM-DD');
      
      const response = await axios.get(
        `${API_URL}/appointments/calendar?start=${start}&end=${end}`,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load calendar events');
      }

      setCalendarEvents(response.data.data);
    } catch (error) {
      console.error('Calendar view error:', error);
      toast.error(error.message || 'Failed to load calendar events');
    }
  }, [API_URL, getAuthHeaders]);

  useEffect(() => {
    if (viewType === 'calendar') {
      handleCalendarView();
    }
  }, [viewType, handleCalendarView]);

  const renderCalendar = () => (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: '4px',
          },
        })}
        onSelectEvent={(event) => {
          const appointment = appointments.find(apt => apt.id === event.id);
          if (appointment) {
            setSelectedAppointment(appointment);
            setActiveModal('details');
          }
        }}
      />
    </div>
  );

  const closeModal = () => {
    setSelectedAppointment(null);
    setActiveModal(null);
  };

  if (isLoading || loading) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Error loading appointments:</p>
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="space-x-2">
            <button
              onClick={() => router.push('/admin/appointments/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              New Appointment
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`px-4 py-2 rounded-md ${
                viewType === 'calendar'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`px-4 py-2 rounded-md ${
                viewType === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 sr-only">
                  Status
                </label>
                <select
                  id="status-filter"
                  name="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' 
                        ? 'All Statuses' 
                        : status
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 sr-only">
                  Service
                </label>
                <select
                  id="service-filter"
                  name="service-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="all">All Services</option>
                  {services && services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {viewType === 'list' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customerName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {appointment.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.serviceName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.payment.status}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${appointment.payment.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setActiveModal('details');
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
                          </button>
                          {appointment.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setActiveModal('crew');
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Assign Crew
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setActiveModal('payment');
                                }}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Payment
                              </button>
                              {appointment.frequency !== 'One-time' && (
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setActiveModal('recurring');
                                  }}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  Recurring
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            {renderCalendar()}
          </div>
        )}

        {selectedAppointment && activeModal === 'details' && (
          <AppointmentDetailsModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {selectedAppointment && activeModal === 'recurring' && (
          <RecurringAppointmentModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {selectedAppointment && activeModal === 'crew' && (
          <CrewAssignmentModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {selectedAppointment && activeModal === 'payment' && (
          <PaymentStatusModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AppointmentsPage;