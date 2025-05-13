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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editedAppointment.status}
                onChange={(e) => setEditedAppointment({ ...editedAppointment, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={editedAppointment.date.split('T')[0]}
                onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={editedAppointment.startTime}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={editedAppointment.endTime}
                  onChange={(e) => setEditedAppointment({ ...editedAppointment, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="mt-1">{appointment.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="mt-1">{appointment.serviceName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p className="mt-1">{`${appointment.startTime} - ${appointment.endTime}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={appointment.status} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Frequency</p>
                <p className="mt-1">{appointment.frequency}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Crew Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Lead Professional</p>
                  <p className="mt-1">{appointment.crew?.leadProfessional?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Team Members</p>
                  <div className="mt-1">
                    {appointment.crew?.assignedTo?.map(member => (
                      <span key={member._id} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">{appointment.payment?.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="mt-1">${appointment.payment?.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Method</p>
                  <p className="mt-1">{appointment.payment?.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="mt-1">{appointment.payment?.transactionId || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Notes</p>
                  <p className="mt-1">{appointment.notes?.customer || 'No customer notes'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Professional Notes</p>
                  <p className="mt-1">{appointment.notes?.professional || 'No professional notes'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Internal Notes</p>
                  <p className="mt-1">{appointment.notes?.internal || 'No internal notes'}</p>
                </div>
              </div>
            </div>

            {appointment.status === 'Completed' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Completion Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed At</p>
                    <p className="mt-1">{new Date(appointment.completionDetails?.completedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="mt-1">{appointment.completionDetails?.duration} minutes</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Additional Work</p>
                    <p className="mt-1">{appointment.completionDetails?.additionalWorkPerformed || 'None'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Photos</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Before Service</h4>
                  <div className="mt-2 space-y-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'beforeService')}
                      disabled={uploadingPhotos}
                      className="hidden"
                      id="beforePhotos"
                    />
                    <div className="flex space-x-2">
                      <label
                        htmlFor="beforePhotos"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Photos
                      </label>
                      {selectedPhotos.beforeService.length > 0 && (
                        <button
                          onClick={() => handlePhotoUpload('beforeService')}
                          disabled={uploadingPhotos}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {uploadingPhotos ? 'Uploading...' : 'Upload Selected'}
                        </button>
                      )}
                    </div>
                    
                    {/* Selected photos preview */}
                    {previewUrls.beforeService.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {previewUrls.beforeService.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Before service preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              onClick={() => removePhoto('beforeService', index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing uploaded photos */}
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {appointment.photos?.beforeService?.map((photo, index) => (
                        <img
                          key={`uploaded-${index}`}
                          src={photo.url}
                          alt={`Before service ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">After Service</h4>
                  <div className="mt-2 space-y-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'afterService')}
                      disabled={uploadingPhotos}
                      className="hidden"
                      id="afterPhotos"
                    />
                    <div className="flex space-x-2">
                      <label
                        htmlFor="afterPhotos"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select Photos
                      </label>
                      {selectedPhotos.afterService.length > 0 && (
                        <button
                          onClick={() => handlePhotoUpload('afterService')}
                          disabled={uploadingPhotos}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {uploadingPhotos ? 'Uploading...' : 'Upload Selected'}
                        </button>
                      )}
                    </div>

                    {/* Selected photos preview */}
                    {previewUrls.afterService.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {previewUrls.afterService.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`After service preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              onClick={() => removePhoto('afterService', index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing uploaded photos */}
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {appointment.photos?.afterService?.map((photo, index) => (
                        <img
                          key={`uploaded-${index}`}
                          src={photo.url}
                          alt={`After service ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              {appointment.status !== 'Completed' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Edit Appointment
                </button>
              )}
              {appointment.status === 'Scheduled' && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete Appointment
                </button>
              )}
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-500 mb-4">Are you sure you want to delete this appointment? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
            startTime: app.timeSlot?.startTime || 'N/A',
            endTime: app.timeSlot?.endTime || 'N/A',
            status: app.status,
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