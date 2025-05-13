'use client';

import React, { useState, useEffect } from 'react';
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

  switch (status) {
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
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      break;
  }

  // Format the status for display
  const formatStatus = (status) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {formatStatus(status)}
    </span>
  );
};

// Add the localizer for the calendar
const localizer = momentLocalizer(moment);

// Add these new components
const AppointmentDetailsModal = ({ appointment, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState(appointment);
  const [selectedPhotos, setSelectedPhotos] = useState({ beforeService: [], afterService: [] });
  const [previewUrls, setPreviewUrls] = useState({ beforeService: [], afterService: [] });
  const [activePhotoTab, setActivePhotoTab] = useState('beforeService');
  const [showFullImage, setShowFullImage] = useState(null);

  const router = useRouter();
  const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { userData, isLoading } = useDashboard();
  const [completionDetails, setCompletionDetails] = useState({
    completedAt: appointment.completionDetails?.completedAt || '',
    duration: appointment.completionDetails?.duration || '',
    additionalWorkPerformed: appointment.completionDetails?.additionalWorkPerformed || '',
    customerSignature: appointment.completionDetails?.customerSignature || ''
  });

  useEffect(() => {
    if (!isLoading) {
      if (!userData?.role) {
        router.push('/login');
      } else if (userData.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [isLoading, userData, router]);

  if (isLoading) return <p>Loading...</p>;

  if (userData?.role !== 'admin') return null;

  const handleUpdate = async () => {
    try {
      await onUpdate(editedAppointment);
      setIsEditing(false);
      toast.success('Appointment updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update appointment');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/appointments/${appointment.id}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );
      toast.success('Appointment deleted successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const handleRescheduleRequest = async (requestedDate, requestedTime, reason) => {
    try {
      await axios.put(
        `${API_URL}/appointments/${appointment.id}/reschedule-request`,
        {
          requestedDate,
          requestedTime,
          reason
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );
      toast.success('Reschedule request submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit reschedule request');
    }
  };

  const handleCompletionUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/appointments/${appointment.id}`,
        {
          status: 'Completed',
          completionDetails
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );
      toast.success('Completion details updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update completion details');
    }
  };

  // Function to handle photo upload
  const handlePhotoUpload = async (type) => {
    if (selectedPhotos[type].length === 0) {
      toast.info('Please select photos first');
      return;
    }

    setUploadingPhotos(true);
    const formData = new FormData();
    
    try {
      // Validate and append each file
      for (const file of selectedPhotos[type]) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not a valid image file`);
        }

        // Convert image to Blob if needed
        const blob = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const blob = new Blob([reader.result], { type: file.type });
            resolve(blob);
          };
          reader.readAsArrayBuffer(file);
        });

        // Append the blob as a file
        formData.append('photos', blob, file.name);
      }

      // Add photoType
      formData.append('photoType', type);

      // Log formData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(key, ':', value.type, value.size, 'bytes');
        } else {
          console.log(key, ':', value);
        }
      }

      const response = await axios.post(
        `${API_URL}/appointments/${appointment.id}/photos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'multipart/form-data',
          },
          // Important: prevent axios from processing FormData
          transformRequest: [(data) => data],
          // Add timeout and larger size limit
          timeout: 30000, // 30 seconds
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          // Add response type
          responseType: 'json',
          // Add onUploadProgress
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', percentCompleted + '%');
          }
        }
      );

      console.log('Upload response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      toast.success(`Successfully uploaded ${selectedPhotos[type].length} photo${selectedPhotos[type].length > 1 ? 's' : ''}`);

      // Update the appointment state with new photos
      const updatedAppointment = {
        ...appointment,
        photos: {
          ...appointment.photos,
          [type]: [...(appointment.photos?.[type] || []), ...response.data.data]
        }
      };
      onUpdate(updatedAppointment);

      // Clear previews and selected photos after successful upload
      setSelectedPhotos(prev => ({ ...prev, [type]: [] }));
      previewUrls[type].forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls(prev => ({ ...prev, [type]: [] }));

    } catch (error) {
      console.error('Photo upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config
      });

      let errorMessage = 'Failed to upload photos';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.response?.status === 403) {
        toast.error('You are not authorized to upload photos');
      } else if (error.response?.status === 400) {
        toast.error(errorMessage);
      } else {
        toast.error(`Upload failed: ${errorMessage}`);
      }
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Add a function to validate file size
  const validateFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
    }
    return true;
  };

  // Update the handleFileSelect function
  const handleFileSelect = async (e, type) => {
    const files = Array.from(e.target.files);
    
    try {
      // Validate each file
      const validFiles = files.filter(file => {
        try {
          if (!file.type.startsWith('image/')) {
            toast.error(`${file.name} is not an image file`);
            return false;
          }
          if (!validateFileSize(file)) {
            return false;
          }
          return true;
        } catch (error) {
          toast.error(error.message);
          return false;
        }
      });

      if (validFiles.length === 0) return;

      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      
      setSelectedPhotos(prev => ({
        ...prev,
        [type]: [...prev[type], ...validFiles]
      }));
      
      setPreviewUrls(prev => ({
        ...prev,
        [type]: [...prev[type], ...newPreviewUrls]
      }));
    } catch (error) {
      console.error('File selection error:', error);
      toast.error('Error processing selected files');
    }
  };

  // Function to remove a photo from preview
  const removePhoto = (type, index) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[type][index]);
    setPreviewUrls(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Cleanup function for preview URLs
  useEffect(() => {
    return () => {
      // Cleanup preview URLs when component unmounts
      [...previewUrls.beforeService, ...previewUrls.afterService].forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

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

        {/* Existing Photos Display */}
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

        {/* Photo Upload Section */}
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

        {/* Preview Section */}
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

          {/* Status and Basic Info */}
          <div className="mb-6">
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
          </div>

          {/* Photos Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Service Photos</h3>
            {renderPhotoSection()}
          </div>

          {/* Action Buttons */}
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

      {/* Full Image Modal */}
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
  const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;
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
  const {userData, isLoading} = useDashboard();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!userData?.token) return;

    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentsRes = await axios.get(`${API_URL}/appointments`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });

        console.log("Raw appointments response:", appointmentsRes.data);

        // Check if we have the correct data structure
        const appointments = appointmentsRes.data?.data || [];

        // Transform appointment data to match frontend structure
        const transformedAppointments = appointments.map((app) => {
          console.log("Processing appointment:", app);
        
          return {
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
          };
        });
        
        console.log("Transformed appointments:", transformedAppointments);
        setAppointments(transformedAppointments);

        // Fetch services
        const servicesRes = await axios.get(`${API_URL}/services`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });

        console.log("Services response:", servicesRes.data);
        // Transform services data to ensure consistent structure
        const transformedServices = (servicesRes.data?.data || []).map(service => ({
          _id: service._id,
          name: service.name,
          category: service.category,
          price: service.price
        }));
        setServices(transformedServices);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for a new field
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort appointments
  const filteredAppointments = [...appointments]
    .filter(appointment => {
      // Text search filter with null checks
      const searchMatches = 
        (appointment.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (appointment.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (appointment.serviceName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatches = statusFilter === 'all' || appointment.status === statusFilter;
      
      // Service filter
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

  // List of unique statuses for the filter
  const statuses = ['all', ...new Set(appointments.map(a => a.status))];

  // Add this function to handle appointment updates
  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
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
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      setAppointments(appointments.map(apt => 
        apt.id === updatedAppointment.id ? response.data.data : apt
      ));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  // Add this function to handle calendar view
  const handleCalendarView = async () => {
    try {
      const start = moment().startOf('month').format('YYYY-MM-DD');
      const end = moment().endOf('month').format('YYYY-MM-DD');
      
      const response = await axios.get(
        `${API_URL}/appointments/calendar?start=${start}&end=${end}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      setCalendarEvents(response.data.data);
    } catch (error) {
      toast.error('Failed to load calendar events');
    }
  };

  // Add this to your useEffect
  useEffect(() => {
    if (viewType === 'calendar') {
      handleCalendarView();
    }
  }, [viewType]);

  // Add this to your JSX before the return statement
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
          }
        }}
      />
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
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
            {/* Status Filter */}
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

            {/* Service Filter */}
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
                            onClick={() => setSelectedAppointment(appointment)}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
                          </button>
                          {appointment.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowCrewModal(true);
                                }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                                Assign Crew
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowPaymentModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Payment
                              </button>
                              {appointment.frequency !== 'One-time' && (
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setShowRecurringModal(true);
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
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={(event) => setSelectedAppointment(event.appointment)}
            />
          </div>
        )}

        {selectedAppointment && (
          <AppointmentDetailsModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {showRecurringModal && selectedAppointment && (
          <RecurringAppointmentModal
            appointment={selectedAppointment}
            onClose={() => {
              setShowRecurringModal(false);
              setSelectedAppointment(null);
            }}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {showCrewModal && selectedAppointment && (
          <CrewAssignmentModal
            appointment={selectedAppointment}
            onClose={() => {
              setShowCrewModal(false);
              setSelectedAppointment(null);
            }}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {showPaymentModal && selectedAppointment && (
          <PaymentStatusModal
            appointment={selectedAppointment}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedAppointment(null);
            }}
            onUpdate={handleUpdateAppointment}
          />
        )}
        </div>
    </AdminLayout>
  );
};

export default AppointmentsPage; 