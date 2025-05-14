'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../ui/Button';
import { useDashboard } from '../../contexts/DashboardContext';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    status: 'inactive',
    displayDuration: 5
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userData } = useDashboard();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Create an axios instance with the auth token
  const getAuthAxios = () => {
    // The base URL already includes /api/v1 at the end, so we need to remove
    // the /api/v1 prefix from all endpoint paths when configuring baseURL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    // Remove the trailing /api/v1 to get the real base URL
    const actualBaseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
    
    const instance = axios.create({
      baseURL: actualBaseUrl,
    });
    
    // Add token to headers if available
    if (userData && userData.token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    
    return instance;
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = '/api/v1/announcements';
      console.log('Fetching announcements from:', apiUrl);
      const response = await getAuthAxios().get(apiUrl);
      console.log('Response:', response);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError(`Failed to fetch announcements: ${error.message}`);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!userData || !userData.token) {
      setError('You must be logged in to create or update announcements');
      setLoading(false);
      return;
    }
    
    try {
      const authAxios = getAuthAxios();
      
      if (isEditing) {
        console.log(`Updating announcement ${editId}:`, formData);
        const response = await authAxios.put(`/api/v1/announcements/${editId}`, formData);
        console.log('Update response:', response);
      } else {
        console.log('Creating new announcement:', formData);
        const response = await authAxios.post('/api/v1/announcements', formData);
        console.log('Create response:', response);
      }
      setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
      setIsEditing(false);
      setEditId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setError(`Failed to save announcement: ${error.message}`);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        if (error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (error.response.status === 403) {
          setError('You do not have permission to perform this action.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      status: announcement.status,
      displayDuration: announcement.displayDuration
    });
    setIsEditing(true);
    setEditId(announcement._id);
  };

  const handleDelete = async (id) => {
    if (!userData || !userData.token) {
      setError('You must be logged in to delete announcements');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await getAuthAxios().delete(`/api/v1/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        setError(`Failed to delete announcement: ${error.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="mt-1 text-xs text-red-600">Check the console for more details.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Duration (seconds)</label>
            <input
              type="number"
              min="5"
              max="10"
              value={formData.displayDuration}
              onChange={(e) => setFormData({ ...formData, displayDuration: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <Button
                type="button"
                onClick={() => {
                  setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="bg-gray-500 hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Processing...' : isEditing ? 'Update' : 'Create'} Announcement
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        {loading && <p className="text-gray-500">Loading announcements...</p>}
        <div className="space-y-4">
          {announcements.length === 0 && !loading ? (
            <p className="text-gray-500">No announcements found.</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-gray-600">{announcement.message}</p>
                  <div className="mt-2 space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      announcement.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Duration: {announcement.displayDuration}s
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager; 