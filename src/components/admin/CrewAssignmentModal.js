'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'react-hot-toast';

const CrewAssignmentModal = ({ isOpen, onClose, appointment, onUpdate }) => {
  const { userData } = useDashboard();
  const { getTenantApiClient } = useTenant();
  const [staff, setStaff] = useState([]);
  const [selectedLead, setSelectedLead] = useState(appointment?.crew?.leadProfessional?._id || '');
  const [selectedMembers, setSelectedMembers] = useState(
    appointment?.crew?.assignedTo?.map(member => member._id) || []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  const fetchStaff = async () => {
    try {
      const apiClient = getTenantApiClient();
      const response = await apiClient.get('/users/staff', {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setStaff(response.data.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff members');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const apiClient = getTenantApiClient();
      const response = await apiClient.put(
        `/appointments/${appointment._id}/crew`,
        {
          leadProfessional: selectedLead || null,
          assignedTo: selectedMembers
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );

      if (response.data.success) {
        toast.success('Crew assigned successfully');
        onUpdate(response.data.data);
      }
    } catch (error) {
      console.error('Error assigning crew:', error);
      toast.error('Failed to assign crew');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Crew</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Professional
            </label>
            <select
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select lead professional</option>
              {staff.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staff.map(member => (
                <label key={member._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member._id)}
                    onChange={() => handleMemberToggle(member._id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{member.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || (!selectedLead && selectedMembers.length === 0)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Assign Crew'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrewAssignmentModal;