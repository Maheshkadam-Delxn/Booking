'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import apiClient from '../../lib/api/apiClient';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const { userData } = useDashboard();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    todayTasks: 0,
    weekTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.token && userData?.role === 'professional') {
      fetchAssignments();
    }
  }, [userData]);

  const fetchAssignments = async () => {
    try {
      const response = await apiClient.get('/appointments');
      const allAppointments = response.data.data || [];
      
      // Filter appointments assigned to current staff member
      const myAssignments = allAppointments.filter(apt => 
        apt.crew?.assignedTo?.includes(userData.id) || 
        apt.crew?.leadProfessional === userData.id
      );

      setAssignments(myAssignments);
      calculateStats(myAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (assignments) => {
    const today = new Date().toDateString();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const todayTasks = assignments.filter(apt => 
      new Date(apt.date).toDateString() === today
    ).length;

    const weekTasks = assignments.filter(apt => 
      new Date(apt.date) >= weekStart
    ).length;

    const completedTasks = assignments.filter(apt => 
      apt.status === 'Completed'
    ).length;

    const pendingTasks = assignments.filter(apt => 
      apt.status === 'Scheduled' || apt.status === 'Pending'
    ).length;

    setStats({ todayTasks, weekTasks, completedTasks, pendingTasks });
  };

  const updateTaskStatus = async (appointmentId, status) => {
    try {
      await apiClient.put(`/appointments/${appointmentId}`, { status });
      toast.success('Task status updated');
      fetchAssignments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userData?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.weekTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Assignments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No assignments found
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {assignment.service?.name || 'Service'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Customer: {assignment.customer?.user?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(assignment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {assignment.timeSlot?.startTime} - {assignment.timeSlot?.endTime}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assignment.status === 'Completed' 
                              ? 'bg-green-100 text-green-800'
                              : assignment.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {assignment.status !== 'Completed' && (
                        <button
                          onClick={() => updateTaskStatus(assignment._id, 'Completed')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;