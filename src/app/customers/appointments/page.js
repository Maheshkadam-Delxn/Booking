"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomerLayout from "../../../components/customer/CustomerLayout";
import { useDashboard } from "@/contexts/DashboardContext";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  Users,
  HardHat,
  Package,
  User,
  ChevronRight
} from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailedAppointment, setDetailedAppointment] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading } = useDashboard();
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      // Check if user data is available
      if (!userData || isLoading) {
        setLoading(true);
        return;
      }

      const token = userData.token;
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/appointments/my-appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setAppointments(response.data.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch appointments if userData is available
    if (userData && !isLoading) {
      fetchAppointments();
    }
  }, [userData, isLoading]); // Add dependencies to re-fetch when userData changes

  // Rest of your component code remains the same...
  const getStatusBadge = (status) => {
    // ... existing status badge code ...
  };

  const getPaymentBadge = (status) => {
    // ... existing payment badge code ...
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-red-800">Error loading appointments</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your upcoming service appointments</p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-md p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Appointment Summary</h2>
              <p className="text-green-100 mt-1">
                {appointments.length} {appointments.length === 1 ? "appointment" : "appointments"} scheduled
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments yet</h3>
            <p className="mt-2 text-gray-500">
              You don't have any scheduled appointments. Book a service to get started.
            </p>
            <button
              onClick={() => router.push("/customers/services")}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <HardHat className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.service?.name || "Service"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.service?.category || "No category"}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-green-500 mr-2" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-green-500 mr-2" />
                        <span>
                          {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 text-green-500 mr-2" />
                        <span>Package:</span>
                        <span className="font-medium ml-1">
                          {appointment.packageType || "Standard"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 text-green-500 mr-2" />
                        <span>Status:</span>
                        {getPaymentBadge(appointment.payment?.status)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>{appointment.attendee?.name || "No attendee specified"}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/customers/appointments/${appointment._id}`)}
                      className="flex items-center text-sm text-green-600 hover:underline focus:outline-none"
                    >
                      <span>View details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Appointments;
