'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../ui/Button';

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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/${editId}`, formData);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`, formData);
      }
      setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
      setIsEditing(false);
      setEditId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
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
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
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
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {isEditing ? 'Update' : 'Create'} Announcement
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        <div className="space-y-4">
          {announcements.map((announcement) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager; 