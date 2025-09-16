'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import axios from 'axios';
import moment from 'moment';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Check } from 'lucide-react';

const CustomerAppointmentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { userData } = useDashboard();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && userData?.token) {
      fetchAppointment();
    }
  }, [params.id, userData]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${params.id}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setAppointment(response.data.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      router.push('/customers/appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!appointment) {
    return (
      <CustomerLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Appointment not found</p>
        </div>
      </CustomerLayout>
    );
  }

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'in progress': return 'bg-orange-100 text-orange-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/customers/appointments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Appointments
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Appointment Details</h1>
                <p className="text-green-100 mt-1">ID: {appointment._id}</p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service</label>
                      <p className="text-gray-900">{appointment.service?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900">{appointment.service?.category || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-gray-900">{appointment.service?.duration || 'N/A'} minutes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{moment(appointment.date).format('dddd, MMMM D, YYYY')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Time</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew Assignment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Lead Professional</label>
                      <p className="text-gray-900">
                        {appointment.crew?.leadProfessional?.name || 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Team Members</label>
                      <div className="text-gray-900">
                        {appointment.crew?.assignedTo?.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {appointment.crew.assignedTo.map((member, index) => (
                              <li key={index}>{member.name}</li>
                            ))}
                          </ul>
                        ) : (
                          'No team members assigned'
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.payment?.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.payment?.status === 'paid' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Paid
                            </>
                          ) : (
                            appointment.payment?.status || 'Pending'
                          )}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount</label>
                      <p className="text-gray-900">${appointment.service?.basePrice || appointment.payment?.amount || '50.00'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Method</label>
                      <p className="text-gray-900">{appointment.payment?.paymentMethod || 'N/A'}</p>
                    </div>
                    {appointment.payment?.transactionId && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                        <p className="text-gray-900 text-xs">{appointment.payment.transactionId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {appointment.notes?.customer && (
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{appointment.notes.customer}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {appointment.status?.toLowerCase() === 'completed' && appointment.payment?.status !== 'paid' && (
                <button
                  onClick={() => router.push(`/customers/payment?appointmentId=${appointment._id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              )}
              <button
                onClick={() => router.push('/customers/appointments')}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back to Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerAppointmentDetailPage;