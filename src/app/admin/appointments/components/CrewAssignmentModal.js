




'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDashboard } from '@/contexts/DashboardContext';

const CrewAssignmentModal = ({ appointment, onClose, onUpdate }) => {
  const { userData, fetchAppointments } = useDashboard();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const [crewAssignment, setCrewAssignment] = useState({
    leadProfessional: '',
    assignedTo: []
  });

  const appointmentId = appointment?._id || appointment?.id;

  // Helper function to get auth headers
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${userData.token}`,
    'Content-Type': 'application/json'
  });

useEffect(() => {
  if (!appointment) return;

  // Initialize crew assignment
  setCrewAssignment({
    leadProfessional: appointment.crew?.leadProfessional?._id || '',
    assignedTo: appointment.crew?.assignedTo?.map(member => 
      typeof member === 'object' ? member._id : member
    ) || []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get available professionals for this appointment's timeslot
      const dateStr = new Date(appointment.date).toISOString().split('T')[0];
      const availableResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/professionals/available`,
        {
          params: {
            date: dateStr,
            startTime: appointment.timeSlot.startTime,
            endTime: appointment.timeSlot.endTime
          },
          headers: getAuthHeaders()
        }
      );
      
      // Get full details of available professionals
      const professionalsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/professionals`,
        { headers: getAuthHeaders() }
      );

      // Merge availability with professional details
      const availableIds = availableResponse.data.data.map(p => p._id);
      const availableProfessionals = professionalsResponse.data.data.filter(
        p => availableIds.includes(p._id) || 
             p._id === appointment.crew?.leadProfessional?._id || 
             appointment.crew?.assignedTo?.some(id => 
               (typeof id === 'object' ? id._id : id) === p._id
             )
      );

      setProfessionals(availableProfessionals);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch professionals');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [appointment, userData?.token]);

  const assignProfessional = async (professionalId, isLead) => {
    try {
      setConflictError(null); // Clear previous errors
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/professionals/${professionalId}/assign/${appointmentId}`,
        { professionalId, isLead },
        { headers: getAuthHeaders() }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Assignment failed');
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        setConflictError(error.response.data.error || 'Scheduling conflict detected');
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!appointmentId) {
    toast.error('No appointment selected');
    return;
  }

  setSubmitting(true);

  try {
    // First handle lead professional assignment
    if (crewAssignment.leadProfessional) {
      await assignProfessional(crewAssignment.leadProfessional, true);
    }

    // Then handle team members
    const teamMemberPromises = crewAssignment.assignedTo
      .filter(id => id !== crewAssignment.leadProfessional)
      .map(professionalId => assignProfessional(professionalId, false));

    await Promise.all(teamMemberPromises);

    toast.success('Crew assignment updated successfully');
    
    // Fetch the fully updated appointment
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}`,
      { headers: getAuthHeaders() }
    );

    if (!response.data.success) {
      throw new Error('Failed to fetch updated appointment');
    }

    // Create complete updated appointment object
    const updatedAppointment = {
      ...appointment,
      ...response.data.data,
      crew: {
        leadProfessional: response.data.data.crew?.leadProfessional || null,
        assignedTo: response.data.data.crew?.assignedTo || []
      }
    };

    onUpdate(updatedAppointment);
    
    if (fetchAppointments) {
      await fetchAppointments();
    }
    
    onClose();
  } catch (error) {
    console.error('Error updating crew assignment:', error);
    const errorMessage = error.response?.data?.error || 
                       error.message || 
                       'Failed to update crew assignment';
    toast.error(errorMessage);
  } finally {
    setSubmitting(false);
  }
};

  const handleTeamMemberToggle = (professionalId) => {
    // Don't allow adding the lead professional as a team member
    if (professionalId === crewAssignment.leadProfessional) {
      setConflictError('This professional is already assigned as the lead');
      return;
    }
    
    setCrewAssignment(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(professionalId)
        ? prev.assignedTo.filter(id => id !== professionalId)
        : [...prev.assignedTo, professionalId]
    }));
    setConflictError(null); // Clear any previous error
  };

  const handleLeadProfessionalChange = (e) => {
    const newLeadId = e.target.value;
    // Remove from team members if selected as lead
    setCrewAssignment(prev => ({
      leadProfessional: newLeadId,
      assignedTo: prev.assignedTo.filter(id => id !== newLeadId)
    }));
    setConflictError(null);
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Crew</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
            disabled={submitting}
          >
            &times;
          </button>
        </div>

        {conflictError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {conflictError}
          </div>
        )}

        {loading ? (
          <p>Loading professionals...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Professional *
              </label>
             <select
  value={crewAssignment.leadProfessional}
  onChange={handleLeadProfessionalChange}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
  required
  disabled={submitting}
>
  <option value="">Select Lead Professional</option>
  {professionals.map(professional => (
    <option 
      key={professional._id} 
      value={professional._id}
      disabled={crewAssignment.assignedTo.includes(professional._id)}
    >
      {professional.name} - {professional.specialization || 'General'}
      {crewAssignment.assignedTo.includes(professional._id) && ' (already in team)'}
    </option>
  ))}
</select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Members
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
                {professionals.length === 0 ? (
                  <p className="text-sm text-gray-500">No professionals available</p>
                ) : (
                  professionals.map(professional => (
                    <div key={professional._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`member-${professional._id}`}
                        checked={crewAssignment.assignedTo.includes(professional._id)}
                        onChange={() => handleTeamMemberToggle(professional._id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={
                          submitting || 
                          professional._id === crewAssignment.leadProfessional
                        }
                      />
                      <label 
                        htmlFor={`member-${professional._id}`} 
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {professional.name} ({professional.specialization})
                        {professional._id === crewAssignment.leadProfessional && ' (lead)'}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={!crewAssignment.leadProfessional || submitting || !appointmentId}
              >
                {submitting ? 'Saving...' : 'Save Assignment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CrewAssignmentModal;