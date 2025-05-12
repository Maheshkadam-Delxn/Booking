"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import axios from "axios";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // NEW

  const statusOptions = [
    { value: "all", label: "All Appointments" },
    { value: "pending-estimate", label: "Pending Estimate" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
  ];

  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((app) => app.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending-estimate":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending Estimate
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole"); // e.g. 'admin', 'staff', etc.
      setUserRole(role);

      if (role !== "admin") {
        setError("Admin access only");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setAppointments(data);
      } catch (err) {
        setError("Failed to fetch appointments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage customer appointments
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Link href="/admin/create-estimate">
            <Button size="sm">Create Estimate</Button>
          </Link>
          <Link href="/admin/create-service">
            <Button size="sm">Create Service</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointments available
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.customer?.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.customer?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.service?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.recurringType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/appointments/${appointment._id}`}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        View
                      </Link>
                      {appointment.status === "pending-estimate" && (
                        <Link
                          href={`/admin/create-estimate?appointment=${appointment._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Create Estimate
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
