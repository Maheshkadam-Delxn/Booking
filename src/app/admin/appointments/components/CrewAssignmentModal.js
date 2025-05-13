'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CrewAssignmentModal = ({ appointment, onClose, onUpdate }) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crewAssignment, setCrewAssignment] = useState({
    leadProfessional: appointment.crew?.leadProfessional?._id || '',
    assignedTo: appointment.crew?.assignedTo?.map(member => member._id) || []
  });

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/professionals`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setProfessionals(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch professionals');
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointment.id}/crew`,
        crewAssignment,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success('Crew assignment updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update crew assignment');
    }
  };

  const handleTeamMemberToggle = (professionalId) => {
    setCrewAssignment(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(professionalId)
        ? prev.assignedTo.filter(id => id !== professionalId)
        : [...prev.assignedTo, professionalId]
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6">
          <p>Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Crew</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Professional</label>
            <select
              value={crewAssignment.leadProfessional}
              onChange={(e) => setCrewAssignment(prev => ({ ...prev, leadProfessional: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Select Lead Professional</option>
              {professionals.map(professional => (
                <option key={professional._id} value={professional._id}>
                  {professional.name} ({professional.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {professionals.map(professional => (
                <div key={professional._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={professional._id}
                    checked={crewAssignment.assignedTo.includes(professional._id)}
                    onChange={() => handleTeamMemberToggle(professional._id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={professional._id} className="ml-2 block text-sm text-gray-700">
                    {professional.name} ({professional.specialization})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrewAssignmentModal; 